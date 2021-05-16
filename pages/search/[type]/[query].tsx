import { FC } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { VStack, MenuItem } from "@chakra-ui/react";
import { FaPlay, FaPlayCircle, FaEye } from "react-icons/fa";
import { RiPlayListFill, RiVolumeUpFill } from "react-icons/ri";
import { search, YtMusicSong, YtMusicVideo, YtMusicAlbum, YtMusicPlaylist } from "kainet-scraper";
import { Layout, SearchItem } from "@components";
import { useQueue } from "@contexts/queue";

const is = {
    song: (type: string, obj: any): obj is YtMusicSong => type === "songs",
    video: (type: string, obj: any): obj is YtMusicVideo => type === "videos",
    album: (type: string, obj: any): obj is YtMusicAlbum => type === "albums",
    playlist: (type: string, obj: any): obj is YtMusicPlaylist => type === "playlists",
};

const Search: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ results, type }) => {
    const router = useRouter();
    const { setQueue, addSong, currentSong } = useQueue();

    if (router.isFallback)
        return <div>"Loading..."</div>;

    return (
        <Layout>
            <VStack
                w={["82.5vw", "75vw", "66vw", "52.5vw"]}
                align="flex-start"
            >
                {results.map(result => (
                    is.song(type, result) ? (
                        <SearchItem
                            key={result.id}
                            imgSrc={result.thumbnails[result.thumbnails.length - 1] ?? ""}
                            btnLabel={currentSong?.id === result.id ? `Playing song '${result.title}'` : `Play song '${result.title}'`}
                            btnIcon={currentSong?.id === result.id ? <RiVolumeUpFill /> : <FaPlay />}
                            onClick={() => setQueue([result])}
                            isPlaying={currentSong?.id === result.id}
                            title={result.title}
                            subtitleListMobile={[result.artist, result.durationText]}
                            subtitleListDesktop={[result.artist, result.album, result.durationText]}
                            menuList={(
                                <>
                                    <MenuItem icon={<FaPlayCircle />} onClick={() => setQueue([result])} disabled={currentSong?.id === result.id}>
                                        Play song
                                    </MenuItem>
                                    <MenuItem icon={<RiPlayListFill />} onClick={() => addSong(result)}>
                                        Add to queue
                                    </MenuItem>
                                </>
                            )}
                        />
                    ) : is.video(type, result) ? (
                        <SearchItem
                            key={result.id}
                            imgSrc={result.thumbnails[result.thumbnails.length - 1] ?? ""}
                            imgWidth={[28, null, "8.85rem"]}
                            btnLabel={currentSong?.id === result.id ? `Playing video '${result.title}'` : `Play video '${result.title}'`}
                            btnIcon={currentSong?.id === result.id ? <RiVolumeUpFill /> : <FaPlay />}
                            onClick={() => setQueue([result])}
                            isPlaying={currentSong?.id === result.id}
                            title={result.title}
                            subtitleListMobile={[result.artist, result.durationText]}
                            subtitleListDesktop={[result.artist, `${result.views} views`, result.durationText]}
                            menuList={(
                                <>
                                    <MenuItem icon={<FaPlayCircle />} onClick={() => setQueue([result])} disabled={currentSong?.id === result.id}>
                                        Play video
                                    </MenuItem>
                                    <MenuItem icon={<RiPlayListFill />} onClick={() => addSong(result)}>
                                        Add to queue
                                    </MenuItem>
                                </>
                            )}
                        />
                    ) : is.album(type, result) ? (
                        <SearchItem
                            key={result.id}
                            imgSrc={result.thumbnails[result.thumbnails.length - 1] ?? ""}
                            btnLabel={`Open album '${result.title}'`}
                            btnIcon={<FaEye />}
                            onClick={() => {}}
                            title={result.title}
                            subtitleListMobile={[result.artist, result.year]}
                            subtitleListDesktop={[result.artist, result.year]}
                            menuList={(
                                <>
                                    <MenuItem icon={<FaEye />} onClick={() => {}}>
                                        Open album
                                    </MenuItem>
                                </>
                            )}
                        />
                    ) : is.playlist(type, result) ? (
                        <SearchItem
                            key={result.id}
                            imgSrc={result.thumbnails[result.thumbnails.length - 1] ?? ""}
                            btnLabel={`Open playlist '${result.title}'`}
                            btnIcon={<FaEye />}
                            onClick={() => {}}
                            title={result.title}
                            subtitleListMobile={[`${result.songCount} songs`]}
                            subtitleListDesktop={[`${result.songCount} songs`]}
                            menuList={(
                                <>
                                    <MenuItem icon={<FaEye />} onClick={() => {}}>
                                        Open playlist
                                    </MenuItem>
                                </>
                            )}
                        />
                    ) : null
                ))}
            </VStack>
        </Layout>
    );
};

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: [],
    fallback: "blocking"
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (!params?.type || Array.isArray(params.type) || !params?.query || Array.isArray(params.query))
        return {
            notFound: true
        };

    const { type, query } = params;

    if (type !== "songs" && type !== "videos" && type !== "albums" && type !== "playlists")
        return {
            notFound: true
        };

    const results = await search(type, query);
    return {
        props: {
            results,
            type
        },
        revalidate: results.length > 0
            ? 6 * 60 * 60 // 6 hours
            : 1
    };
};

export default Search;

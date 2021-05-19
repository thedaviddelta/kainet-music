import { FC } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { VStack, MenuItem } from "@chakra-ui/react";
import { FaPlay, FaPlayCircle, FaEye } from "react-icons/fa";
import { RiPlayListFill, RiVolumeUpFill } from "react-icons/ri";
import { search, YtMusicElement, YtMusicArtist } from "kainet-scraper";
import { Layout, SearchItem } from "@components";
import { useQueue } from "@contexts/queue";

type Props = {
    results: (Exclude<YtMusicElement, YtMusicArtist>)[]
};

const Search: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ results }) => {
    const router = useRouter();
    const { setQueue, addTrack, currentTrack } = useQueue();

    if (router.isFallback)
        return <div>Loading...</div>;

    return (
        <Layout>
            <VStack
                w={["82.5vw", "75vw", "66vw", "52.5vw"]}
                align="flex-start"
            >
                {results.map(item => (
                    item.type === "song" ? (
                        <SearchItem
                            key={item.id}
                            onClick={() => setQueue([item])}
                            title={item.title}
                            subtitlesMobile={[item.artist, item.durationText]}
                            subtitlesDesktop={[item.artist, item.album, item.durationText]}
                            imgThumbnails={item.thumbnails}
                            isPlaying={currentTrack?.id === item.id}
                            label="Play song"
                            playingLabel="Playing song"
                            icon={<FaPlay />}
                            playingIcon={<RiVolumeUpFill />}
                            mainActionIcon={<FaPlayCircle />}
                            extraMenuActions={(
                                <MenuItem icon={<RiPlayListFill />} onClick={() => addTrack(item)}>
                                    Add to queue
                                </MenuItem>
                            )}
                        />
                    ) : item.type === "video" ? (
                        <SearchItem
                            key={item.id}
                            onClick={() => setQueue([item])}
                            title={item.title}
                            subtitlesMobile={[item.artist, item.durationText]}
                            subtitlesDesktop={[item.artist, item.views ? `${item.views} views` : "", item.durationText]}
                            imgThumbnails={item.thumbnails}
                            imgWidth={[28, null, "8.85rem"]}
                            isPlaying={currentTrack?.id === item.id}
                            label="Play video"
                            playingLabel="Playing video"
                            icon={<FaPlay />}
                            playingIcon={<RiVolumeUpFill />}
                            mainActionIcon={<FaPlayCircle />}
                            extraMenuActions={(
                                <MenuItem icon={<RiPlayListFill />} onClick={() => addTrack(item)}>
                                    Add to queue
                                </MenuItem>
                            )}
                        />
                    ) : item.type === "album" ? (
                        <SearchItem
                            key={item.id}
                            href={`/album/${encodeURIComponent(item.browseId)}`}
                            title={item.title}
                            subtitlesMobile={[item.artist, item.year]}
                            subtitlesDesktop={[item.artist, item.year]}
                            imgThumbnails={item.thumbnails}
                            label="Open album"
                            icon={<FaEye />}
                        />
                    ) : item.type === "playlist" ? (
                        <SearchItem
                            key={item.id}
                            href={`/playlist/${encodeURIComponent(item.browseId)}`}
                            title={item.title}
                            subtitlesMobile={[item.trackCount ? `${item.trackCount} songs` : ""]}
                            subtitlesDesktop={[item.trackCount ? `${item.trackCount} songs` : ""]}
                            imgThumbnails={item.thumbnails}
                            label="Open playlist"
                            icon={<FaEye />}
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

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
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
            results
        },
        revalidate: results.length > 0
            ? 6 * 60 * 60 // 6 hours
            : 1
    };
};

export default Search;

import { FC } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { VStack, MenuItem } from "@chakra-ui/react";
import { FaPlay, FaPlayCircle, FaEye } from "react-icons/fa";
import { RiPlayListFill, RiVolumeUpFill } from "react-icons/ri";
import { search, YtMusicElement, YtMusicArtist } from "kainet-scraper";
import { SearchItem } from "@components";
import { useQueue } from "@contexts/queue";

type Props = {
    results: (Exclude<YtMusicElement, YtMusicArtist>)[]
};

const Search: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ results }) => {
    const { setQueue, addTrack, currentTrack } = useQueue();

    return (
        <VStack
            w={["82.5vw", "75vw", "66vw", "52.5vw"]}
            align="flex-start"
        >
            {results.map(item => (
                item.type === "song" || item.type === "video" ? (
                    <SearchItem
                        key={item.id}
                        onClick={() => setQueue([item])}
                        title={item.title}
                        subtitlesMobile={[item.artist, item.durationText]}
                        subtitlesDesktop={
                            item.type === "song"
                                ? [item.artist, item.album, item.durationText]
                                : [item.artist, item.views ? `${item.views} views` : "", item.durationText]
                        }
                        imgThumbnails={item.thumbnails}
                        imgWidth={item.type === "song" ? null : [28, null, "8.85rem"]}
                        isPlaying={currentTrack?.id === item.id}
                        label={`Play ${item.type}`}
                        playingLabel={`Playing ${item.type}`}
                        icon={<FaPlay />}
                        playingIcon={<RiVolumeUpFill />}
                        mainActionIcon={<FaPlayCircle />}
                        extraMenuActions={(
                            <MenuItem icon={<RiPlayListFill />} onClick={() => addTrack(item)}>
                                Add to queue
                            </MenuItem>
                        )}
                    />
                ) : item.type === "album" || item.type === "playlist" ? (
                    <SearchItem
                        key={item.id}
                        href={`/${item.type}/${encodeURIComponent(item.browseId)}`}
                        title={item.title}
                        subtitlesMobile={
                            item.type === "album"
                                ? [item.artist, item.year]
                                : [item.trackCount ? `${item.trackCount} songs` : ""]
                        }
                        subtitlesDesktop={
                            item.type === "album"
                                ? [item.artist, item.year]
                                : [item.trackCount ? `${item.trackCount} songs` : ""]
                        }
                        imgThumbnails={item.thumbnails}
                        label={`Open ${item.type}`}
                        icon={<FaEye />}
                    />
                ) : null
            ))}
        </VStack>
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
        revalidate: 1
    };
};

export default Search;

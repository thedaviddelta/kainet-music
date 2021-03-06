import { FC } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { VStack, HStack, Table, Thead, Tbody, Tr, Th, useBreakpointValue } from "@chakra-ui/react";
import { StarIcon, TimeIcon } from "@chakra-ui/icons";
import { FaPlay } from "react-icons/fa";
import { getAlbum, getPlaylist, parseDuration, YtMusicAlbum, YtMusicPlaylist, YtMusicTrack } from "kainet-scraper";
import { CustomError, CustomHead, ListCoverButton, ItemMetadata, ListTrack } from "@components";
import { useQueue } from "@contexts/queue";

type Props = {
    list?: YtMusicAlbum | YtMusicPlaylist
};

const MusicList: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ list }) => {
    const { setQueue, addTrack, currentTrack } = useQueue();
    const isMobile = useBreakpointValue([true, null, false]);

    if (!list)
        return <CustomError errorSubject="list information" />;

    const customTitle = `${list.title} - ${list.type[0].toLocaleUpperCase() + list.type.slice(1)}`;
    const fullCustomTitle = list.type === "album" && list.artist ? `${customTitle} by ${list.artist}` : customTitle;

    return (
        <>
            <CustomHead customTitle={fullCustomTitle} customImg={list.thumbnails[list.thumbnails.length - 1]} />

            <VStack
                w={["95vw", null, "87.5vw"]}
                align="flex-start"
                spacing={[10, null, 14]}
                my={4}
            >
                <HStack spacing={[5, null, 8]} w={["87.5vw", null, "75vw"]} mx="auto">
                    <ListCoverButton
                        onClick={() => list.tracks && setQueue(list.tracks)}
                        imgSrc={list.thumbnails[list.thumbnails.length - 1] ?? ""}
                        imgAlt={list.title}
                        imgSize={[40, null, 56]}
                        btnLabel={`Play full ${list.type}`}
                        btnIcon={<FaPlay />}
                        btnSize={["md", null, "lg"]}
                        btnBoxSize={["3.5rem", null, "4.25rem"]}
                        btnBr={["xl", null, "2xl"]}
                        btnOffset={["-1rem", null, "-1.5rem"]}
                        isBtnShown={true}
                    />

                    <ItemMetadata
                        title={list.title}
                        titleFontSize={["2xl", null, "2rem"]}
                        titleLines={2}
                        subtitlesList={[
                            list.type === "album" ? [list.artist, list.year] : null,
                            [
                                list.tracks ? `${list.tracks.length ?? 0} songs` : "",
                                parseDuration.toDetail((list.tracks as YtMusicTrack[])?.reduce(
                                    (acc, track) => acc + track.duration, 0
                                ))
                            ]
                        ]}
                        subtitlesFontSizes={[["md", null, "lg"], ["sm", null, "md"]]}
                        subtitlesLines={[2, 2]}
                        subtitlesSeparators={[
                            <StarIcon key={0} boxSize="0.575rem" mb={[0.5, null, 0]} />,
                            <StarIcon key={1} boxSize={2} mb={[1.5, null, 0.5]} />
                        ]}
                        pb={[10, null, 14]}
                    />
                </HStack>

                <Table w="full">
                    <Thead fontSize={["xs", null, "sm"]}>
                        <Tr>
                            <Th fontSize="inherit" isNumeric={true}>
                                #
                            </Th>
                            <Th fontSize="inherit">
                                Title
                            </Th>
                            {list.type === "playlist" && !isMobile && (
                                <Th fontSize="inherit" p={0}>
                                    Album
                                </Th>
                            )}
                            <Th fontSize="inherit" isNumeric={true}>
                                <TimeIcon />
                            </Th>
                            <Th />
                        </Tr>
                    </Thead>
                    <Tbody fontSize={["sm", null, "md"]}>
                        {list.tracks?.map((track, i) => (
                            <ListTrack
                                key={track.id}
                                track={track}
                                isAlbum={list.type === "album"}
                                index={i + 1}
                                isMobile={isMobile}
                                onClick={() => setQueue([...list.tracks.slice(i), ...list.tracks.slice(0, i)], true)}
                                onQueueClick={() => addTrack(track)}
                                isPlaying={currentTrack?.id === track.id || (currentTrack?.title === track.title && currentTrack?.artist === track.artist)}
                            />
                        ))}
                    </Tbody>
                </Table>
            </VStack>
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: [],
    fallback: "blocking"
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    if (!params?.listType || Array.isArray(params.listType) || !params?.browseId || Array.isArray(params.browseId))
        return {
            notFound: true
        };

    const { listType, browseId } = params;

    if (listType !== "album" && listType !== "playlist")
        return {
            notFound: true
        };

    const list = listType === "album"
        ? await getAlbum(browseId)
        : await getPlaylist(browseId);

    return {
        props: {
            list
        },
        revalidate: 1
    };
};

export default MusicList;

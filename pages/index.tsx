import { FC, useState } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { VStack, Wrap, WrapItem, Text, useBreakpointValue } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import { retrieveSuggestions, YtMusicPlaylist } from "kainet-scraper";
import { CustomError, CustomHead, ListCoverButton } from "@components";

type Props = {
    suggestions: YtMusicPlaylist[]
};

const Home: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ suggestions }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const isMobile = useBreakpointValue([true, null, false]);

    if (suggestions.length <= 0)
        return <CustomError errorSubject="suggestions" />;

    return (
        <>
            <CustomHead />

            <Wrap
                justify="center"
                maxW={["87.5vw", null, "82.5vw"]}
                spacing={[5, null, 10]}
                my={[3.5, null, 4]}
            >
                {suggestions.map((list, index) => (
                    <WrapItem key={index + list.id}>
                        <VStack
                            w={["40vw", 44, 56]}
                            spacing={[1.5, null, 2]}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => hoverIndex === index && setHoverIndex(null)}
                        >
                            <ListCoverButton
                                href={`/playlist/${encodeURIComponent(list.browseId)}`}
                                imgSrc={list.thumbnails[list.thumbnails.length - 1] ?? ""}
                                imgAlt={list.title}
                                imgSize={["40vw", 44, 56]}
                                btnLabel={`Open playlist '${list.title}'`}
                                btnIcon={<FaEye />}
                                btnSize={["md", null, "lg"]}
                                btnBoxSize={[10, null, 12]}
                                btnBr={["xl", null, "2xl"]}
                                btnOffset={[2, null, 3]}
                                isBtnShown={isMobile || hoverIndex === index}
                            />
                            <Text
                                noOfLines={2}
                                fontSize={["sm", null, "lg"]}
                                fontWeight="bold"
                                textAlign="center"
                                userSelect="none"
                            >
                                {list.title}
                            </Text>
                        </VStack>
                    </WrapItem>
                ))}
            </Wrap>
        </>
    );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
    const suggestions = await retrieveSuggestions();
    return {
        props: {
            suggestions
        },
        revalidate: suggestions.length > 10
            ? 24 * 60 * 60 // 1 day
            : 1
    };
};

export default Home;

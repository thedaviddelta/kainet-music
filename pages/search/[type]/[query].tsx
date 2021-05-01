import { FC } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { VStack, HStack, Text, Button } from "@chakra-ui/react";
import { search } from "kainet-scraper";
import { Layout } from "@components";
import { useQueue } from "@contexts/queue";

const Search: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ results }) => {
    const router = useRouter();
    const { setQueue } = useQueue();

    if (router.isFallback)
        return <div>"Loading..."</div>;

    return (
        <Layout>
            <VStack>
                {results.map(result => (
                    <HStack key={result.id}>
                        <Text>{result.title}</Text>
                        <Button onClick={() => setQueue([result])}>Play</Button>
                    </HStack>
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
            results
        },
        revalidate: results.length > 0
            ? 6 * 60 * 60 // 6 hours
            : 1
    };
};

export default Search;

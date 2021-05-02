import { FC } from "react";
import Head from "next/head";
import { VStack } from "@chakra-ui/react";
import { Header, Player } from ".";

const Layout: FC = ({ children, ...props }) => (
    <VStack minH="100vh" {...props}>
        <Head>
            <title>Kainet Music</title>
            <link rel="icon" href="/favicon.svg" />
        </Head>
        <Header />
        {children}
        <Player />
    </VStack>
);

export default Layout;

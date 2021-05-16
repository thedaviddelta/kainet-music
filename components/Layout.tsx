import { FC } from "react";
import Head from "next/head";
import { Flex, VStack, useColorModeValue } from "@chakra-ui/react";
import { Header, Player } from ".";

type Props = {
    [key: string]: any
};

const Layout: FC<Props> = ({ children, ...props }) => (
    <VStack
        minH="100vh"
        spacing={3}
        bg={useColorModeValue("kaihui.100", "kaihui.700")}
        {...props}
    >
        <Head>
            <title>Kainet Music</title>
            <link rel="icon" href="/favicon.svg" />
        </Head>

        <Header
            position="sticky"
            left={0}
            top={0}
            bg={useColorModeValue("kaihui.300", "kaihui.900")}
            zIndex={4}
        />

        <Flex
            flexGrow={1}
            w="full"
            justify="center"
        >
            {children}
        </Flex>

        <Player
            position="sticky"
            left={0}
            bottom={0}
            bg={useColorModeValue("kaihui.300", "kaihui.900")}
            zIndex={5}
        />
    </VStack>
);

export default Layout;

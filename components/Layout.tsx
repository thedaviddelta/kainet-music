import { FC } from "react";
import { Flex, VStack, Button, Link, useColorModeValue } from "@chakra-ui/react";
import { Header, Player } from ".";

type Props = {
    [key: string]: any
};

const Layout: FC<Props> = ({ children, ...props }) => (
    <>
        <Button
            as={Link}
            href="#main"
            userSelect="none"
            position="absolute"
            zIndex={8}
            top="-100px"
            left="0"
            _focus={{
                top: "0"
            }}
        >
            Skip to content
        </Button>

        <VStack
            minH="100vh"
            spacing={3}
            bg={useColorModeValue("kaihui.100", "kaihui.700")}
            {...props}
        >
            <Header
                position="sticky"
                left={0}
                top={0}
                bg={useColorModeValue("kaihui.300", "kaihui.900")}
                zIndex={4}
                boxShadow={useColorModeValue("0 0 0.5rem #a0aec0", "0 0 0.5rem #171923")}
            />

            <Flex
                as="main"
                id="main"
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
                boxShadow={useColorModeValue("0 0 0.5rem #a0aec0", "0 0 0.5rem #171923")}
            />
        </VStack>
    </>
);

export default Layout;

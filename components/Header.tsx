import { FC } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import {
    Box,
    HStack,
    Link,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuButton,
    MenuList
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { SearchBar, ColorModeToggler } from ".";

type Props = {
    [key: string]: any
};

const Header: FC<Props> = (props) => (
    <HStack
        w="full"
        px={[2, 4, 6, 10]}
        spacing={4}
        bg="gray.900"
        {...props}
    >
        <Box flex={1} my={1.5}>
            <NextLink href="/" passHref={true}>
                <Link display="flex" w="fit-content">
                    <NextImage
                        src="/favicon.svg"
                        alt="Logo"
                        layout="fixed"
                        width={56}
                        height={56}
                    />
                </Link>
            </NextLink>
        </Box>

        <SearchBar flex={1} />

        <HStack flex={1} justify="flex-end">
            <ColorModeToggler
                variant="outline"
                colorScheme="kaihui"
            />
            <IconButton
                as={Link}
                href="https://github.com/TheDavidDelta/kainet-music"
                isExternal={true}
                aria-label="GitHub"
                icon={<FaGithub />}
                variant="outline"
                colorScheme="kaihui"
            />
            <Menu>
                <MenuButton
                    as={Button}
                    px={1.5}
                    variant="ghost"
                    colorScheme="kaihui"
                >
                    <Avatar size="sm" />
                </MenuButton>
                <MenuList textAlign="center">
                    Coming soon...
                </MenuList>
            </Menu>
        </HStack>
    </HStack>
);

export default Header;

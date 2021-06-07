import { FC } from "react";
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
    MenuList,
    useDisclosure,
    useBreakpointValue
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { FaGithub } from "react-icons/fa";
import { SearchBar, ColorModeToggler, LocalLink } from ".";

type Props = {
    [key: string]: any
};

const Header: FC<Props> = (props) => {
    const { isOpen, onToggle } = useDisclosure();
    const isMobile = useBreakpointValue([true, null, false]);

    return (
        <HStack
            as="header"
            w="full"
            h="4.5rem"
            px={[6, null, null, 10]}
            {...props}
        >
            <Box flex={1} display={!isMobile || !isOpen ? null : "none"}>
                <LocalLink href="/" display="flex" w="fit-content">
                    <NextImage
                        src="/favicon.svg"
                        alt="Logo"
                        layout="fixed"
                        width={56}
                        height={56}
                    />
                </LocalLink>
            </Box>

            <Box flex={1} display={!isMobile || isOpen ? null : "none"}>
                <SearchBar />
            </Box>

            {isMobile && (
                <IconButton
                    aria-label={isOpen ? "Close search" : "Open search"}
                    icon={isOpen ? <CloseIcon /> : <SearchIcon />}
                    onClick={onToggle}
                    variant="outline"
                    colorScheme="kaihui"
                />
            )}

            {(!isMobile || !isOpen) && (
                <HStack flex={[0, null, 1]} justify="flex-end">
                    <ColorModeToggler
                        variant="outline"
                        colorScheme="kaihui"
                    />
                    <IconButton
                        as={Link}
                        href="https://github.com/TheDavidDelta/kainet-music"
                        isExternal={true}
                        aria-label="GitHub"
                        icon={<FaGithub/>}
                        variant="outline"
                        colorScheme="kaihui"
                    />
                    <Menu strategy="fixed">
                        <MenuButton
                            as={Button}
                            px={1.5}
                            variant="ghost"
                            colorScheme="kaihui"
                        >
                            <Avatar size="sm"/>
                        </MenuButton>
                        <MenuList textAlign="center">
                            Coming soon...
                        </MenuList>
                    </Menu>
                </HStack>
            )}
        </HStack>
    );
};

export default Header;

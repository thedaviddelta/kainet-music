import { FC, DOMAttributes } from "react";
import {
    HStack,
    StackDivider,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    useDisclosure,
    useBreakpointValue,
    useColorModeValue,
    LayoutProps,
    IconButtonProps
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { RiMore2Fill } from "react-icons/ri";
import { ItemMetadata, ThumbnailButton } from ".";

type Props = {
    imgSrc: string,
    imgWidth?: LayoutProps["w"],
    btnLabel: string,
    btnIcon: IconButtonProps["icon"],
    onClick: DOMAttributes<any>["onClick"],
    isPlaying?: boolean,
    title: string,
    subtitleListMobile: string[],
    subtitleListDesktop: string[],
    menuList: JSX.Element,
    [key: string]: any
};

const SearchItem: FC<Props> = ({
    imgSrc,
    imgWidth,
    btnLabel,
    btnIcon,
    onClick,
    isPlaying,
    title,
    subtitleListMobile,
    subtitleListDesktop,
    menuList,
    ...props
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useBreakpointValue([true, null, false]);

    return (
        <HStack
            w="full"
            spacing={[3, null, 4]}
            pr={1.5}
            borderRadius="md"
            bg={useColorModeValue(
                isOpen || isPlaying ? "kaihui.400" : "kaihui.300",
                isOpen || isPlaying ? "kaihui.900" : "kaihui.800"
            )}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            {...props}
        >
            <ThumbnailButton
                width={imgWidth}
                height={[16, null, 20]}
                imgSrc={imgSrc}
                imgAlt={title}
                brLeft="md"
                btnLabel={btnLabel}
                btnIcon={btnIcon}
                btnSize="lg"
                onClick={onClick}
                isBtnShown={isMobile || isOpen || isPlaying}
                isDisabled={isPlaying}
            />

            <ItemMetadata
                title={title}
                titleFontSize={["sm", null, "md"]}
                titleLines={1}
                titleOnClick={isPlaying || isMobile ? null : onClick}
                subtitleList={useBreakpointValue([subtitleListMobile, null, subtitleListDesktop])}
                subtitleFontSize={["xs", null, "sm"]}
                subtitleLines={1}
                subtitleSeparator={(
                    <StackDivider border={0} boxSize={2}>
                        <StarIcon boxSize={2} mb={[2.5, null, 1]} />
                    </StackDivider>
                )}
                flex={1}
            />

            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label="More options"
                    size="lg"
                    icon={<RiMore2Fill />}
                    variant="ghost"
                    colorScheme="kaihui"
                />
                <MenuList fontSize={["sm", null, "md"]}>
                    {menuList}
                </MenuList>
            </Menu>
        </HStack>
    );
};

export default SearchItem;

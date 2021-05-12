import { FC } from "react";
import {
    HStack,
    VStack,
    IconButton,
    ButtonGroup,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    useBreakpointValue,
    useDisclosure,
    BackgroundProps,
    LayoutProps,
    ThemingProps,
    TypographyProps,
    UsePopoverProps
} from "@chakra-ui/react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

type Props = {
    songInfo: (props: {
        titleFontSize: TypographyProps["fontSize"],
        artistFontSize: TypographyProps["fontSize"],
        titleLines: TypographyProps["noOfLines"],
        artistLines: TypographyProps["noOfLines"],
        [key: string]: any
    }) => JSX.Element,
    songThumbnail: (props: {
        boxSize: LayoutProps["boxSize"],
        [key: string]: any
    }) => JSX.Element,
    songProgress: (props: {
        width: LayoutProps["w"],
        [key: string]: any
    }) => JSX.Element,
    playbackButtons: (props: ({
        collapse: true
    } | {
        externalSize: ThemingProps["size"],
        internalSize: ThemingProps["size"]
    }) & {
        [key: string]: any
    }) => JSX.Element,
    queuePopover: (props: {
        placement: UsePopoverProps["placement"],
        [key: string]: any
    }) => JSX.Element,
    volumeControl: (props: {
        [key: string]: any
    }) => JSX.Element,
    bg: BackgroundProps["bg"],
    [key: string]: any
};

const PlayerBar: FC<Props> = (props) => {
    const Bar = useBreakpointValue([PlayerBarMobile, null, PlayerBarDesktop]) ?? PlayerBarFallback;
    return <Bar {...props} />;
};

export default PlayerBar;

const PlayerBarDesktop: FC<Props> = ({
    songInfo,
    songThumbnail,
    songProgress,
    playbackButtons,
    queuePopover,
    volumeControl,
    bg,
    ...props
}) => (
    <HStack
        w="full"
        px={6}
        spacing={4}
        bg={bg}
        {...props}
    >
        <HStack flex={1}>
            {songThumbnail({
                boxSize: 20,
                my: 4
            })}
            {songInfo({
                titleFontSize: "md",
                artistFontSize: "sm",
                titleLines: 2,
                artistLines: 1
            })}
        </HStack>

        <VStack flex={1}>
            {playbackButtons({
                externalSize: "sm",
                internalSize: "md",
                alignItems: "center"
            })}
            {songProgress({
                width: [64, null, null, 96]
            })}
        </VStack>

        <HStack flex={1} justify="flex-end">
            {queuePopover({
                placement: "top"
            })}
            {volumeControl({})}
            <div />
        </HStack>
    </HStack>
);

const PlayerBarMobile: FC<Props> = ({
    songInfo,
    songThumbnail,
    songProgress,
    playbackButtons,
    queuePopover,
    volumeControl,
    bg,
    ...props
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <HStack
                w="full"
                spacing={4}
                bg={bg}
                {...props}
            >
                <HStack flexGrow={1}>
                    {songThumbnail({
                        boxSize: 16
                    })}
                    {songInfo({
                        titleFontSize: "sm",
                        artistFontSize: "xs",
                        titleLines: 1,
                        artistLines: 1
                    })}
                </HStack>

                <ButtonGroup variant="ghost" flex={1} pr={3} spacing={3} justifyContent="flex-end">
                    {playbackButtons({
                        collapse: true
                    })}
                    <IconButton
                        aria-label="Toggle player collapse"
                        icon={<RiArrowDropUpLine size="2.5rem" />}
                        onClick={onOpen}
                    />
                </ButtonGroup>
            </HStack>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="full"
                motionPreset="slideInBottom"
                closeOnEsc={true}
                closeOnOverlayClick={true}
                returnFocusOnClose={false}
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent margin={0} bg={bg}>
                    <ModalCloseButton size="lg" top={5} left={3} right={0}>
                        <RiArrowDropDownLine size="2.5rem" />
                    </ModalCloseButton>
                    <ModalBody
                        w="full"
                        h="full"
                        px={6}
                        py={20}
                        display="flex"
                    >
                        <VStack flex={1} justify="space-around">
                            {songThumbnail({
                                boxSize: "64vw"
                            })}

                            <VStack spacing={4}>
                                {songInfo({
                                    titleFontSize: "lg",
                                    artistFontSize: "md",
                                    titleLines: 2,
                                    artistLines: 1,
                                    w: "full",
                                    px: 5,
                                    py: 2
                                })}

                                <VStack>
                                    {songProgress({
                                        width: "66vw"
                                    })}
                                    {playbackButtons({
                                        externalSize: "md",
                                        internalSize: "lg",
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                        w: "full"
                                    })}
                                </VStack>
                            </VStack>

                            <HStack w="75vw" justify="space-between">
                                {queuePopover({
                                    placement: "top-start"
                                })}
                                {volumeControl({})}
                            </HStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

const PlayerBarFallback: FC<Props> = () => <div />;

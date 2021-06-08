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
    itemMetadata: (props: {
        titleFontSize: TypographyProps["fontSize"],
        titleLines: TypographyProps["noOfLines"],
        subtitlesFontSizes: TypographyProps["fontSize"][],
        subtitlesLines: TypographyProps["noOfLines"][],
        [key: string]: any
    }) => JSX.Element,
    trackThumbnail: (props: {
        boxSize: LayoutProps["boxSize"],
        [key: string]: any
    }) => JSX.Element,
    trackProgress: (props: {
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
    const Bar = useBreakpointValue([PlayerBarMobile, null, PlayerBarDesktop]) ?? PlayerBarDesktop;
    return <Bar {...props} />;
};

export default PlayerBar;

const PlayerBarDesktop: FC<Props> = ({
    itemMetadata,
    trackThumbnail,
    trackProgress,
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
            {trackThumbnail({
                boxSize: 20,
                my: 4
            })}
            {itemMetadata({
                titleFontSize: "md",
                titleLines: 2,
                subtitlesFontSizes: ["sm"],
                subtitlesLines: [1]
            })}
        </HStack>

        <VStack flex={1}>
            {playbackButtons({
                externalSize: "sm",
                internalSize: "md",
                alignItems: "center"
            })}
            {trackProgress({
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
    itemMetadata,
    trackThumbnail,
    trackProgress,
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
                    {trackThumbnail({
                        boxSize: 16
                    })}
                    {itemMetadata({
                        titleFontSize: "sm",
                        titleLines: 1,
                        subtitlesFontSizes: ["xs"],
                        subtitlesLines: [1]
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
                        colorScheme="kaihui"
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
                    <ModalCloseButton size="lg" colorScheme="kaihui" top={5} left={3} right={0}>
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
                            {trackThumbnail({
                                boxSize: "64vw"
                            })}

                            <VStack spacing={4}>
                                {itemMetadata({
                                    titleFontSize: "lg",
                                    titleLines: 2,
                                    subtitlesFontSizes: ["md"],
                                    subtitlesLines: [1],
                                    w: "full",
                                    px: 5,
                                    py: 2
                                })}

                                <VStack>
                                    {trackProgress({
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

import { FC, useState } from "react";
import {
    HStack,
    VStack,
    Button,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Text,
    useDisclosure,
    UsePopoverProps,
    ColorProps
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { RiPlayListFill } from "react-icons/ri";
import { YtMusicTrack } from "kainet-scraper";
import { ItemMetadata, ThumbnailButton } from ".";

type Props = {
    remainingQueue: YtMusicTrack[],
    goTo: (song: YtMusicTrack) => void,
    placement: UsePopoverProps["placement"],
    selectedColor: ColorProps["color"],
    [key: string]: any
};

const QueuePopover: FC<Props> = ({
    remainingQueue,
    goTo,
    placement,
    selectedColor,
    ...props
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [showFullQueue, setShowFullQueue] = useState(false);
    const finalQueue = remainingQueue.length > 20 && !showFullQueue
        ? remainingQueue.slice(0, 20)
        : remainingQueue;

    return (
        <Popover
            closeOnBlur={false}
            placement={placement}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            {...props}
        >
            <PopoverTrigger>
                <IconButton
                    aria-label="Queue"
                    icon={<RiPlayListFill />}
                    colorScheme="kaihui"
                    color={isOpen ? selectedColor : "currentColor"}
                    variant="ghost"
                    size="lg"
                />
            </PopoverTrigger>
            <PopoverContent maxW="80vw" maxH="70vh">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Queue</PopoverHeader>
                <PopoverBody overflow="auto" p={2}>
                    {remainingQueue.length <= 0 ? (
                        <Text w="full" my={1} align="center">
                            The queue is empty
                        </Text>
                    ) : (
                        <VStack mb={2}>
                            {finalQueue.map((track, index) => (
                                <HStack key={track.id} w="full">
                                    <Text size="sm" minW={5} align="right">
                                        {index + 1}
                                    </Text>
                                    <ThumbnailButton
                                        height={12}
                                        imgSrc={track.thumbnails[track.thumbnails.length - 1] ?? ""}
                                        imgAlt={track.title}
                                        btnLabel={`Go to ${track.title}`}
                                        btnIcon={<FaPlay />}
                                        btnSize="md"
                                        onClick={() => goTo(track)}
                                        isBtnShown={true}
                                    />
                                    <ItemMetadata
                                        title={track.title}
                                        titleFontSize="md"
                                        titleLines={1}
                                        subtitlesList={[[track.artist]]}
                                        subtitlesFontSizes={["sm"]}
                                        subtitlesLines={[1]}
                                        spacing={0}
                                    />
                                </HStack>
                            ))}
                            {remainingQueue.length > 20 && (
                                <Button
                                    onClick={() => setShowFullQueue(current => !current)}
                                    variant="outline"
                                    w={44}
                                >
                                    {showFullQueue ? "See less" : "See all"}
                                </Button>
                            )}
                        </VStack>
                    )}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default QueuePopover;

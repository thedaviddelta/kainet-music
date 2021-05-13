import { FC } from "react";
import {
    Box,
    HStack,
    VStack,
    Image,
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
    UsePopoverProps
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { RiPlayListFill } from "react-icons/ri";
import { YtMusicSong, YtMusicVideo } from "kainet-scraper";
import { SongInfo } from ".";

type Props = {
    remainingQueue: (YtMusicSong & YtMusicVideo)[],
    goTo: (song: YtMusicSong | YtMusicVideo) => void,
    placement: UsePopoverProps["placement"],
    [key: string]: any
};

const QueuePopover: FC<Props> = ({
    remainingQueue,
    goTo,
    placement,
    ...props
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
                    colorScheme={isOpen ? "kaihong" : "gray"}
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
                            {remainingQueue.map((song, index) => (
                                <HStack w="full" key={song.id}>
                                    <Text size="sm" minW={5} align="right">
                                        {index + 1}
                                    </Text>
                                    <Box position="relative" minW={12} maxW={12} h={12}>
                                        <Image
                                            src={song.thumbnails[song.thumbnails.length - 1] ?? ""}
                                            fallbackSrc="/fallback.svg"
                                            alt={song.title}
                                            top={0}
                                            left={0}
                                            w="full"
                                        />
                                        <IconButton
                                            aria-label={`Go to ${song.title}`}
                                            icon={<FaPlay />}
                                            onClick={() => goTo(song)}
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            w="full"
                                            h="full"
                                            zIndex={3}
                                            borderRadius={0}
                                        />
                                    </Box>
                                    <SongInfo
                                        title={song.title}
                                        artist={song.artist}
                                        titleFontSize="md"
                                        artistFontSize="sm"
                                        titleLines={1}
                                        artistLines={1}
                                        spacing={0}
                                    />
                                </HStack>
                            ))}
                        </VStack>
                    )}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default QueuePopover;

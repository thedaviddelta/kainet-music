import { FC } from "react";
import {
    HStack,
    VStack,
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
import { ItemMetadata, ThumbnailButton } from ".";

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
                                    <ThumbnailButton
                                        height={12}
                                        imgSrc={song.thumbnails[song.thumbnails.length - 1] ?? ""}
                                        imgAlt={song.title}
                                        btnLabel={`Go to ${song.title}`}
                                        btnIcon={<FaPlay />}
                                        btnSize="md"
                                        onClick={() => goTo(song)}
                                        isBtnShown={true}
                                    />
                                    <ItemMetadata
                                        title={song.title}
                                        titleFontSize="md"
                                        titleLines={1}
                                        subtitleList={[song.artist]}
                                        subtitleFontSize="sm"
                                        subtitleLines={1}
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

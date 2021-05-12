import { FC } from "react";
import {
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
import { RiPlayListFill } from "react-icons/ri";
import { YtMusicSong, YtMusicVideo } from "kainet-scraper";

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
                <PopoverBody overflow="auto">
                    {remainingQueue.map(song => (
                        <>
                            <IconButton aria-label={song.title} onClick={() => goTo(song)} />
                            <Text>{song.title}</Text>
                        </>
                    ))}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default QueuePopover;

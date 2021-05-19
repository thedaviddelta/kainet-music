import { FC, DOMAttributes } from "react";
import { Icon, IconButton, Tr, Td, Menu, MenuButton, MenuList, MenuItem, useDisclosure } from "@chakra-ui/react";
import { FaPlayCircle } from "react-icons/fa";
import { RiMore2Fill, RiPlayListFill } from "react-icons/ri";
import { YtMusicTrack } from "kainet-scraper";
import { ListTrackAlbum, ListTrackPlaylist } from ".";

type Props = {
    track: YtMusicTrack,
    isAlbum: boolean,
    index?: number,
    isMobile: boolean,
    onClick: DOMAttributes<any>["onClick"],
    onQueueClick: DOMAttributes<any>["onClick"],
    isPlaying: boolean,
    [key: string]: any
};

const ListTrack: FC<Props> = ({
    track,
    isAlbum,
    index,
    isMobile,
    onClick,
    onQueueClick,
    isPlaying,
    ...props
}) => {
    const { isOpen, onOpen, onClose} = useDisclosure();
    const playLabel = `${isPlaying ? "Playing" : "Play"} ${isAlbum ? "track" : track.type}`;

    return (
        <Tr
            opacity={isOpen || isPlaying ? 0.8 : 1}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            {...props}
        >
            {isAlbum ? (
                <ListTrackAlbum
                    title={track.title}
                    playLabel={playLabel}
                    index={index ?? 0}
                    onClick={onClick}
                    isPlaying={isPlaying}
                    isOpen={isOpen}
                />
            ): (
                <ListTrackPlaylist
                    track={track}
                    playLabel={playLabel}
                    showAlbum={!isMobile}
                    onClick={onClick}
                    isPlaying={isPlaying}
                    isOpen={isOpen}
                />
            )}

            <Td isNumeric={true}>
                {track.durationText}
            </Td>

            <Td p={0.5}>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="More options"
                        icon={<Icon as={RiMore2Fill} />}
                        disabled={!isOpen && !isMobile}
                        _disabled={{ color: "transparent" }}
                        variant="unstyled"
                        colorScheme="kaihui"
                        size="sm"
                        w="fit-content"
                        h="fit-content"
                        minW={0}
                        minH={0}
                        lineHeight={0}
                    />
                    <MenuList fontSize="inherit" zIndex={6}>
                        <MenuItem icon={<FaPlayCircle />} onClick={onClick} isDisabled={isPlaying}>
                            {playLabel}
                        </MenuItem>
                        <MenuItem icon={<RiPlayListFill />} onClick={onQueueClick}>
                            Add to queue
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Td>
        </Tr>
    );
};

export default ListTrack;

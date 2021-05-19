import { FC, DOMAttributes } from "react";
import { Icon, IconButton, Tr, Td, Menu, MenuButton, MenuList, MenuItem, useDisclosure } from "@chakra-ui/react";
import { FaPlayCircle } from "react-icons/fa";
import { RiMore2Fill, RiPlayListFill } from "react-icons/ri";
import { YtMusicSong, YtMusicVideo } from "kainet-scraper";
import { ListTrackAlbum, ListTrackPlaylist } from ".";

type Props = {
    type: "album" | "playlist",
    track: YtMusicSong | YtMusicVideo,
    index?: number,
    isMobile: boolean,
    onClick: DOMAttributes<any>["onClick"],
    onQueueClick: DOMAttributes<any>["onClick"],
    isPlaying: boolean,
    [key: string]: any
};

const ListTrack: FC<Props> = ({
    type,
    track,
    index,
    isMobile,
    onClick,
    onQueueClick,
    isPlaying,
    ...props
}) => {
    const { isOpen, onOpen, onClose} = useDisclosure();
    const playLabel = type === "album"
        ? "Play track"
        : "album" in track && track.album
            ? "Play song"
            : "Play video";

    return (
        <Tr
            opacity={isOpen || isPlaying ? 0.8 : 1}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            {...props}
        >
            {type === "album" ? (
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

            <Td>
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
                        <MenuItem icon={<FaPlayCircle />} onClick={onClick} disabled={isPlaying}>
                            {"album" in track && track.album ? "Play song" : "Play video"}
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

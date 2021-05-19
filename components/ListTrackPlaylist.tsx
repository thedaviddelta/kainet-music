import { FC, DOMAttributes, } from "react";
import { Flex, Td } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { RiVolumeUpFill } from "react-icons/ri";
import { YtMusicTrack } from "kainet-scraper";
import { ThumbnailButton, ItemMetadata } from ".";

type Props = {
    track: YtMusicTrack,
    playLabel: string,
    showAlbum: boolean,
    onClick: DOMAttributes<any>["onClick"],
    isPlaying: boolean,
    isOpen: boolean
};

const ListTrackPlaylist: FC<Props> = ({
    track,
    playLabel,
    showAlbum,
    onClick,
    isPlaying,
    isOpen
}) => (
    <>
        <Td isNumeric={true} p={1.5} pr={0.5}>
            <Flex justify="flex-end">
                <ThumbnailButton
                    height={track.type === "song" ? [12, null, 14] : ["1.85rem", null, "2.1rem"]}
                    width={[12, null, 14]}
                    imgSrc={track.thumbnails[track.thumbnails.length - 1]}
                    imgAlt={track.title}
                    btnLabel={`${playLabel} '${track.title}'`}
                    btnIcon={isPlaying ? <RiVolumeUpFill /> : <FaPlay />}
                    btnSize="lg"
                    onClick={onClick}
                    isBtnShown={isOpen || isPlaying}
                    isDisabled={isPlaying}
                    p={0}
                />
            </Flex>
        </Td>

        <Td>
            <ItemMetadata
                title={track.title}
                titleFontSize="inherit"
                titleLines={2}
                titleOnClick={isPlaying ? null : onClick}
                subtitlesList={[[track.artist]]}
                subtitlesFontSizes={["inherit"]}
                subtitlesLines={[1]}
            />
        </Td>

        {showAlbum && (
            <Td>
                {track.type === "song" && track.album}
            </Td>
        )}
    </>
);

export default ListTrackPlaylist;

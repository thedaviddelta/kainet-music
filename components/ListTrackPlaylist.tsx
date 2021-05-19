import { FC, DOMAttributes, } from "react";
import { Td } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { RiVolumeUpFill } from "react-icons/ri";
import { YtMusicSong, YtMusicVideo } from "kainet-scraper";
import { ThumbnailButton, ItemMetadata } from ".";

type Props = {
    track: YtMusicSong | YtMusicVideo,
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
        <Td isNumeric={true} p={1.5} pr={0}>
            <ThumbnailButton
                height={"album" in track && track.album ? [12, null, 14] : ["1.85rem", null, "2.1rem"]}
                width={[12, null, 14]}
                imgSrc={track.thumbnails[track.thumbnails.length - 1]}
                imgAlt={track.title}
                btnLabel={`${playLabel} '${track.title}'`}
                btnIcon={isPlaying ? <RiVolumeUpFill /> : <FaPlay />}
                btnSize="lg"
                onClick={onClick}
                isBtnShown={isOpen || isPlaying}
                isDisabled={isPlaying}
            />
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
                {"album" in track && track.album}
            </Td>
        )}
    </>
);

export default ListTrackPlaylist;

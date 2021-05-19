import { FC } from "react";
import { IconButton, ButtonGroup, ThemingProps, ColorProps } from "@chakra-ui/react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { RiShuffleLine, RiRepeat2Line, RiRepeatOneLine } from "react-icons/ri";

type Props = ({
    collapse: true
} | {
    externalSize: ThemingProps["size"],
    internalSize: ThemingProps["size"]
}) & {
    isPlaybackEmpty: boolean,
    isPlaying: boolean,
    togglePlay: () => void,
    canPrev: boolean,
    prev: () => void,
    next: () => void,
    isShuffle: boolean,
    toggleShuffle: () => void,
    isNotRepeating: boolean,
    isRepeatingOne: boolean,
    toggleRepeat: () => void,
    selectedColor: ColorProps["color"],
    [key: string]: any
}

const PlaybackButtons: FC<Props> = ({
    collapse,
    externalSize,
    internalSize,
    isPlaybackEmpty,
    isPlaying,
    togglePlay,
    canPrev,
    prev,
    next,
    isShuffle,
    toggleShuffle,
    isNotRepeating,
    isRepeatingOne,
    toggleRepeat,
    selectedColor,
    ...props
}) => (
    collapse ? (
        <IconButton
            aria-label={isPlaying ? "Pause" : "Play"}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            isDisabled={isPlaybackEmpty}
            onClick={togglePlay}
            {...props}
        />
    ) : (
        <ButtonGroup variant="ghost" size={externalSize} spacing={4} {...props}>
            <IconButton
                aria-label="Shuffle"
                icon={<RiShuffleLine />}
                onClick={toggleShuffle}
                colorScheme="kaihui"
                color={isShuffle ? selectedColor : "currentColor"}
            />
            <ButtonGroup variant="ghost" colorScheme="kaihui" size={internalSize} isDisabled={isPlaybackEmpty}>
                <IconButton
                    aria-label="Previous"
                    icon={<FaStepBackward />}
                    onClick={prev}
                    disabled={!canPrev}
                />
                <IconButton
                    aria-label={isPlaying ? "Pause" : "Play"}
                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                    variant="solid"
                    onClick={togglePlay}
                />
                <IconButton
                    aria-label="Next"
                    icon={<FaStepForward />}
                    onClick={next}
                />
            </ButtonGroup>
            <IconButton
                aria-label="Repeat"
                icon={isRepeatingOne ? <RiRepeatOneLine /> : <RiRepeat2Line />}
                onClick={toggleRepeat}
                colorScheme="kaihui"
                color={!isNotRepeating ? selectedColor : "currentColor"}
            />
        </ButtonGroup>
    )
);

export default PlaybackButtons;

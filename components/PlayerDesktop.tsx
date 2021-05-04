import { FC } from "react";
import {
    HStack,
    VStack,
    Text,
    Image,
    IconButton,
    ButtonGroup,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    BackgroundProps
} from "@chakra-ui/react";
import {
    RiShuffleLine,
    RiRepeat2Line,
    RiRepeatOneLine,
    RiVolumeDownFill,
    RiVolumeUpFill,
    RiPlayListFill
} from "react-icons/ri";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";

type Props = {
    imgSrc: string,
    title: string,
    artist: string,
    canPrev: boolean,
    timeToText: (secs: number) => string,
    prev: () => void,
    next: () => void,
    currentTime: number,
    duration: number,
    volume: number,
    isPlaybackEmpty: boolean,
    isPlaying: boolean,
    togglePlay: () => void,
    setCurrentTime: (time: number, manual?: any) => void,
    setVolume: (value: number) => void,
    bg: BackgroundProps["bg"],
    [key: string]: any
};

const PlayerDesktop: FC<Props> = ({
    imgSrc,
    title,
    artist,
    canPrev,
    timeToText,
    prev,
    next,
    currentTime,
    duration,
    volume,
    isPlaybackEmpty,
    isPlaying,
    togglePlay,
    setCurrentTime,
    setVolume,
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
            <Image
                boxSize={20}
                my={4}
                src={imgSrc}
                fallbackSrc="/fallback.svg"
                alt={title}
            />
            <VStack alignItems="start" spacing={1}>
                <Text fontSize="md" noOfLines={2} fontWeight="bold">
                    {title}
                </Text>
                <Text fontSize="sm" noOfLines={1}>
                    {artist}
                </Text>
            </VStack>
        </HStack>

        <VStack flex={1}>
            <ButtonGroup variant="ghost" size="sm" alignItems="center" spacing={4}>
                <IconButton
                    aria-label="Shuffle"
                    icon={<RiShuffleLine />}
                />
                <ButtonGroup variant="ghost" size="md" isDisabled={isPlaybackEmpty}>
                    <IconButton
                        aria-label="Previous"
                        icon={<FaStepBackward />}
                        onClick={prev}
                        disabled={!canPrev && currentTime <= 5}
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
                    icon={<RiRepeat2Line />}
                />
            </ButtonGroup>
            <HStack>
                <Text fontSize="xs">{timeToText(currentTime)}</Text>
                <Slider
                    aria-label="Song progress"
                    colorScheme="gray"
                    w={[64, null, null, 96]}
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={value => setCurrentTime(value, true)}
                    focusThumbOnChange={false}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                </Slider>
                <Text fontSize="xs">{timeToText(duration)}</Text>
            </HStack>
        </VStack>

        <HStack flex={1} justify="flex-end">
            <IconButton
                aria-label="Queue"
                icon={<RiPlayListFill />}
                variant="ghost"
                size="lg"
            />
            <Slider
                aria-label="Volume"
                colorScheme="gray"
                min={0}
                max={100}
                value={volume}
                onChange={setVolume}
                w={120}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={4} color="black" bg="gray.200" p="0.1rem">
                    {volume > 50 ? <RiVolumeUpFill /> : <RiVolumeDownFill />}
                </SliderThumb>
            </Slider>
            <div />
        </HStack>
    </HStack>
);

export default PlayerDesktop;

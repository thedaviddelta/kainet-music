import { FC, SyntheticEvent, useEffect, useReducer, useRef, useCallback } from "react";
import { Stack, HStack, VStack, Text, Image, IconButton, ButtonGroup, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { RiShuffleLine, RiRepeat2Line, RiRepeatOneLine, RiVolumeDownFill, RiVolumeUpFill, RiPlayListFill } from "react-icons/ri";
import { useQueue } from "@contexts/queue";
import reducer, { ActionType, initialState } from "@reducers/player";

const Player: FC = (props) => {
    const { currentSong, canPrev, prevSong, nextSong } = useQueue();
    const [state, dispatch] = useReducer(reducer, initialState);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const prev = useCallback(() => {
        if (canPrev && state.currentTime <= 5)
            return prevSong();
        dispatch({ type: ActionType.TIME_UPDATE, payload: { time: 0, manual: true } });
    }, [canPrev, prevSong, state.currentTime]);

    const timeToText = (secs: number = 0) => {
        const hours = Math.floor(secs / 3600);
        const hoursRest = Math.floor(secs % 3600);
        const mins = Math.floor(hoursRest / 60);
        const minsRest = Math.floor(hoursRest % 60);
        return [hours || -1, mins, minsRest]
            .filter(el => el >= 0)
            .map(el => el.toString().padStart(3 - el.toString().length, "0"))
            .join(":");
    };

    useEffect(() => {
        if (!currentSong)
            return dispatch({ type: ActionType.STOP });

        dispatch({ type: ActionType.PAUSE });
        fetch(`/api/source?id=${currentSong.id}`)
            .then(res => res.json())
            .then(json => {
                const { url, duration } = json;
                dispatch({ type: ActionType.SETUP, payload: { sourceUrl: url, duration } });
            }).catch(() => (
                dispatch({ type: ActionType.STOP })
            ));
    }, [currentSong]);

    useEffect(() => {
        if (!audioRef.current)
            return;
        state.playback === "playing"
            ? audioRef.current.play()
            : audioRef.current.pause();

        if (!navigator.mediaSession || !currentSong)
            return;
        navigator.mediaSession.playbackState = state.playback;
        navigator.mediaSession.metadata = state.playback === "none"
            ? null
            : new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist,
                album: currentSong.album,
                artwork: currentSong.thumbnails.map(src => {
                    const [, width, height] = src.match(/=w(\d+)-h(\d+)/) ?? [];
                    return { src, sizes: width && height && `${width}x${height}`  };
                })
            });
    }, [state.playback, currentSong]);

    useEffect(() => {
        if (!state.timeUpdated || !audioRef.current)
            return;
        audioRef.current.currentTime = state.currentTime;
        dispatch({ type: ActionType.SET_FIELD, payload: { key: "timeUpdated", value: false } });
        navigator.mediaSession?.setPositionState({
            duration: state.duration,
            position: state.currentTime
        });
    }, [state.currentTime, state.duration, state.timeUpdated]);

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.volume = state.volume / 100;
    }, [state.volume]);

    useEffect(() => {
        if (!navigator.mediaSession)
            return;
        navigator.mediaSession.setActionHandler("play", () => dispatch({ type: ActionType.PLAY }));
        navigator.mediaSession.setActionHandler("pause", () => dispatch({ type: ActionType.PAUSE }));
        navigator.mediaSession.setActionHandler("stop", () => dispatch({ type: ActionType.STOP }));
        navigator.mediaSession.setActionHandler("previoustrack", prev);
        navigator.mediaSession.setActionHandler("nexttrack", nextSong);
        navigator.mediaSession.setActionHandler("seekto", details => (
            dispatch({ type: ActionType.TIME_UPDATE, payload: { time: details.seekTime, manual: true } })
        ));
    }, [prev, nextSong]);

    return (
        <HStack
            w="full"
            px={6}
            spacing={4}
            bg="gray.900"
            {...props}
        >
            <Stack
                direction={["column", null, "row"]}
                align="center"
                flex={1}
            >
                <Image
                    boxSize={20}
                    my={4}
                    src={currentSong?.thumbnails?.[currentSong.thumbnails.length - 1] ?? ""}
                    fallbackSrc="/fallback.svg"
                    alt={currentSong?.title ?? ""}
                />
                <VStack alignItems="start" spacing={1}>
                    <Text fontWeight="bold" noOfLines={[1, null, 2]}>
                        {currentSong?.title ?? "No song"}
                    </Text>
                    <Text fontSize="sm" noOfLines={1}>
                        {currentSong?.artist ?? "Unknown"}
                    </Text>
                </VStack>
            </Stack>

            <Stack
                direction={["column", null, "column-reverse"]}
                flex={1}
                align="center"
            >
                <HStack>
                    <Text fontSize="xs">{timeToText(state.currentTime)}</Text>
                    <Slider
                        aria-label="Song progress"
                        colorScheme="gray"
                        w={["full", null, 64, 96]}
                        min={0}
                        max={state.duration}
                        value={state.currentTime}
                        onChange={value => dispatch({ type: ActionType.TIME_UPDATE, payload: { time: value, manual: true } })}
                        focusThumbOnChange={false}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                    </Slider>
                    <Text fontSize="xs">{timeToText(state.duration)}</Text>
                </HStack>
                <ButtonGroup variant="ghost" size="sm" alignItems="center" spacing={4}>
                    <IconButton
                        aria-label="Shuffle"
                        icon={<RiShuffleLine />}
                    />
                    <ButtonGroup variant="ghost" isDisabled={state.playback === "none"}>
                        <IconButton
                            aria-label="Previous"
                            icon={<FaStepBackward />}
                            onClick={prev}
                            disabled={(!canPrev && state.currentTime <= 5)}
                        />
                        <IconButton
                            aria-label={state.playback === "playing" ? "Pause" : "Play"}
                            icon={state.playback === "playing" ? <FaPause /> : <FaPlay />}
                            variant="solid"
                            onClick={() => dispatch({ type: state.playback === "playing" ? ActionType.PAUSE : ActionType.PLAY })}
                        />
                        <IconButton
                            aria-label="Next"
                            icon={<FaStepForward />}
                            onClick={nextSong}
                        />
                    </ButtonGroup>
                    <IconButton
                        aria-label="Repeat"
                        icon={<RiRepeat2Line />}
                    />
                </ButtonGroup>
            </Stack>

            <HStack
                flex={1}
                justify="flex-end"
            >
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
                    value={state.volume}
                    onChange={value => dispatch({ type: ActionType.SET_FIELD, payload: { key: "volume", value } })}
                    w={120}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={4} color="black" bg="gray.200" p="0.1rem">
                        {state.volume > 50 ? <RiVolumeUpFill /> : <RiVolumeDownFill />}
                    </SliderThumb>
                </Slider>
            </HStack>

            <audio
                ref={audioRef}
                src={state.sourceUrl}
                onPlay={() => dispatch({ type: ActionType.PLAY })}
                onPause={() => dispatch({ type: ActionType.PAUSE })}
                onEnded={nextSong}
                onTimeUpdate={(e: SyntheticEvent<HTMLAudioElement> & { target: HTMLAudioElement }) => (
                    dispatch({ type: ActionType.TIME_UPDATE, payload: { time: e.target.currentTime } })
                )}
            />
        </HStack>
    );
};

export default Player;

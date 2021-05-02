import { FC, SyntheticEvent, useEffect, useReducer, useRef, useCallback } from "react";
import { Button, HStack, Image, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
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

    useEffect(() => {
        if (!currentSong)
            return dispatch({ type: ActionType.STOP });

        dispatch({ type: ActionType.PAUSE });
        fetch(`/api/source?id=${currentSong.id}`)
            .then(res => res.json())
            .then(json => {
                const { url, duration } = json;
                dispatch({ type: ActionType.SETUP, payload: { sourceUrl: url, duration } })
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
        <HStack {...props}>
            <Image
                borderRadius="full"
                boxSize="150px"
                src={currentSong?.thumbnails?.[currentSong.thumbnails.length - 1] ?? ""}
                alt={currentSong?.title ?? ""}
            />
            <Button
                onClick={() => dispatch({ type: state.playback === "playing" ? ActionType.PAUSE : ActionType.PLAY })}
                disabled={state.playback === "none"}
            >
                {state.playback === "playing" ? "Pause" : "Play"}
            </Button>
            <Slider
                aria-label="Song progress"
                min={0}
                max={state.duration}
                value={state.currentTime}
                onChange={value => dispatch({ type: ActionType.TIME_UPDATE, payload: { time: value, manual: true } })}
                focusThumbOnChange={false}
                w="full"
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
            <Slider
                aria-label="Volume"
                min={0}
                max={100}
                value={state.volume}
                onChange={value => dispatch({ type: ActionType.SET_FIELD, payload: { key: "volume", value } })}
                w={16}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
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

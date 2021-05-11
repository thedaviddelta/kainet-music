import { FC, SyntheticEvent, useEffect, useReducer, useRef, useCallback } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import { useQueue } from "@contexts/queue";
import reducer, { ActionType, initialState } from "@reducers/player";
import { PlayerDesktop, PlayerMobile } from ".";

type Props = {
    [key: string]: any
};

const Player: FC<Props> = (props) => {
    const { remainingQueue, currentSong, canPrev, prevSong, nextSong, isShuffle, toggleShuffle, repeatType, toggleRepeat, goTo } = useQueue();
    const [state, dispatch] = useReducer(reducer, initialState);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const timeToText = useCallback((secs: number = 0) => {
        const hours = Math.floor(secs / 3600);
        const hoursRest = Math.floor(secs % 3600);
        const mins = Math.floor(hoursRest / 60);
        const minsRest = Math.floor(hoursRest % 60);
        return [hours || -1, mins, minsRest]
            .filter(el => el >= 0)
            .map(el => el.toString().padStart(3 - el.toString().length, "0"))
            .join(":");
    }, []);

    const togglePlay = useCallback(() => (
        dispatch({ type: state.playback === "playing" ? ActionType.PAUSE : ActionType.PLAY })
    ), [state.playback]);

    const setCurrentTime = useCallback((time: number, manual = false) => (
        dispatch({ type: ActionType.TIME_UPDATE, payload: { time, manual } })
    ), []);

    const setVolume = useCallback((value: number) => (
        dispatch({ type: ActionType.SET_FIELD, payload: { key: "volume", value } })
    ), []);

    const prev = useCallback(() => {
        if (canPrev && state.currentTime <= 5)
            prevSong();
        setCurrentTime(0, true);
    }, [canPrev, prevSong, state.currentTime, setCurrentTime]);

    const next = useCallback(() => {
        nextSong();
        setCurrentTime(0, true);
    }, [nextSong, setCurrentTime]);

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
        navigator.mediaSession.setActionHandler("seekto", details => setCurrentTime(details.seekTime, true));
    }, [prev, nextSong, setCurrentTime]);

    const PlayerBar = useBreakpointValue([PlayerMobile, null, PlayerDesktop]) ?? PlayerDesktop;

    return (
        <>
            <PlayerBar
                imgSrc={currentSong?.thumbnails?.[currentSong.thumbnails.length - 1] ?? ""}
                title={currentSong?.title ?? "No song"}
                artist={currentSong?.artist ?? "Unknown"}
                timeToText={timeToText}
                remainingQueue={remainingQueue}
                canPrev={canPrev}
                prev={prev}
                next={next}
                goTo={goTo}
                isShuffle={isShuffle}
                toggleShuffle={toggleShuffle}
                repeatType={repeatType}
                toggleRepeat={toggleRepeat}
                currentTime={state.currentTime}
                duration={state.duration}
                volume={state.volume}
                isPlaybackEmpty={state.playback === "none"}
                isPlaying={state.playback === "playing"}
                togglePlay={togglePlay}
                setCurrentTime={setCurrentTime}
                setVolume={setVolume}
                bg="gray.900"
                {...props}
            />
            <audio
                ref={audioRef}
                src={state.sourceUrl}
                onPlay={() => dispatch({ type: ActionType.PLAY })}
                onPause={() => dispatch({ type: ActionType.PAUSE })}
                onEnded={next}
                loop={repeatType === "one"}
                onTimeUpdate={(e: SyntheticEvent<HTMLAudioElement> & { target: HTMLAudioElement }) => (
                    setCurrentTime(e.target.currentTime)
                )}
            />
        </>
    );
};

export default Player;

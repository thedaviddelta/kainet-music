import { useEffect, useReducer, useRef, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { useQueue } from "@contexts/queue";
import reducer, { ActionType, initialState } from "@reducers/player";

const initLocalStorage = (state: typeof initialState) => {
    const initialVolume = typeof window !== "undefined" && localStorage.getItem("volume");
    return {
        ...state,
        volume: initialVolume
            ? +initialVolume
            : state.volume
    };
};

const usePlayer = () => {
    const {
        remainingQueue,
        currentTrack,
        canPrev,
        prevTrack,
        nextTrack,
        isShuffle,
        toggleShuffle,
        repeatType,
        toggleRepeat,
        goTo
    } = useQueue();

    const [state, dispatch] = useReducer(reducer, initialState, initLocalStorage);
    const { playback, duration, currentTime, timeAltered, sourceUrl, volume } = state;

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const toast = useToast();

    const play = useCallback(() => (
        dispatch({ type: ActionType.PLAY })
    ), []);

    const pause = useCallback(() => (
        dispatch({ type: ActionType.PAUSE })
    ), []);

    const stop = useCallback(() => (
        dispatch({ type: ActionType.STOP })
    ), []);

    const togglePlay = useCallback(() => (
        dispatch({ type: playback === "playing" ? ActionType.PAUSE : ActionType.PLAY })
    ), [playback]);

    const setCurrentTime = useCallback((time: number, manual = false) => (
        dispatch({ type: ActionType.TIME_UPDATE, payload: { time, manual } })
    ), []);

    const setVolume = useCallback((value: number) => (
        dispatch({ type: ActionType.SET_FIELD, payload: { key: "volume", value } })
    ), []);

    const prev = useCallback(() => {
        if (canPrev && currentTime <= 5)
            prevTrack();
        setCurrentTime(0, true);
    }, [canPrev, prevTrack, currentTime, setCurrentTime]);

    const next = useCallback(() => {
        nextTrack();
        setCurrentTime(0, true);
    }, [nextTrack, setCurrentTime]);

    useEffect(() => {
        if (!currentTrack)
            return stop();

        pause();
        const controller = new AbortController();

        fetch(`/api/source?id=${currentTrack.id}`, {
            signal: controller.signal
        }).then(res => {
            if (!res.ok)
                throw new Error(`${res.status} - ${res.statusText}`);
            return res.json();
        }).then(json => {
            const { url, duration } = json;
            dispatch({ type: ActionType.SETUP, payload: { sourceUrl: url, duration } });
        }).catch(err => {
            stop();
            if (err.name !== "AbortError")
                toast({
                    title: "Unexpected error",
                    description: "An error occurred while retrieving the track information",
                    status: "error",
                    duration: 3500
                });
        });

        return () => {
            controller?.abort();
        };
    }, [currentTrack, pause, stop, toast]);

    useEffect(() => {
        if (!audioRef.current)
            return;
        playback === "playing"
            ? audioRef.current.play()
            : audioRef.current.pause();

        if (!navigator.mediaSession || !currentTrack)
            return;
        navigator.mediaSession.playbackState = playback;
        navigator.mediaSession.metadata = playback === "none"
            ? null
            : new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: currentTrack.type === "song"
                    ? currentTrack.album
                    : undefined,
                artwork: currentTrack.thumbnails.map(src => {
                    const [, width, height] = src.match(/=w(\d+)-h(\d+)/) ?? [];
                    return { src, sizes: width && height && `${width}x${height}`  };
                })
            });
    }, [playback, currentTrack]);

    useEffect(() => {
        if (!timeAltered || !audioRef.current)
            return;
        audioRef.current.currentTime = currentTime;
        dispatch({ type: ActionType.SET_FIELD, payload: { key: "timeAltered", value: false } });
        navigator.mediaSession?.setPositionState({
            duration,
            position: currentTime
        });
    }, [currentTime, duration, timeAltered]);

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.volume = volume / 100;
        localStorage.setItem("volume", volume.toString());
    }, [volume]);

    useEffect(() => {
        if (!navigator.mediaSession)
            return;
        navigator.mediaSession.setActionHandler("play", play);
        navigator.mediaSession.setActionHandler("pause", pause);
        navigator.mediaSession.setActionHandler("stop", stop);
        navigator.mediaSession.setActionHandler("previoustrack", prev);
        navigator.mediaSession.setActionHandler("nexttrack", next);
        navigator.mediaSession.setActionHandler("seekto", details => setCurrentTime(details.seekTime, true));
    }, [play, pause, stop, prev, next, setCurrentTime]);

    return {
        audioRef,
        sourceUrl,
        currentTrack,
        isPlaybackEmpty: playback === "none",
        isPlaying: playback === "playing",
        play,
        pause,
        togglePlay,
        currentTime,
        duration,
        setCurrentTime,
        volume,
        setVolume,
        canPrev: canPrev || currentTime > 5,
        prev,
        next,
        isShuffle,
        toggleShuffle,
        isNotRepeating: repeatType === "none",
        isRepeatingOne: repeatType === "one",
        toggleRepeat,
        remainingQueue,
        goTo
    };
};

export default usePlayer;

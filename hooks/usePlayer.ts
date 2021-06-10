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
        isTrackAlone,
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

    const updateSource = useCallback((
        id: string,
        signal: AbortSignal,
        retry: number = 0
    ) => {
        const url = `/api/source?id=${id}`;

        fetch(url, {
            signal
        }).then(res => {
            if (!res.ok)
                throw new Error(`${res.status} - ${res.statusText}`);
            return res.json();
        }).then(async json => {
            const { url, duration } = json;
            dispatch({ type: ActionType.SETUP, payload: { sourceUrl: url, duration } });

            if ("mediaSession" in navigator)
                navigator.mediaSession?.setPositionState({
                    duration,
                    position: 0
                });

            await audioRef.current?.play();
            dispatch({ type: ActionType.PLAY });
        }).catch(async err => {
            if ("caches" in window)
                await window.caches.open("api-source-url")
                    .then(cache => cache.delete(url));

            if (err.name === "AbortError")
                return;
            if (retry >= 0 && retry < 3)
                return updateSource(id, signal, retry + 1);

            dispatch({ type: ActionType.STOP });
            toast({
                title: "Unexpected error",
                description: "An error occurred while retrieving the track information",
                status: "error",
                duration: 3500
            });
        });
    }, [toast]);

    useEffect(() => {
        if (!currentTrack)
            return dispatch({ type: ActionType.STOP });

        dispatch({ type: ActionType.PAUSE });
        const controller = new AbortController();

        updateSource(currentTrack.id, controller.signal);

        return () => {
            controller?.abort();
        };
    }, [currentTrack, updateSource]);

    useEffect(() => {
        if (!audioRef.current)
            return;

        playback === "playing"
            ? audioRef.current.play()
            : audioRef.current.pause();
    }, [playback]);

    useEffect(() => {
        if (!("mediaSession" in navigator) || !navigator.mediaSession)
            return;

        navigator.mediaSession.playbackState = playback;
        navigator.mediaSession.metadata = playback === "none" || !currentTrack
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

        if ("mediaSession" in navigator)
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
        if (!("mediaSession" in navigator) || !navigator.mediaSession)
            return;

        navigator.mediaSession.setActionHandler("play", () => dispatch({ type: ActionType.PLAY }));
        navigator.mediaSession.setActionHandler("pause", () => dispatch({ type: ActionType.PAUSE }));
        navigator.mediaSession.setActionHandler("stop", () => dispatch({ type: ActionType.STOP }));
        navigator.mediaSession.setActionHandler("previoustrack", prev);
        navigator.mediaSession.setActionHandler("nexttrack", next);
        navigator.mediaSession.setActionHandler("seekto", details => setCurrentTime(details.seekTime, true));
    }, [prev, next, setCurrentTime]);

    return {
        audioRef,
        sourceUrl,
        currentTrack,
        isTrackAlone,
        isPlaybackEmpty: playback === "none",
        isPlaying: playback === "playing",
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
        isRepeatingAll: repeatType === "all",
        isRepeatingOne: repeatType === "one",
        toggleRepeat,
        remainingQueue,
        goTo
    };
};

export default usePlayer;

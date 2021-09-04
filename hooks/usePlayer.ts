import { useEffect, useReducer, useRef, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { useQueue } from "@contexts/queue";
import reducer, { ActionType, initialState } from "@reducers/player";
import { localGetItem, localSetItem } from "@utils/storage";

const initLocalStorage = (state: typeof initialState) => {
    const initialVolume = localGetItem("volume");
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
    const { playback, duration, currentTime, timeAltered, volume, refetchCount } = state;

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const toast = useToast();

    const sourceUrl = useMemo(() => (
        currentTrack?.id
            ? `/api/source?id=${currentTrack.id}`
            : ""
    ), [currentTrack]);

    const play = useCallback(() => (
        dispatch({ type: ActionType.PLAY })
    ), []);

    const pause = useCallback(() => (
        dispatch({ type: ActionType.PAUSE })
    ), []);

    const stop = useCallback(() => (
        dispatch({ type: ActionType.STOP })
    ), []);

    const setCurrentTime = useCallback((time: number, manual = false) => (
        dispatch({ type: ActionType.TIME_UPDATE, payload: { time, manual } })
    ), []);

    const setVolume = useCallback((value: number) => (
        dispatch({ type: ActionType.SET_FIELD, payload: { key: "volume", value } })
    ), []);

    const setup = useCallback((duration: number) => {
        dispatch({ type: ActionType.SETUP, payload: { duration } });
        if ("mediaSession" in navigator)
            navigator.mediaSession?.setPositionState({
                duration,
                position: 0
            });
    }, []);

    const onLoadError = useCallback(async () => {
        if (!sourceUrl)
            return;

        await window.caches.open("api-source-url")
            .then(cache => cache.delete(sourceUrl));

        if (refetchCount < 3) {
            dispatch({ type: ActionType.SET_FIELD, payload: { key: "refetchCount", value: refetchCount + 1 } });
            audioRef.current.load();
            return;
        }

        stop();
        toast({
            title: "Unexpected error",
            description: "An error occurred while retrieving the track information",
            status: "error",
            duration: 3500
        });
    }, [sourceUrl, refetchCount, stop, toast]);

    const prev = useCallback(() => {
        if (canPrev && currentTime <= 5)
            prevTrack();
        setCurrentTime(0, true);
    }, [canPrev, prevTrack, currentTime, setCurrentTime]);

    const next = useCallback(() => {
        nextTrack();
        setCurrentTime(0, true);
    }, [nextTrack, setCurrentTime]);

    useEffect(() => (
        sourceUrl
            ? pause()
            : stop()
    ), [sourceUrl, pause, stop]);

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
        localSetItem("volume", volume.toString());
    }, [volume]);

    useEffect(() => {
        if (!("mediaSession" in navigator) || !navigator.mediaSession)
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
        isTrackAlone,
        setup,
        onLoadError,
        isPlaybackEmpty: playback === "none",
        isPlaying: playback === "playing",
        play,
        pause,
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

import { FC, SyntheticEvent, useEffect, useReducer, useRef, useCallback } from "react";
import { Image, useToast, BackgroundProps } from "@chakra-ui/react";
import { useQueue } from "@contexts/queue";
import reducer, { ActionType, initialState } from "@reducers/player";
import { PlayerBar, SongInfo, SongProgress, PlaybackButtons, QueuePopover, VolumeControl } from ".";

const initLocalStorage = (state: typeof initialState) => {
    const initialVolume = typeof window !== "undefined" && localStorage.getItem("volume");
    return {
        ...state,
        volume: initialVolume
            ? +initialVolume
            : state.volume
    };
};

type Props = {
    bg: BackgroundProps["bg"],
    [key: string]: any
};

const Player: FC<Props> = (props) => {
    const { remainingQueue, currentSong, canPrev, prevSong, nextSong, isShuffle, toggleShuffle, repeatType, toggleRepeat, goTo } = useQueue();
    const [state, dispatch] = useReducer(reducer, initialState, initLocalStorage);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const toast = useToast();

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
        const controller = new AbortController();

        fetch(`/api/source?id=${currentSong.id}`, {
            signal: controller.signal
        }).then(res => {
            if (!res.ok)
                throw new Error(`${res.status} - ${res.statusText}`);
            return res.json();
        }).then(json => {
            const { url, duration } = json;
            dispatch({ type: ActionType.SETUP, payload: { sourceUrl: url, duration } });
        }).catch(() => {
            dispatch({ type: ActionType.STOP });
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
    }, [currentSong, toast]);

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
        localStorage.setItem("volume", state.volume.toString());
    }, [state.volume]);

    useEffect(() => {
        if (!navigator.mediaSession)
            return;
        navigator.mediaSession.setActionHandler("play", () => dispatch({ type: ActionType.PLAY }));
        navigator.mediaSession.setActionHandler("pause", () => dispatch({ type: ActionType.PAUSE }));
        navigator.mediaSession.setActionHandler("stop", () => dispatch({ type: ActionType.STOP }));
        navigator.mediaSession.setActionHandler("previoustrack", prev);
        navigator.mediaSession.setActionHandler("nexttrack", next);
        navigator.mediaSession.setActionHandler("seekto", details => setCurrentTime(details.seekTime, true));
    }, [prev, next, setCurrentTime]);

    return (
        <>
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

            <PlayerBar
                songInfo={(props) => (
                    <SongInfo
                        title={currentSong?.title ?? "No song"}
                        artist={currentSong?.artist ?? "Unknown"}
                        {...props}
                    />
                )}
                songThumbnail={(props) => (
                    <Image
                        src={currentSong?.thumbnails?.[currentSong.thumbnails.length - 1] ?? ""}
                        fallbackSrc="/fallback.svg"
                        alt={currentSong?.title ?? "No song"}
                        {...props}
                    />
                )}
                songProgress={(props) => (
                    <SongProgress
                        currentTime={state.currentTime}
                        duration={state.duration}
                        setCurrentTime={setCurrentTime}
                        {...props}
                    />
                )}
                playbackButtons={(props) => (
                    <PlaybackButtons
                        isPlaybackEmpty={state.playback === "none"}
                        isPlaying={state.playback === "playing"}
                        togglePlay={togglePlay}
                        canPrev={canPrev || state.currentTime > 5}
                        prev={prev}
                        next={next}
                        isShuffle={isShuffle}
                        toggleShuffle={toggleShuffle}
                        isNotRepeating={repeatType !== "none"}
                        isRepeatingOne={repeatType === "one"}
                        toggleRepeat={toggleRepeat}
                        {...props}
                    />
                )}
                queuePopover={(props) => (
                    <QueuePopover
                        remainingQueue={remainingQueue}
                        goTo={goTo}
                        {...props}
                    />
                )}
                volumeControl={(props) => (
                    <VolumeControl
                        volume={state.volume}
                        setVolume={setVolume}
                        {...props}
                    />
                )}
                {...props}
            />
        </>
    );
};

export default Player;

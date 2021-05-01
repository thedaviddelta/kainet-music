import { FC, SyntheticEvent, useEffect, useReducer, useRef } from "react";
import { Button, HStack, Image, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useQueue } from "@contexts/queue";
import reducer, { ActionType, initialState } from "@reducers/player";

const Player: FC = (props) => {
    const { currentSong } = useQueue();
    const [state, dispatch] = useReducer(reducer, initialState);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!currentSong)
            return;
        audioRef.current?.pause();
        fetch(`/api/source?id=${currentSong.id}`)
            .then(res => res.json())
            .then(json => {
                const { url, duration } = json;
                dispatch({ type: ActionType.SETUP, payload: { sourceUrl: url, duration } })
                audioRef.current?.play();
            }).catch(() => {
                dispatch({ type: ActionType.CLEAR });
            });
    }, [currentSong]);

    useEffect(() => {
        state.isPlaying
            ? audioRef.current?.play()
            : audioRef.current?.pause();
    }, [state.isPlaying]);

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.currentTime = state.userTime;
    }, [state.userTime]);

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.volume = state.volume / 100;
    }, [state.volume]);

    return (
        <HStack {...props}>
            <Image
                borderRadius="full"
                boxSize="150px"
                src={(currentSong?.thumbnails?.[currentSong.thumbnails.length - 1]) ?? ""}
                alt={currentSong?.title ?? ""}
            />
            <Button onClick={() => dispatch({ type: state.isPlaying ? ActionType.PAUSE : ActionType.PLAY })}>
                {state.isPlaying ? "Pause" : "Play"}
            </Button>
            <Slider
                aria-label="Song progress"
                min={0}
                max={state.duration}
                value={state.currentTime}
                onChange={value => dispatch({ type: ActionType.SET_FIELD, payload: { key: "userTime", value } })}
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
                onTimeUpdate={(e: SyntheticEvent<HTMLAudioElement> & { target: HTMLAudioElement }) => (
                    dispatch({ type: ActionType.SET_FIELD, payload: { key: "currentTime", value: e.target.currentTime } }
                ))}
            />
        </HStack>
    );
};

export default Player;

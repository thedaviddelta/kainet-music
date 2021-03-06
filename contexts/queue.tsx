import { createContext, Dispatch, FC, useContext, useReducer, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { YtMusicTrack } from "kainet-scraper";
import reducer, { Action, ActionType, initialState, RepeatType } from "@reducers/queue";
import { localGetItem, localSetItem } from "@utils/storage";

const QueueContext = createContext<[
    typeof initialState,
    Dispatch<Action>
]>([
    initialState,
    () => {}
]);

const initLocalStorage = (state: typeof initialState) => {
    const initialShuffle = localGetItem("shuffle");
    const initialRepeat = localGetItem("repeat");
    return {
        ...state,
        shuffle: initialShuffle
            ? initialShuffle === "true"
            : state.shuffle,
        repeat: initialRepeat
            ? +initialRepeat
            : state.repeat
    };
};

export const QueueProvider: FC = ({ children }) => (
    <QueueContext.Provider value={useReducer(reducer, initialState, initLocalStorage)}>
        {children}
    </QueueContext.Provider>
);

export const useQueue = () => {
    const [state, dispatch] = useContext(QueueContext);
    const { mainQueue, sortedQueue, current, shuffle, repeat } = state;

    const toast = useToast();

    useEffect(() => {
        localSetItem("shuffle", shuffle.toString());
    }, [shuffle]);

    useEffect(() => {
        localSetItem("repeat", repeat.toString());
    }, [repeat]);

    return {
        remainingQueue: [...mainQueue.slice(current + 1), ...sortedQueue],
        currentTrack: mainQueue[current],
        isTrackAlone: mainQueue.length <= 1 && sortedQueue.length <= 0,
        canPrev: (repeat !== RepeatType.NONE || current > 0) && (mainQueue.length > 0 || sortedQueue.length > 0),
        isShuffle: shuffle,
        repeatType: RepeatType[repeat].toLocaleLowerCase() as Lowercase<keyof typeof RepeatType>,
        setQueue(queue: YtMusicTrack[], keepFirst?: boolean) {
            dispatch({ type: ActionType.SET, payload: { queue, keepFirst } });
        },
        addTrack(song: YtMusicTrack) {
            dispatch({ type: ActionType.ADD, payload: { track: song } });
            toast({
                title: "Added to queue",
                description: "Track successfully added to the queue",
                status: "success",
                duration: 1250
            });
        },
        prevTrack() {
            dispatch({ type: ActionType.PREV });
        },
        nextTrack() {
            dispatch({ type: ActionType.NEXT });
        },
        toggleShuffle() {
            dispatch({ type: ActionType.TOGGLE_SHUFFLE });
        },
        toggleRepeat() {
            dispatch({ type: ActionType.TOGGLE_REPEAT });
        },
        goTo(song: YtMusicTrack) {
            dispatch({ type: ActionType.GOTO, payload: { track: song } });
        },
        reset() {
            dispatch({ type: ActionType.RESET });
        }
    };
};

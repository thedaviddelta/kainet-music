import { createContext, Dispatch, FC, useContext, useReducer, useEffect } from "react";
import { YtMusicSong, YtMusicVideo } from "kainet-scraper";
import reducer, { Action, ActionType, initialState, RepeatType } from "@reducers/queue";

const QueueContext = createContext<[
    typeof initialState,
    Dispatch<Action>
]>([
    initialState,
    () => {}
]);

const initLocalStorage = (state: typeof initialState) => {
    const initialShuffle = typeof window !== "undefined" && localStorage.getItem("shuffle");
    const initialRepeat = typeof window !== "undefined" && localStorage.getItem("repeat");
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

    useEffect(() => {
        localStorage.setItem("shuffle", shuffle.toString());
    }, [shuffle]);

    useEffect(() => {
        localStorage.setItem("repeat", repeat.toString());
    }, [repeat]);

    return {
        remainingQueue: [...mainQueue.slice(current + 1), ...sortedQueue],
        currentSong: mainQueue[current],
        canPrev: (repeat !== RepeatType.NONE || current > 0) && (mainQueue.length > 0 || sortedQueue.length > 0),
        isShuffle: shuffle,
        repeatType: RepeatType[repeat].toLocaleLowerCase() as Lowercase<keyof typeof RepeatType>,
        setQueue(queue: (YtMusicSong & YtMusicVideo)[]) {
            dispatch({ type: ActionType.SET, payload: { queue } });
        },
        addSong(song: YtMusicSong & YtMusicVideo) {
            dispatch({ type: ActionType.ADD, payload: { song } });
        },
        prevSong() {
            dispatch({ type: ActionType.PREV });
        },
        nextSong() {
            dispatch({ type: ActionType.NEXT });
        },
        toggleShuffle() {
            dispatch({ type: ActionType.TOGGLE_SHUFFLE });
        },
        toggleRepeat() {
            dispatch({ type: ActionType.TOGGLE_REPEAT });
        },
        goTo(song: YtMusicSong | YtMusicVideo) {
            dispatch({ type: ActionType.GOTO, payload: { song } });
        }
    };
};

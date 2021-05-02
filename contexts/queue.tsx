import { createContext, Dispatch, FC, useContext, useReducer } from "react";
import { YtMusicSong, YtMusicVideo } from "kainet-scraper";
import reducer, { Action, ActionType, initialState } from "../reducers/queue";

const QueueContext = createContext<[
    typeof initialState,
    Dispatch<Action>
]>([
    initialState,
    () => {}
]);

export const QueueProvider: FC = ({ children }) => (
    <QueueContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </QueueContext.Provider>
);

export const useQueue = () => {
    const [state, dispatch] = useContext(QueueContext);
    const { queue, current } = state;
    return {
        queue,
        currentSong: queue[current],
        canPrev: current > 0,
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
        }
    };
};

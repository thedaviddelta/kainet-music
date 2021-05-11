import { YtMusicSong, YtMusicVideo } from "kainet-scraper";

export enum RepeatType {
    NONE,
    ALL,
    ONE
}

type State = {
    mainQueue: (YtMusicSong & YtMusicVideo)[],
    nextQueue: (YtMusicSong & YtMusicVideo)[],
    sortedQueue: (YtMusicSong & YtMusicVideo)[],
    current: number,
    shuffle: boolean,
    repeat: RepeatType
};

export const initialState: State = {
    mainQueue: [],
    nextQueue: [],
    sortedQueue: [],
    current: 0,
    shuffle: false,
    repeat: RepeatType.NONE
};

export enum ActionType {
    SET,
    ADD,
    PREV,
    NEXT,
    TOGGLE_SHUFFLE,
    TOGGLE_REPEAT,
    GOTO
}

export type Action = {
    type: ActionType.SET,
    payload: {
        queue: (YtMusicSong & YtMusicVideo)[]
    }
} | {
    type: ActionType.ADD,
    payload: {
        song: YtMusicSong | YtMusicVideo
    }
} | {
    type: ActionType.PREV
} | {
    type: ActionType.NEXT
} | {
    type: ActionType.TOGGLE_SHUFFLE
} | {
    type: ActionType.TOGGLE_REPEAT
} | {
    type: ActionType.GOTO,
    payload: {
        song: YtMusicSong | YtMusicVideo
    }
};

export default function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SET:
            const queue = [...action.payload.queue];
            const firstSong = queue.shift();
            return {
                ...state,
                mainQueue: firstSong
                    ? [firstSong]
                    : [],
                nextQueue: queue,
                sortedQueue: state.shuffle
                    ? [...queue].sort(() => Math.random() - 0.5)
                    : queue,
                current: 0
            };
        case ActionType.ADD:
            return {
                ...state,
                mainQueue: [
                    ...state.mainQueue,
                    action.payload.song
                ]
            };
        case ActionType.PREV:
            if (state.repeat === RepeatType.ONE)
                return {
                    ...state
                };

            if (state.current > 0)
                return {
                    ...state,
                    current: state.current - 1
                };

            if (state.repeat === RepeatType.ALL) {
                const sortedQueue = [...state.sortedQueue];
                const lastSong = sortedQueue.pop();

                return {
                    ...state,
                    current: 0,
                    mainQueue: lastSong
                        ? [lastSong, ...state.mainQueue]
                        : state.mainQueue,
                    nextQueue: state.nextQueue.filter(song => song !== lastSong),
                    sortedQueue
                };
            }

            return {
                ...state,
                current: 0
            };
        case ActionType.NEXT:
            if (state.repeat === RepeatType.ONE)
                return {
                    ...state
                };

            const nextIndex = state.current + 1;
            if (nextIndex < state.mainQueue.length)
                return {
                    ...state,
                    current: nextIndex
                };

            if (state.sortedQueue.length <= 0 && state.repeat === RepeatType.ALL) {
                const mainQueue = [...state.mainQueue];
                const firstSong = mainQueue.shift();
                return {
                    ...state,
                    mainQueue: firstSong ? [firstSong] : [],
                    nextQueue: mainQueue,
                    sortedQueue: mainQueue,
                    current: 0
                };
            }

            const sortedQueue = [...state.sortedQueue];
            const nextSong = sortedQueue.shift();

            return {
                ...state,
                current: nextIndex,
                mainQueue: nextSong
                    ? [...state.mainQueue, nextSong]
                    : state.mainQueue,
                nextQueue: state.nextQueue.filter(song => song !== nextSong),
                sortedQueue
            };
        case ActionType.TOGGLE_SHUFFLE:
            const shuffle = !state.shuffle;
            return {
                ...state,
                sortedQueue: shuffle
                    ? [...state.nextQueue].sort(() => Math.random() - 0.5)
                    : state.nextQueue,
                shuffle
            };
        case ActionType.TOGGLE_REPEAT:
            return {
                ...state,
                repeat: state.repeat < 2
                    ? state.repeat + 1
                    : 0
            };
        case ActionType.GOTO:
            const searchedSong = action.payload.song;
            const mainIndex = state.mainQueue.findIndex(song => song === searchedSong);
            if (mainIndex !== -1)
                return {
                    ...state,
                    current: mainIndex
                };

            const finalIndex = state.sortedQueue.findIndex(song => song === searchedSong);
            if (finalIndex === -1)
                return {
                    ...state,
                    current: 0
                };

            const newMainQueue = state.sortedQueue.slice(0, finalIndex + 1);
            const finalSortedQueue = state.sortedQueue.slice(finalIndex + 1);
            console.log(state.sortedQueue, newMainQueue, finalSortedQueue);

            return {
                ...state,
                current: state.mainQueue.length + finalIndex,
                mainQueue: [...state.mainQueue, ...newMainQueue],
                nextQueue: state.nextQueue.filter(song => !finalSortedQueue.includes(song)),
                sortedQueue: finalSortedQueue
            };
        default:
            return state;
    }
}

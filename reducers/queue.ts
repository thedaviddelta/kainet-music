import { YtMusicTrack } from "kainet-scraper";

export enum RepeatType {
    NONE,
    ALL,
    ONE
}

type State = {
    mainQueue: YtMusicTrack[],
    nextQueue: YtMusicTrack[],
    sortedQueue: YtMusicTrack[],
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
        queue: YtMusicTrack[],
        keepFirst?: boolean
    }
} | {
    type: ActionType.ADD,
    payload: {
        track: YtMusicTrack
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
        track: YtMusicTrack
    }
};

// Durstenfeld shuffle
const shuffleList = <T>(list: T[]): T[] => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

export default function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SET:
            const initialQueue = [...action.payload.queue];

            if (!state.shuffle || action.payload.keepFirst) {
                const firstTrack = initialQueue.shift();
                const initialSortedQueue = state.shuffle
                    ? shuffleList(initialQueue)
                    : initialQueue;

                return {
                    ...state,
                    mainQueue: firstTrack ? [firstTrack] : [],
                    nextQueue: initialQueue,
                    sortedQueue: initialSortedQueue,
                    current: 0
                };
            }

            const initialSortedQueue = shuffleList(initialQueue);
            const firstTrack = initialSortedQueue.shift();

            return {
                ...state,
                mainQueue: firstTrack ? [firstTrack] : [],
                nextQueue: initialQueue.filter(track => track !== firstTrack),
                sortedQueue: initialSortedQueue,
                current: 0
            };
        case ActionType.ADD:
            return {
                ...state,
                mainQueue: [
                    ...state.mainQueue,
                    action.payload.track
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
                const lastTrack = sortedQueue.pop();

                return {
                    ...state,
                    current: 0,
                    mainQueue: lastTrack
                        ? [lastTrack, ...state.mainQueue]
                        : state.mainQueue,
                    nextQueue: state.nextQueue.filter(track => track !== lastTrack),
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
                const firstTrack = mainQueue.shift();
                return {
                    ...state,
                    mainQueue: firstTrack
                        ? [firstTrack]
                        : [],
                    nextQueue: mainQueue,
                    sortedQueue: mainQueue,
                    current: 0
                };
            }

            const sortedQueue = [...state.sortedQueue];
            const nextTrack = sortedQueue.shift();

            return {
                ...state,
                current: nextIndex,
                mainQueue: nextTrack
                    ? [...state.mainQueue, nextTrack]
                    : state.mainQueue,
                nextQueue: state.nextQueue.filter(track => track !== nextTrack),
                sortedQueue
            };
        case ActionType.TOGGLE_SHUFFLE:
            const shuffle = !state.shuffle;
            return {
                ...state,
                sortedQueue: shuffle
                    ? shuffleList(state.nextQueue)
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
            const searchedTrack = action.payload.track;
            const mainIndex = state.mainQueue.findIndex(track => track === searchedTrack);
            if (mainIndex !== -1)
                return {
                    ...state,
                    current: mainIndex
                };

            const finalIndex = state.sortedQueue.findIndex(track => track === searchedTrack);
            if (finalIndex === -1)
                return {
                    ...state,
                    current: 0
                };

            const newMainQueue = state.sortedQueue.slice(0, finalIndex + 1);
            const finalSortedQueue = state.sortedQueue.slice(finalIndex + 1);

            return {
                ...state,
                current: state.mainQueue.length + finalIndex,
                mainQueue: [...state.mainQueue, ...newMainQueue],
                nextQueue: state.nextQueue.filter(track => !finalSortedQueue.includes(track)),
                sortedQueue: finalSortedQueue
            };
        default:
            return state;
    }
}

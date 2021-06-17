type State = {
    playback: "playing" | "paused" | "none",
    duration: number,
    currentTime: number,
    timeAltered: boolean,
    volume: number,
    refetchCount: number
};

export const initialState: State = {
    playback: "none",
    duration: 0,
    currentTime: 0,
    timeAltered: false,
    volume: 100,
    refetchCount: 0
};

export enum ActionType {
    SET_FIELD,
    PLAY,
    PAUSE,
    SETUP,
    STOP,
    TIME_UPDATE
}

type Action = {
    type: ActionType.SET_FIELD,
    payload: {
        key: string,
        value: any
    }
} | {
    type: ActionType.PLAY
} | {
    type: ActionType.PAUSE
} | {
    type: ActionType.SETUP,
    payload: {
        duration: number
    }
} | {
    type: ActionType.STOP
} | {
    type: ActionType.TIME_UPDATE,
    payload: {
        time: number,
        manual?: boolean
    }
};

export default function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SET_FIELD:
            const { key, value } = action.payload;
            return { ...state, [key]: value };
        case ActionType.PLAY:
            return { ...state, playback: "playing" };
        case ActionType.PAUSE:
            return { ...state, playback: "paused" };
        case ActionType.SETUP:
            const { duration } = action.payload;
            return { ...state, duration, currentTime: 0, playback: "playing", refetchCount: 0 };
        case ActionType.STOP:
            return { ...state, duration: 0, currentTime: 0, playback: "none", refetchCount: 0 };
        case ActionType.TIME_UPDATE:
            const { time, manual } = action.payload;
            return { ...state, currentTime: time, timeAltered: manual || state.timeAltered };
        default:
            return state;
    }
}

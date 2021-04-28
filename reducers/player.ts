type State = {
    isPlaying: boolean,
    duration: number,
    currentTime: number,
    userTime: number,
    sourceUrl: string,
    volume: number
};

export const initialState: State = {
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    userTime: 0,
    sourceUrl: "",
    volume: 100
};

export enum ActionType {
    SET_FIELD,
    PLAY,
    PAUSE,
    SETUP,
    CLEAR
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
        duration: number,
        sourceUrl: string
    }
} | {
    type: ActionType.CLEAR
};

export default function reducer(state: State, action: Action) {
    switch (action.type) {
        case ActionType.SET_FIELD:
            const { key, value } = action.payload;
            return { ...state, [key]: value };
        case ActionType.PLAY:
            return { ...state, isPlaying: true };
        case ActionType.PAUSE:
            return { ...state, isPlaying: false };
        case ActionType.SETUP:
            const { sourceUrl, duration } = action.payload;
            return { ...state, sourceUrl, duration, currentTime: 0, userTime: 0, isPlaying: true };
        case ActionType.CLEAR:
            return { ...state, sourceUrl: "", duration: 0, currentTime: 0, userTime: 0, isPlaying: true };
        default:
            return state;
    }
}

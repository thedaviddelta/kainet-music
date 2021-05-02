import { YtMusicSong, YtMusicVideo } from "kainet-scraper";

type State = {
    queue: (YtMusicSong & YtMusicVideo)[],
    current: number
};

export const initialState: State = {
    queue: [],
    current: 0
};

export enum ActionType {
    SET,
    ADD,
    PREV,
    NEXT
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
};

export default function reducer(state: State, action: Action) {
    switch (action.type) {
        case ActionType.SET:
            return {
                ...state,
                queue: action.payload.queue,
                current: 0
            };
        case ActionType.ADD:
            return {
                ...state,
                queue: [
                    ...state.queue,
                    action.payload.song
                ]
            };
        case ActionType.PREV:
            return {
                ...state,
                current: state.current > 0 ? state.current - 1 : 0
            };
        case ActionType.NEXT:
            return {
                ...state,
                current: state.current + 1
            };
        default:
            return state;
    }
}

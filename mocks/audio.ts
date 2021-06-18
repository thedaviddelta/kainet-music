export const play = jest.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(async () => undefined);
export const pause = jest.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
export const load = jest.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);

export const resetAllMocks = () => {
    play.mockReset();
    pause.mockReset();
    load.mockReset();
};

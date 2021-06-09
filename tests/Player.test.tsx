import { render, screen, waitFor, act } from "./reactUtils";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import * as audioMock from "@mocks/audio";
import queueSetup from "@mocks/queue";
import { localStorageSetMock } from "@mocks/localStorage";
import { playlistMock } from "@mocks/data";
import { Player } from "@components";

const { QueueWrapper, queue } = queueSetup();
const tracks = playlistMock.tracks ?? [];

beforeEach(() => {
    render(<Player bg="kaihui.900" />, { wrapper: QueueWrapper });
    act(() => queue.reset());
    audioMock.resetAllMocks();
    fetchMock.doMock(async () => JSON.stringify({
        url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Sample-OGG-File.ogg",
        duration: 348
    }));
});

it("plays, pauses and skips tracks correctly", async () => {
    const prevBtn = screen.getByRole("button", { name: /previous/i });
    const playBtn = screen.getByRole("button", { name: /play/i });
    const nextBtn = screen.getByRole("button", { name: /next/i });

    expect(prevBtn).toBeDisabled();
    expect(playBtn).toBeDisabled();
    expect(nextBtn).toBeDisabled();

    act(() => queue.setQueue(tracks.slice(0, 2)));

    await waitFor(() => expect(audioMock.play).toHaveBeenCalled());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(queue.currentTrack).toStrictEqual(tracks[0]);
    expect(prevBtn).toBeDisabled();
    expect(playBtn).not.toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    expect(playBtn).toHaveAttribute("aria-label", "Pause");
    userEvent.click(playBtn);
    await waitFor(() => expect(audioMock.pause).toHaveBeenCalled());
    expect(playBtn).toHaveAttribute("aria-label", "Play");

    audioMock.resetAllMocks();
    userEvent.click(nextBtn);

    await waitFor(() => expect(audioMock.play).toHaveBeenCalled());
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(queue.currentTrack).toStrictEqual(tracks[1]);
    expect(prevBtn).not.toBeDisabled();
    expect(playBtn).not.toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    userEvent.click(prevBtn);
    await waitFor(() => expect(queue.currentTrack).toStrictEqual(tracks[0]));
});

it("toggles shuffle and repeat correctly", async () => {
    const shuffleBtn = screen.getByRole("button", { name: /shuffle/i });
    const repeatBtn = screen.getByRole("button", { name: /repeat/i });

    act(() => queue.setQueue(tracks));

    const restOfTracks = [...tracks];
    const firstTrack = restOfTracks.shift();

    await waitFor(() => expect(queue.isShuffle).toBe(false));
    expect(queue.currentTrack).toStrictEqual(firstTrack);
    expect(queue.remainingQueue).toStrictEqual(restOfTracks);

    userEvent.click(shuffleBtn);

    expect(queue.isShuffle).toBe(true);
    expect(localStorageSetMock).toHaveBeenLastCalledWith("shuffle", "true");
    expect(queue.currentTrack).toStrictEqual(firstTrack);
    expect(queue.remainingQueue).toStrictEqual(expect.arrayContaining(restOfTracks));
    expect(queue.remainingQueue).not.toStrictEqual(restOfTracks);

    userEvent.click(shuffleBtn);

    expect(queue.isShuffle).toBe(false);
    expect(localStorageSetMock).toHaveBeenLastCalledWith("shuffle", "false");
    expect(queue.currentTrack).toStrictEqual(firstTrack);
    expect(queue.remainingQueue).toStrictEqual(restOfTracks);

    expect(queue.repeatType).toBe("none");
    userEvent.click(repeatBtn);
    expect(queue.repeatType).toBe("all");
    expect(localStorageSetMock).toHaveBeenLastCalledWith("repeat", "1");
    userEvent.click(repeatBtn);
    expect(queue.repeatType).toBe("one");
    expect(localStorageSetMock).toHaveBeenLastCalledWith("repeat", "2");
    userEvent.click(repeatBtn);
    expect(queue.repeatType).toBe("none");
    expect(localStorageSetMock).toHaveBeenLastCalledWith("repeat", "0");
});

it("shows queue and toggles full queue list", async () => {
    act(() => queue.setQueue(tracks));

    const queueBtn = screen.getByRole("button", { name: /queue/i });
    userEvent.click(queueBtn);

    const trackBtns = await screen.findAllByRole("button", { name: /go to/i });
    expect(trackBtns[0]).toHaveAttribute("aria-label", expect.stringContaining(tracks[1].title));
    expect(trackBtns).toHaveLength(20);

    const toggleBtn = screen.getByRole("button", { name: /see all/i });
    userEvent.click(toggleBtn);
    expect(screen.getAllByRole("button", { name: /go to/i })).toHaveLength(tracks.length - 1);

    userEvent.click(trackBtns[2]);
    await waitFor(() => expect(queue.currentTrack).toStrictEqual(tracks[3]));
}, 9500);

import { render, screen, waitFor, act } from "./reactUtils";
import userEvent from "@testing-library/user-event";
import { albumMock, playlistMock } from "@mocks/data";
import queueSetup from "@mocks/queue";
import MusicList from "@pages/[listType]/[browseId]";

const { QueueWrapper, queue } = queueSetup();

const tests = {
    title: async (list: typeof albumMock | typeof playlistMock) => {
        const firstTrack = list.tracks?.[0];
        const secondTrack = list.tracks?.[1];
        const thirdTrack = list.tracks?.[2];

        userEvent.click(screen.getByText(secondTrack.title));
        expect(queue.currentTrack).toStrictEqual(secondTrack);
        expect(queue.remainingQueue).toStrictEqual(list.tracks ? [...list.tracks.slice(2), firstTrack] : []);

        act(() => queue.toggleShuffle());
        userEvent.click(screen.getByText(thirdTrack.title));
        expect(queue.currentTrack).toStrictEqual(thirdTrack);

        act(() => queue.toggleShuffle());
        const restOfTracks = list.tracks && [...list.tracks.slice(3), ...list.tracks.slice(0, 2)];
        expect(queue.remainingQueue).toStrictEqual(restOfTracks);
    },
    button: (list: typeof albumMock | typeof playlistMock) => {
        const firstTrack = list.tracks?.[0];

        const title = screen.getByText(firstTrack.title);
        userEvent.hover(title);

        const btn = screen.getByRole("button", { name: /play (track|song|video)/i });
        userEvent.click(btn);

        expect(queue.currentTrack).toStrictEqual(firstTrack);
    },
    menu: async (list: typeof albumMock | typeof playlistMock) => {
        const optionsBtn = screen.getAllByRole("button", { name: /more options/i });

        const firstTrack = list.tracks?.[0];
        const firstTitle = screen.getByText(firstTrack.title);
        userEvent.hover(firstTitle);

        await waitFor(() => userEvent.click(optionsBtn[0]));
        const playBtn = await screen.findByRole("menuitem", { name: /play (track|song|video)/i });
        userEvent.click(playBtn);
        expect(queue.currentTrack).toStrictEqual(firstTrack);

        const secondTrack = list.tracks?.[0];
        const secondTitle = screen.getByText(secondTrack.title);
        userEvent.hover(secondTitle);

        await waitFor(() => userEvent.click(optionsBtn[1]));
        const queueBtn = await screen.findByRole("menuitem", { name: /add to queue/i });
        userEvent.click(queueBtn);
        expect(queue.remainingQueue[0]).toStrictEqual(secondTrack);
    },
    mainBtn: (list: typeof albumMock | typeof playlistMock) => {
        const btn = screen.getByRole("button", { name: /play full (album|playlist)/i });

        const restOfTracks = [...list.tracks];
        const firstTrack = restOfTracks.shift();

        userEvent.click(btn);
        expect(queue.currentTrack).toStrictEqual(firstTrack);
        expect(queue.remainingQueue).toStrictEqual(restOfTracks);

        act(() => queue.toggleShuffle());
        expect(queue.currentTrack).toStrictEqual(firstTrack);

        userEvent.click(btn);
        expect(list.tracks).toStrictEqual(expect.arrayContaining(queue.remainingQueue));
    }
};

describe("album", () => {
    beforeEach(() => {
        render(<MusicList list={albumMock} />, { wrapper: QueueWrapper });
        act(() => queue.reset());
    });

    it("plays track and queues others on title click", async () => (
        tests.title(albumMock)
    ));

    it("shows track button on song hover", async () => (
        tests.button(albumMock)
    ));

    it("plays track & adds to queue in more options menu", async () => (
        tests.menu(albumMock)
    ));

    it("plays full album on main button click", async () => (
        tests.mainBtn(albumMock)
    ));
});

describe("playlist", () => {
    beforeEach(() => {
        render(<MusicList list={playlistMock} />, { wrapper: QueueWrapper });
        act(() => queue.reset());
    });

    it("plays track and queues others on title click", async () => (
        tests.title(playlistMock)
    ));

    it("shows track button on song hover", async () => (
        tests.button(playlistMock)
    ));

    it("plays track & adds to queue in more options menu", async () => (
        tests.menu(playlistMock)
    ));

    it("plays full playlist on main button click", async () => (
        tests.mainBtn(playlistMock)
    ));
});

describe("empty", () => {
    it("loads error page on empty music list", async () => {
        render(<MusicList list={null} />);

        const firstTrack = albumMock.tracks?.[0];
        expect(screen.queryByText(firstTrack.title)).not.toBeInTheDocument();

        const errorTitle = screen.getByText(/couldn't load/i);
        expect(errorTitle).toHaveTextContent(/list information/i);
    });
});

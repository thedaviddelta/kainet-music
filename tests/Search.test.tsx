import { render, screen, waitFor, act } from "./reactUtils";
import userEvent from "@testing-library/user-event";
import { routerMock } from "@mocks/next";
import { searchedSongsMock, searchedVideosMock, searchedAlbumsMock, searchedPlaylistsMock } from "@mocks/data";
import queueSetup from "@mocks/queue";
import Search from "@pages/search/[type]/[query]";

const { QueueWrapper, queue } = queueSetup();

const tests = {
    track: {
        title: (list: typeof searchedSongsMock | typeof searchedVideosMock) => {
            const firstSong = list[0];

            const title = screen.getByText(firstSong.title);
            userEvent.click(title);

            expect(queue.currentTrack).toStrictEqual(firstSong);
        },
        button: (list: typeof searchedSongsMock | typeof searchedVideosMock) => {
            const firstSong = list[0];

            const title = screen.getByText(firstSong.title);
            userEvent.hover(title);

            const btn = screen.getByRole("button", { name: /play (song|video)/i });
            userEvent.click(btn);

            expect(queue.currentTrack).toStrictEqual(firstSong);
        },
        menu: async (list: typeof searchedSongsMock | typeof searchedVideosMock) => {
            const optionsBtn = screen.getAllByRole("button", { name: /more options/i });

            await waitFor(() => userEvent.click(optionsBtn[0]));
            const playBtn = await screen.findByRole("menuitem", { name: /play (song|video)/i });
            userEvent.click(playBtn);
            expect(queue.currentTrack).toStrictEqual(list[0]);

            await waitFor(() => userEvent.click(optionsBtn[1]));
            const queueBtn = await screen.findByRole("menuitem", { name: /add to queue/i });
            userEvent.click(queueBtn);
            expect(queue.remainingQueue[0]).toStrictEqual(list[1]);
        }
    },
    list: {
        title: async (list: typeof searchedAlbumsMock | typeof searchedPlaylistsMock) => {
            const firstAlbum = list[0];

            const title = screen.getByText(firstAlbum.title);
            userEvent.click(title);

            expect(routerMock.push).toHaveBeenCalledTimes(1);

            const tooltip = await screen.findByRole("tooltip", { name: firstAlbum.title });
            await waitFor(() => expect(tooltip).not.toBeVisible());
        },
        button: (list: typeof searchedAlbumsMock | typeof searchedPlaylistsMock) => {
            const firstAlbum = list[0];

            const title = screen.getByText(firstAlbum.title);
            userEvent.hover(title);

            const link = screen.getByRole("link", { name: /open (album|playlist)/i });
            userEvent.click(link);

            expect(routerMock.push).toHaveBeenCalledTimes(1);
        },
        menu: async (list: typeof searchedAlbumsMock | typeof searchedPlaylistsMock) => {
            const optionsBtn = screen.getAllByRole("button", { name: /more options/i });

            await waitFor(() => userEvent.click(optionsBtn[0]));
            const openBtn = await screen.findByRole("menuitem", { name: /open (album|playlist)/i });
            userEvent.click(openBtn);

            expect(routerMock.push).toHaveBeenCalledTimes(1);
        }
    }
};

describe("songs", () => {
    beforeEach(() => {
        render(<Search results={searchedSongsMock} />, { wrapper: QueueWrapper });
        act(() => queue.reset());
    });

    it("plays song on title click", async () => (
        tests.track.title(searchedSongsMock)
    ));

    it("shows play button on song hover", async () => (
        tests.track.button(searchedSongsMock)
    ));

    it("plays song & adds to queue in more options menu", async () => (
        tests.track.menu(searchedSongsMock)
    ));
});

describe("videos", () => {
    beforeEach(() => {
        render(<Search results={searchedVideosMock} />, { wrapper: QueueWrapper });
        act(() => queue.reset());
    });

    it("plays video on title click", async () => (
        tests.track.title(searchedVideosMock)
    ));

    it("shows play button on video hover", async () => (
        tests.track.button(searchedVideosMock)
    ));

    it("plays video & adds to queue in more options menu", async () => (
        tests.track.menu(searchedVideosMock)
    ));
});

describe("albums", () => {
    beforeEach(() => {
        render(<Search results={searchedAlbumsMock} />);
        routerMock.push.mockReset();
    });

    it("opens album on title click", async () => (
        tests.list.title(searchedAlbumsMock)
    ));

    it("shows open link on album hover", async () => (
        tests.list.button(searchedAlbumsMock)
    ));

    it("opens album in more options menu", async () => (
        tests.list.menu(searchedAlbumsMock)
    ));
});

describe("playlists", () => {
    beforeEach(() => {
        render(<Search results={searchedPlaylistsMock} />);
        routerMock.push.mockReset();
    });

    it("opens playlist on title click", async () => (
        tests.list.title(searchedPlaylistsMock)
    ));

    it("shows open link on playlist hover", async () => (
        tests.list.button(searchedPlaylistsMock)
    ));

    it("opens playlist in more options menu", async () => (
        tests.list.menu(searchedPlaylistsMock)
    ));
});

describe("empty", () => {
    it("loads error page on empty search results", async () => {
        render(<Search results={[]} />);

        const firstSong = searchedSongsMock[0];
        expect(screen.queryByText(firstSong.title)).not.toBeInTheDocument();

        const errorTitle = screen.getByText(/couldn't load/i);
        expect(errorTitle).toHaveTextContent(/search results/i);
    });
});

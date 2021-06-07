import { render, screen } from "./reactUtils";
import userEvent from "@testing-library/user-event";
import { routerMock } from "@mocks/next";
import * as audioMock from "@mocks/audio";
import { suggestionsMock } from "@mocks/data";
import Home from "@pages/index";

beforeEach(() => {
    audioMock.resetAllMocks();
    routerMock.push.mockReset();
});

it("works", async () => {
    render(<Home suggestions={suggestionsMock} />);

    const imgs = screen.getAllByRole("img");
    userEvent.hover(imgs[2]);

    const link = screen.getByRole("link", { name: /open playlist/i });
    userEvent.click(link);
    expect(routerMock.push).toHaveBeenCalledTimes(1);
});

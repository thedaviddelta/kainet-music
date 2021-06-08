import { render, screen } from "./reactUtils";
import userEvent from "@testing-library/user-event";
import { routerMock } from "@mocks/next";
import { suggestionsMock } from "@mocks/data";
import Home from "@pages/index";

beforeEach(() => {
    routerMock.push.mockReset();
});

it("shows link on image hover and changes the page on click", async () => {
    render(<Home suggestions={suggestionsMock} />);

    const imgs = screen.getAllByRole("img");
    userEvent.hover(imgs[2]);

    const link = screen.getByRole("link", { name: /open playlist/i });
    userEvent.click(link);
    expect(routerMock.push).toHaveBeenCalledTimes(1);
});

it("changes hover correctly", async () => {
    render(<Home suggestions={suggestionsMock} />);

    const imgs = screen.getAllByRole("img");

    userEvent.hover(imgs[2]);
    const firstLink = screen.getByRole("link", { name: /open playlist/i });
    expect(firstLink).toHaveAttribute("href", expect.stringContaining(suggestionsMock[2].browseId));

    userEvent.hover(imgs[3]);
    const secondLink = screen.getByRole("link", { name: /open playlist/i });
    expect(secondLink).toHaveAttribute("href", expect.stringContaining(suggestionsMock[3].browseId));

    expect(firstLink).not.toBeInTheDocument();
    expect(secondLink).toBeInTheDocument();
});

it("loads error page on empty suggestions", async () => {
    render(<Home suggestions={[]} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    const errorTitle = screen.getByText(/couldn't load/i);
    expect(errorTitle).toHaveTextContent(/suggestions/i);
});

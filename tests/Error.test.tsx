import { render, screen } from "./reactUtils";
import userEvent from "@testing-library/user-event";
import { routerMock } from "@mocks/next";
import { CustomError } from "@components";

beforeEach(() => {
    routerMock.reload.mockReset();
});

it("renders status info on http error case", async () => {
    const statusCode = 403;
    const statusText = "Forbidden";
    render(<CustomError statusCode={statusCode} statusText={statusText} />);

    expect(screen.getByText(statusCode)).toBeInTheDocument();
    expect(screen.getByText(statusText)).toBeInTheDocument();
});

it("renders 'couldn't load' on error subject case & reloads on button click", async () => {
    const errorSubject = "podcasts";
    render(<CustomError errorSubject={errorSubject} />);

    const errorTitle = screen.getByText(/couldn't load/i);
    expect(errorTitle).toHaveTextContent(errorSubject);

    const btn = screen.getByRole("button", { name: /reload/i });
    userEvent.click(btn);
    expect(routerMock.reload).toHaveBeenCalledTimes(1);
});

it("renders 'unexpected error' on fallback case", async () => {
    const fallbackError = {
        name: "Testing",
        message: "Error while testing"
    };
    render(<CustomError fallbackError={fallbackError} />);

    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    expect(screen.getByText(fallbackError.message)).toBeInTheDocument();
});

import { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@theme";
import { QueueProvider } from "@contexts/queue";
import { RouterProviderMock } from "@mocks/next";

// Jest JSDOM bug
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

const Providers: FC = ({ children }) => (
    <RouterProviderMock>
        <ChakraProvider theme={theme}>
            <QueueProvider>
                {children}
            </QueueProvider>
        </ChakraProvider>
    </RouterProviderMock>
);

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "queries">
) => render(ui, {
    ...options,
    wrapper: !options?.wrapper
        ? Providers
        : ({ children }) => (
            <Providers>
                <options.wrapper>
                    {children}
                </options.wrapper>
            </Providers>
        )
});

export * from "@testing-library/react";
export { customRender as render };

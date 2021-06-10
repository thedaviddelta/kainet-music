import { FC } from "react";
import { AppProps } from "next/app";
import { ChakraProvider, VStack } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import theme from "@theme";
import { QueueProvider } from "@contexts/queue";
import { CustomError, Layout } from "@components";

const App: FC<AppProps> = ({ Component, pageProps }) => (
    <ChakraProvider theme={theme}>
        <ErrorBoundary fallbackRender={({ error }) => (
            <VStack minH="100vh">
                <CustomError fallbackError={error} />
            </VStack>
        )}>
            <QueueProvider>
                <Layout>
                    <ErrorBoundary fallbackRender={({ error }) => (
                        <CustomError fallbackError={error} />
                    )}>
                        <Component {...pageProps} />
                    </ErrorBoundary>
                </Layout>
            </QueueProvider>
        </ErrorBoundary>
    </ChakraProvider>
);

export default App;

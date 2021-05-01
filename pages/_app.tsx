import { AppProps } from "next/app";
import { FC } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@theme";
import { QueueProvider } from "@contexts/queue";

const App: FC<AppProps> = ({ Component, pageProps }) => (
    <ChakraProvider theme={theme}>
        <QueueProvider>
            <Component {...pageProps} />
        </QueueProvider>
    </ChakraProvider>
);

export default App;

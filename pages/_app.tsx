import { AppProps } from "next/app";
import { FC } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@theme";
import { QueueProvider } from "@contexts/queue";
import { Layout } from "@components";

const App: FC<AppProps> = ({ Component, pageProps }) => (
    <ChakraProvider theme={theme}>
        <QueueProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </QueueProvider>
    </ChakraProvider>
);

export default App;

import { FC } from "react";
import { VStack } from "@chakra-ui/react";
import { Header, Player } from ".";

const Layout: FC = ({ children, ...props }) => (
    <VStack minH="100vh" {...props}>
        <Header />
        {children}
        <Player />
    </VStack>
);

export default Layout;

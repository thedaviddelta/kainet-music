import { FC } from "react";
import { HStack } from "@chakra-ui/react";
import { SearchBar } from ".";

const Header: FC = (props) => (
    <HStack {...props}>
        <SearchBar />
    </HStack>
);

export default Header;

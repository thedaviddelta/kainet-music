import { FC } from "react";
import { HStack } from "@chakra-ui/react";
import { SearchBar } from ".";

type Props = {
    [key: string]: any
};

const Header: FC<Props> = (props) => (
    <HStack {...props}>
        <SearchBar />
    </HStack>
);

export default Header;

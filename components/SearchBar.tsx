import { useState, FC, FormEventHandler } from "react";
import { useRouter } from "next/router";
import { HStack, Input, Button, Select } from "@chakra-ui/react";
import { SearchType, SearchTypes } from "kainet-scraper";

type Props = {
    [key: string]: any
};

const SearchBar: FC<Props> = (props) => {
    const [query, setQuery] = useState("");
    const [type, setType] = useState<SearchTypes>(SearchType.SONGS);

    const router = useRouter();

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        router.push(`/search/${encodeURIComponent(type)}/${encodeURIComponent(query)}`);
    };

    return (
        <HStack {...props}>
            <form onSubmit={onSubmit}>
                <HStack>
                    <Input id="query" value={query} onChange={e => setQuery(e.target.value)} />
                    <Select value={type} onChange={e => setType(e.target.value as SearchTypes)}>
                        {Object.values(SearchType).map(val => val !== "artists" && (
                            <option value={val} key={val}>
                                {val}
                            </option>
                        ))};
                    </Select>
                    <Button type="submit">Search</Button>
                </HStack>
            </form>
        </HStack>
    );
};

export default SearchBar;

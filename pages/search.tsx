import { useState, FC, FormEventHandler } from "react";
import { HStack, Text, Input, Select, Button } from "@chakra-ui/react";
import { SearchType, YtMusicSong, YtMusicVideo, YtMusicAlbum, YtMusicPlaylist } from "kainet-scraper";
import { Layout } from "../components";
import { useQueue } from "../contexts/queue";

type SearchTypes = typeof SearchType[keyof typeof SearchType];

const Search: FC = () => {
    const [query, setQuery] = useState("");
    const [type, setType] = useState<SearchTypes>(SearchType.SONGS);
    const [results, setResults] = useState<(YtMusicSong | YtMusicVideo | YtMusicAlbum | YtMusicPlaylist)[] | null>(null);

    const { setQueue } = useQueue();

    const onSearch: FormEventHandler = (e) => {
        e.preventDefault();
        fetch(`/api/search?q=${query}&t=${type}`)
            .then(res => res.json())
            .then(json => setResults(json.results))
            .catch(() => setResults(null));
    };

    return (
        <Layout>
            <form onSubmit={onSearch}>
                <HStack>
                    <Input id="query" value={query} onChange={e => setQuery(e.target.value)} />
                    <Select value={type} onChange={e => setType(e.target.value as SearchTypes)}>
                        {Object.values(SearchType).map(val => (
                            <option value={val} key={val}>
                                {val}
                            </option>
                        ))};
                    </Select>
                    <Button type="submit">Search</Button>
                </HStack>
            </form>
            <div>
                {results?.map(result => (
                    <HStack key={result.id}>
                        <Text>{result.title}</Text>
                        <Button onClick={() => setQueue([result])}>Play</Button>
                    </HStack>
                ))}
            </div>
        </Layout>
    );
}

export default Search;

import { useState, FC, FormEventHandler } from "react";
import { useRouter } from "next/router";
import { HStack, Input, IconButton, Select, useToast, useColorModeValue } from "@chakra-ui/react";
import { SearchIcon, } from "@chakra-ui/icons";
import { MdAudiotrack, MdMusicVideo, MdAlbum, MdLibraryMusic } from "react-icons/md";
import { SearchType, SearchTypes } from "kainet-scraper";

const icons = {
    songs: MdAudiotrack,
    videos: MdMusicVideo,
    albums: MdAlbum,
    playlists: MdLibraryMusic
} as const;

type Props = {
    [key: string]: any
};

const SearchBar: FC<Props> = (props) => {
    const [query, setQuery] = useState("");
    const [type, setType] = useState<SearchTypes>(SearchType.SONGS);

    const router = useRouter();
    const toast = useToast();

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!type || !query)
            return toast({
                title: "Missing query",
                description: "Please specify a search query",
                status: "warning",
                duration: 3500
            });
        router.push(`/search/${encodeURIComponent(type)}/${encodeURIComponent(query)}`);
    };

    return (
        <form onSubmit={onSubmit} {...props}>
            <HStack
                border="1px solid"
                borderColor={useColorModeValue("kaihui.600", "kaihui.200")}
                borderRadius="md"
                p={0.5}
                spacing={1.5}
            >
                <IconButton
                    type="submit"
                    aria-label="Search"
                    icon={<SearchIcon />}
                    variant="ghost"
                    colorScheme="kaihui"
                />
                <Input
                    aria-label="Query"
                    placeholder="Search..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    variant="ghost"
                    colorScheme="kaihui"
                />
                <Select
                    aria-label="Type"
                    value={type}
                    onChange={e => setType(e.target.value as SearchTypes)}
                    icon={icons[type]({})}
                    variant="ghost"
                    colorScheme="kaihui"
                >
                    {Object.values(SearchType).map(type => (
                        type !== "artists" && (
                            <option value={type} key={type}>
                                {type[0].toLocaleUpperCase() + type.slice(1)}
                            </option>
                        )
                    ))}
                </Select>
            </HStack>
        </form>
    );
};

export default SearchBar;

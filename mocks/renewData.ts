import { writeFile } from "fs/promises";
import { retrieveSuggestions, search, getAlbum, getPlaylist, SearchType } from "kainet-scraper";

const errors = {
    list: (list: []) => {
        if (list.length <= 0)
            throw new Error();
        return list;
    },
    obj: (obj: object | null) => {
        if (!obj)
            throw new Error();
        return obj;
    }
};

const renew = {
    suggestions: () => retrieveSuggestions().then(errors.list),
    searchedSongs: () => search(SearchType.SONGS, "queen").then(errors.list),
    searchedVideos: () => search(SearchType.VIDEOS, "queen").then(errors.list),
    searchedAlbums: () => search(SearchType.ALBUMS, "queen").then(errors.list),
    searchedPlaylists: () => search(SearchType.PLAYLISTS, "queen").then(errors.list),
    album: () => getAlbum("MPREb_2mrJ3bwriqS").then(errors.obj),
    playlist: () => getPlaylist("VLRDCLAK5uy_lePvUIRtka0fZSLEEjKByNMYbxfyr7rGM").then(errors.obj)
};

type DataType = keyof typeof renew;

const save = (json: object, type: DataType) => {
    writeFile(
        `./mocks/data/${type}.json`,
        JSON.stringify(json, null, 2),
        "utf-8"
    ).then(() =>
        console.log(`Successfully renewed '${type}'`)
    ).catch(() =>
        console.log(`Error renewing '${type}'`)
    )
};

const isKeyOf = <T extends object>(obj: T, key: keyof any): key is keyof T => key in obj;

const arg = process.argv[2];

if (arg && isKeyOf(renew, arg))
    renew[arg]().then(json =>
        save(json, arg)
    );
else
    Object.entries(renew).forEach(([key, fn]) =>
        isKeyOf(renew, key) && fn().then(json => save(json, key))
    );

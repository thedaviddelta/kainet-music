import { NextApiHandler } from "next";
import { search, YtMusicSong, YtMusicVideo, YtMusicAlbum, YtMusicPlaylist } from "kainet-scraper";

type Data = {
    results?: (YtMusicSong | YtMusicVideo | YtMusicAlbum | YtMusicPlaylist)[],
    error?: string
};

const handler: NextApiHandler<Data> = async (req, res) => {
    const {
        query: { q, t },
    } = req;

    if (!q || Array.isArray(q))
        return res.status(400).json({ error: "Missing query" });
    if (!t || Array.isArray(t))
        return res.status(400).json({ error: "Missing type" });
    if (t !== "songs" && t !== "videos" && t !== "albums" && t !== "playlists")
        return res.status(400).json({ error: "Wrong type" });

    const results = await search(t, q);

    if (!results)
        return res.status(500).json({ error: `Error retrieving the ${t}` });
    res.status(200).json({ results });
};

export default handler;

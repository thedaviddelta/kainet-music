import { NextApiHandler } from "next";
import ytdl, { videoFormat } from "ytdl-core";

const handler: NextApiHandler = async (req, res) => {
    const {
        query: { id },
    } = req;

    if (!id || Array.isArray(id))
        return res.status(400).json({ error: "Missing ID" });

    const stream = ytdl(id, {
        quality: "highestaudio"
    });

    res.setHeader("Accept-Ranges", "bytes");
    stream.on("info", (_, format: videoFormat) => {
        format.mimeType && res.setHeader("Content-Type", format.mimeType);
        format.contentLength && res.setHeader("Content-Length", format.contentLength);
        format.contentLength && res.setHeader("Content-Range", `0-${format.contentLength}/${format.contentLength}`);
    });
    stream.on("progress", (chunkLength, downloaded, total) => {
        res.hasHeader("Content-Length") || res.setHeader("Content-Length", total);
        res.hasHeader("Content-Range") || res.setHeader("Content-Range", `0-${total}/${total}`);
    });
    stream.on("error", stream.destroy);

    stream.pipe(res);
};

export default handler;

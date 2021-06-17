import { NextApiHandler } from "next";
import ytdl, { videoFormat } from "ytdl-core";

const handler: NextApiHandler = async (req, res) => {
    const {
        query: { id },
    } = req;

    if (!id || Array.isArray(id))
        return res.status(400).json({ error: "Missing ID" });

    res.setHeader("Accept-Ranges", "bytes");
    ytdl(id, {
        quality: "highestaudio",
        highWaterMark: 1024 * 1024 * 1014,
        dlChunkSize: 1024 * 1024 * 1014
    }).on(
        "info",
        (_, format: videoFormat) => {
            format.mimeType && res.setHeader("Content-Type", format.mimeType);
            format.contentLength && res.setHeader("Content-Length", format.contentLength);
            format.contentLength && res.setHeader("Content-Range", `0-${format.contentLength}/${format.contentLength}`);
        }
    ).on(
        "progress",
        (chunkLength, downloaded, total) => {
            res.hasHeader("Content-Length") || res.setHeader("Content-Length", total);
            res.hasHeader("Content-Range") || res.setHeader("Content-Range", `0-${total}/${total}`);
        }
    ).pipe(res);
};

export default handler;

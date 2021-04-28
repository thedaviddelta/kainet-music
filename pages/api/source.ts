import { NextApiHandler } from "next";
import { getInfo, chooseFormat } from "ytdl-core";

type Data = {
    url?: string,
    duration?: number,
    error?: string
};

const handler: NextApiHandler<Data> = async (req, res) => {
    const {
        query: { id },
    } = req;

    if (!id || Array.isArray(id))
        return res.status(400).json({ error: "Missing ID" });

    const { formats } = await getInfo(id);
    const { url, approxDurationMs } = chooseFormat(formats, { quality: "highestaudio" });
    const duration = +approxDurationMs / 1000;

    res.status(200).json({ url, duration });
};

export default handler;

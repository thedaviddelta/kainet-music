import { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useColorModeValue } from "@chakra-ui/react";
import theme from "@theme";

type Props = {
    customTitle?: string,
    robots?: boolean
};

const title = "Kainet Music";
const description = "Free and Open Source music streaming service with millions of tracks available, serving as an alternative front-end for YouTube Music";

const siteDomain = process.env["NEXT_PUBLIC_SITE_DOMAIN"];
const url = siteDomain && (siteDomain.includes("localhost") ? "http://" : "https://") + siteDomain;

const CustomHead: FC<Props> = ({ customTitle, robots = true }) => {
    const fullTitle = customTitle
        ? `${customTitle} | ${title}`
        : title;

    const router = useRouter();
    const fullUrl = url + router.asPath;

    const themeColor = useColorModeValue(theme.colors.kaihui["300"], theme.colors.kaihui["900"]);

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={robots ? "index,follow" : "noindex,nofollow"} />
            <link rel="canonical" href={fullUrl} />

            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content={themeColor} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:locale" content="en" />

            <meta property="og:image" content={`${url}/favicon-512x512.png`} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="512" />
            <meta property="og:image:height" content="512" />
            <meta property="og:image:alt" content={title} />

            <meta property="twitter:card" content="summary" />
            <meta property="twitter:creator" content="@thedaviddelta" />
        </Head>
    );
};

export default CustomHead;

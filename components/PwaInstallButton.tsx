import { useState, useEffect, FC } from "react";
import { IconButton } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
}

type Props = {
    [key: string]: any
};

const PwaInstallButton: FC<Props> = (props) => {
    const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const listener = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setPromptInstall(e);
        };
        window.addEventListener("beforeinstallprompt", listener);
        return () => {
            window.removeEventListener("beforeinstallprompt", listener);
        };
    }, []);

    useEffect(() => {
        const listener = () => {
            setPromptInstall(null);
        };
        window.addEventListener("appinstalled", listener);
        return () => {
            window.removeEventListener("appinstalled", listener);
        };
    }, []);

    return promptInstall && (
        <IconButton
            aria-label="Install PWA"
            icon={<DownloadIcon />}
            onClick={() => promptInstall.prompt()}
            {...props}
        />
    );
};

export default PwaInstallButton;

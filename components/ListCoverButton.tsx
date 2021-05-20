import { FC } from "react";
import { Box, Image, IconButton, useBreakpointValue, LayoutProps, IconButtonProps } from "@chakra-ui/react";
import { LocalLink } from ".";

type Props =  ({
    onClick: IconButtonProps["onClick"],
} | {
    href: string,
}) & {
    imgSrc: string,
    imgAlt: string,
    imgSize: LayoutProps["w"],
    btnLabel: string,
    btnIcon: IconButtonProps["icon"],
    btnSize: (IconButtonProps["size"] | null)[],
    btnBoxSize: IconButtonProps["boxSize"],
    btnBr: IconButtonProps["borderRadius"],
    btnOffset: IconButtonProps["bottom"],
    isBtnShown: boolean,
    [key: string]: any
};

const ListCoverButton: FC<Props> = ({
    onClick,
    href,
    imgSrc,
    imgAlt,
    imgSize,
    btnLabel,
    btnIcon,
    btnSize,
    btnBoxSize,
    btnBr,
    btnOffset,
    isBtnShown,
    ...props
}) => {
    const btnSizeFinal = useBreakpointValue(btnSize);
    return (
        <Box position="relative" {...props}>
            <Image
                src={imgSrc}
                fallbackSrc="/fallback.svg"
                alt={imgAlt}
                h={imgSize}
                w={imgSize}
                minW={imgSize}
                maxW={imgSize}
                borderRadius="md"
                boxShadow="lg"
            />
            {isBtnShown && (
                <IconButton
                    aria-label={btnLabel}
                    icon={btnIcon}
                    as={href ? LocalLink : null}
                    onClick={onClick}
                    href={href}
                    prefetch={href ? false : null}
                    variant="cover"
                    colorScheme="kaihong"
                    size={btnSizeFinal}
                    boxSize={btnBoxSize}
                    borderRadius={btnBr}
                    position="absolute"
                    bottom={btnOffset}
                    right={btnOffset}
                />
            )}
        </Box>
    );
};

export default ListCoverButton;

import { FC } from "react";
import {Box, Image, IconButton, LayoutProps, IconButtonProps, Text} from "@chakra-ui/react";
import { LocalLink } from ".";

type Props = ({
    onClick: IconButtonProps["onClick"],
} | {
    href: string,
}) & {
    width?: LayoutProps["w"],
    height: LayoutProps["h"],
    imgSrc: string,
    imgAlt: string,
    brLeft?: IconButtonProps["borderLeftRadius"],
    btnLabel: string,
    btnIcon: IconButtonProps["icon"],
    btnSize: IconButtonProps["size"],
    isBtnShown: boolean,
    isDisabled?: boolean,
    [key: string]: any
};

const ThumbnailButton: FC<Props> = ({
    onClick,
    href,
    width,
    height,
    imgSrc,
    imgAlt,
    brLeft,
    btnLabel,
    btnIcon,
    btnSize,
    isBtnShown,
    isDisabled,
    ...props
}) => (
    <Box
        position="relative"
        minW={width ?? height}
        maxW={width ?? height}
        h={height}
        {...props}
    >
        <Image
            src={imgSrc}
            fallbackSrc="/fallback.svg"
            alt={imgAlt}
            top={0}
            left={0}
            w="full"
            h="full"
            borderLeftRadius={brLeft}
        />
        {isBtnShown && (
            <IconButton
                aria-label={btnLabel}
                icon={btnIcon}
                as={href ? LocalLink : null}
                onClick={onClick}
                href={href}
                prefetch={href ? false : null}
                variant="thumbnail"
                colorScheme="kaihui"
                size={btnSize}
                disabled={isDisabled}
                borderRadius={0}
                borderLeftRadius={brLeft}
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                minW={0}
                minH={0}
            />
        )}
    </Box>
);

export default ThumbnailButton;

import { FC } from "react";
import { Box, Image, IconButton, LayoutProps, IconButtonProps } from "@chakra-ui/react";

type Props = {
    width?: LayoutProps["w"],
    height: LayoutProps["h"],
    imgSrc: string,
    imgAlt: string,
    brLeft?: IconButtonProps["borderLeftRadius"],
    btnLabel: string,
    btnIcon: IconButtonProps["icon"],
    btnSize: IconButtonProps["size"],
    onClick: IconButtonProps["onClick"],
    isBtnShown: boolean,
    isDisabled?: boolean,
    [key: string]: any
};

const ThumbnailButton: FC<Props> = ({
    width,
    height,
    imgSrc,
    imgAlt,
    brLeft,
    btnLabel,
    btnIcon,
    btnSize,
    onClick,
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
                onClick={onClick}
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

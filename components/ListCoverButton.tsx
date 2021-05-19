import { FC } from "react";
import { Box, Image, IconButton, useBreakpointValue, LayoutProps, IconButtonProps } from "@chakra-ui/react";

type Props = {
    onClick: IconButtonProps["onClick"],
    imgSrc: string,
    imgAlt: string,
    imgSize: LayoutProps["w"],
    btnLabel: string,
    btnIcon: IconButtonProps["icon"],
    btnSize: (IconButtonProps["size"] | null)[],
    btnBoxSize: IconButtonProps["boxSize"],
    btnBr: IconButtonProps["borderRadius"],
    btnOffset: IconButtonProps["bottom"],
    [key: string]: any
};

const ListCoverButton: FC<Props> = ({
    onClick,
    imgSrc,
    imgAlt,
    imgSize,
    btnLabel,
    btnIcon,
    btnSize,
    btnBoxSize,
    btnBr,
    btnOffset,
    ...props
}) => (
    <Box position="relative" {...props}>
        <Image
            src={imgSrc}
            fallbackSrc="/fallback.svg"
            alt={imgAlt}
            h={imgSize}
            minW={imgSize}
            maxW={imgSize}
            borderRadius="md"
            boxShadow="lg"
        />
        <IconButton
            aria-label={btnLabel}
            icon={btnIcon}
            onClick={onClick}
            variant="customSolid"
            colorScheme="kaihong"
            size={useBreakpointValue(btnSize)}
            boxSize={btnBoxSize}
            borderRadius={btnBr}
            position="absolute"
            bottom={btnOffset}
            right={btnOffset}
        />
    </Box>
);

export default ListCoverButton;

import { FC } from "react";
import { VStack, Text, TypographyProps } from "@chakra-ui/react";

type Props = {
    title: string,
    artist: string,
    titleFontSize: TypographyProps["fontSize"],
    artistFontSize: TypographyProps["fontSize"],
    titleLines: TypographyProps["noOfLines"],
    artistLines: TypographyProps["noOfLines"],
    [key: string]: any
};

const SongInfo: FC<Props> = ({
    title,
    artist,
    titleFontSize,
    artistFontSize,
    titleLines,
    artistLines,
    ...props
}) => (
    <VStack alignItems="start" spacing={1} {...props}>
        <Text fontSize={titleFontSize} noOfLines={titleLines} fontWeight="bold">
            {title}
        </Text>
        <Text fontSize={artistFontSize} noOfLines={artistLines}>
            {artist}
        </Text>
    </VStack>
);

export default SongInfo;

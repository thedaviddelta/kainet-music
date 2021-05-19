import { FC, DOMAttributes } from "react";
import {
    HStack,
    VStack,
    StackDivider,
    Text,
    Tooltip,
    useBreakpointValue,
    TypographyProps,
    StackProps
} from "@chakra-ui/react";
import { LocalLink } from ".";

type Props = ({
    titleOnClick?: DOMAttributes<any>["onClick"] | null,
} | {
    titleHref?: string,
}) & {
    title: string,
    titleFontSize: TypographyProps["fontSize"],
    titleLines: TypographyProps["noOfLines"],
    titleOnClick?: DOMAttributes<any>["onClick"] | null,
    subtitlesList: string[][],
    subtitlesFontSizes: TypographyProps["fontSize"][],
    subtitlesLines: TypographyProps["noOfLines"][],
    subtitlesSeparators?: StackProps["divider"][],
    showTooltip?: boolean,
    [key: string]: any
};

const ItemMetadata: FC<Props> = ({
    title,
    titleFontSize,
    titleLines,
    titleOnClick,
    titleHref,
    subtitlesList,
    subtitlesFontSizes,
    subtitlesLines,
    subtitlesSeparators,
    showTooltip,
    ...props
}) => {
    const tooltipOpenDelay = useBreakpointValue([10, null, 300]);
    return (
        <VStack alignItems="flex-start" spacing={1} {...props}>
            <Tooltip label={title} placement="top" openDelay={tooltipOpenDelay} isDisabled={!showTooltip}>
                <Text
                    fontSize={titleFontSize}
                    noOfLines={titleLines}
                    fontWeight="bold"
                    as={titleHref ? LocalLink : null}
                    onClick={titleOnClick}
                    href={titleHref}
                    boxShadow="none !important"
                    textDecoration="none !important"
                    _hover={{ cursor: titleOnClick || titleHref ? "pointer" : titleOnClick === null ? "not-allowed" : "initial" }}
                    userSelect="none"
                >
                    {title}
                </Text>
            </Tooltip>

            <VStack alignItems="flex-start" spacing={0.5}>
                {subtitlesList?.map((subtitles, index) => (
                    <HStack key={index} spacing={1.5} divider={subtitlesSeparators?.[index] && (
                        <StackDivider border={0} boxSize={2}>
                            {subtitlesSeparators?.[index]}
                        </StackDivider>
                    )}>
                        {subtitles?.map(text => text && (
                            <Tooltip key={text} label={text} placement="top" openDelay={tooltipOpenDelay} isDisabled={!showTooltip}>
                                <Text
                                    fontSize={subtitlesFontSizes[index]}
                                    noOfLines={subtitlesLines[index]}
                                    textAlign="center"
                                    userSelect="none"
                                >
                                    {text}
                                </Text>
                            </Tooltip>
                        ))}
                    </HStack>
                ))}
            </VStack>
        </VStack>
    );
};

export default ItemMetadata;

import { FC, DOMAttributes } from "react";
import { HStack, VStack, Text, Tooltip, useBreakpointValue, TypographyProps, StackProps } from "@chakra-ui/react";

type Props = {
    title: string,
    titleFontSize: TypographyProps["fontSize"],
    titleLines: TypographyProps["noOfLines"],
    titleOnClick?: DOMAttributes<any>["onClick"] | null,
    subtitleList: string[],
    subtitleFontSize: TypographyProps["fontSize"],
    subtitleLines: TypographyProps["noOfLines"],
    subtitleSeparator?: StackProps["divider"],
    lineSpacing?: StackProps["spacing"],
    [key: string]: any
};

const ItemMetadata: FC<Props> = ({
    title,
    titleFontSize,
    titleLines,
    titleOnClick,
    subtitleList,
    subtitleFontSize,
    subtitleLines,
    subtitleSeparator,
    ...props
}) => {
    const tooltipOpenDelay = useBreakpointValue([10, null, 300]);
    return (
        <VStack alignItems="start" spacing={1} {...props}>
            <Tooltip label={title} placement="top" openDelay={tooltipOpenDelay}>
                <Text
                    fontSize={titleFontSize}
                    noOfLines={titleLines}
                    fontWeight="bold"
                    onClick={titleOnClick}
                    _hover={{ cursor: titleOnClick ? "pointer" : titleOnClick === null ? "not-allowed" : "initial" }}
                    userSelect="none"
                >
                    {title}
                </Text>
            </Tooltip>

            <HStack
                spacing={1.5}
                divider={subtitleSeparator}
            >
                {subtitleList?.map(text => (
                    <Tooltip label={text} placement="top" openDelay={tooltipOpenDelay}>
                        <Text fontSize={subtitleFontSize} noOfLines={subtitleLines} userSelect="none">
                            {text}
                        </Text>
                    </Tooltip>
                ))}
            </HStack>
        </VStack>
    );
};

export default ItemMetadata;

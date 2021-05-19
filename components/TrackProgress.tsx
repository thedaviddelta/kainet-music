import { FC } from "react";
import { HStack, Text, Slider, SliderTrack, SliderFilledTrack, LayoutProps } from "@chakra-ui/react";
import { parseDuration } from "kainet-scraper";

type Props = {
    currentTime: number,
    duration: number,
    setCurrentTime: (time: number, manual?: boolean) => void,
    width: LayoutProps["w"],
    [key: string]: any
};

const TrackProgress: FC<Props> = ({
    currentTime,
    duration,
    setCurrentTime,
    width,
    ...props
}) => (
    <HStack {...props}>
        <Text fontSize="xs">{parseDuration.toText(currentTime) ?? "00:00"}</Text>
        <Slider
            aria-label="Track progress"
            colorScheme="kaihui"
            w={width}
            min={0}
            max={duration}
            value={currentTime}
            onChange={value => setCurrentTime(value, true)}
            focusThumbOnChange={false}
        >
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
        </Slider>
        <Text fontSize="xs">{parseDuration.toText(duration) ?? "00:00"}</Text>
    </HStack>
);

export default TrackProgress;

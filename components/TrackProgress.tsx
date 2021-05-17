import { FC } from "react";
import { HStack, Text, Slider, SliderTrack, SliderFilledTrack, LayoutProps } from "@chakra-ui/react";

const timeToText = (secs: number = 0) => {
    const hours = Math.floor(secs / 3600);
    const hoursRest = Math.floor(secs % 3600);
    const mins = Math.floor(hoursRest / 60);
    const minsRest = Math.floor(hoursRest % 60);
    return [hours || -1, mins, minsRest]
        .filter(el => el >= 0)
        .map(el => el.toString().padStart(3 - el.toString().length, "0"))
        .join(":");
};

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
        <Text fontSize="xs">{timeToText(currentTime)}</Text>
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
        <Text fontSize="xs">{timeToText(duration)}</Text>
    </HStack>
);

export default TrackProgress;

import { FC } from "react";
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { RiVolumeUpFill, RiVolumeDownFill } from "react-icons/ri";

type Props = {
    volume: number,
    setVolume: (value: number) => void,
    [key: string]: any
};

const VolumeControl: FC<Props> = ({
    volume,
    setVolume,
    ...props
}) => (
    <Slider
        aria-label="Volume"
        colorScheme="gray"
        min={0}
        max={100}
        value={volume}
        onChange={setVolume}
        w={120}
        {...props}
    >
        <SliderTrack>
            <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={4} color="black" bg="gray.200" p="0.1rem">
            {volume > 50 ? <RiVolumeUpFill /> : <RiVolumeDownFill />}
        </SliderThumb>
    </Slider>
);

export default VolumeControl;

import { FC } from "react";
import {
    HStack,
    VStack,
    Text,
    Image,
    IconButton,
    ButtonGroup,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    BackgroundProps
} from "@chakra-ui/react";
import {
    RiShuffleLine,
    RiRepeat2Line,
    RiRepeatOneLine,
    RiVolumeDownFill,
    RiVolumeUpFill,
    RiPlayListFill,
    RiArrowDropDownLine,
    RiArrowDropUpLine
} from "react-icons/ri";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";

type Props = {
    imgSrc: string,
    title: string,
    artist: string,
    canPrev: boolean,
    timeToText: (secs: number) => string,
    prev: () => void,
    next: () => void,
    currentTime: number,
    duration: number,
    volume: number,
    isPlaybackEmpty: boolean,
    isPlaying: boolean,
    togglePlay: () => void,
    setCurrentTime: (time: number, manual?: any) => void,
    setVolume: (value: number) => void,
    bg: BackgroundProps["bg"],
    [key: string]: any
};

const PlayerMobile: FC<Props> = ({
    imgSrc,
    title,
    artist,
    canPrev,
    timeToText,
    prev,
    next,
    currentTime,
    duration,
    volume,
    isPlaybackEmpty,
    isPlaying,
    togglePlay,
    setCurrentTime,
    setVolume,
    bg,
    ...props
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <HStack
                w="full"
                spacing={4}
                bg={bg}
                {...props}
            >
                <HStack flexGrow={1}>
                    <Image
                        boxSize={16}
                        src={imgSrc}
                        fallbackSrc="/fallback.svg"
                        alt={title}
                    />
                    <VStack alignItems="start" spacing={1}>
                        <Text fontSize="sm" noOfLines={1} fontWeight="bold">
                            {title}
                        </Text>
                        <Text fontSize="xs" noOfLines={1}>
                            {artist}
                        </Text>
                    </VStack>
                </HStack>

                <ButtonGroup variant="ghost" flex={1} pr={3} spacing={3} justifyContent="flex-end">
                    <IconButton
                        aria-label={isPlaying ? "Pause" : "Play"}
                        icon={isPlaying ? <FaPause /> : <FaPlay />}
                        isDisabled={isPlaybackEmpty}
                        onClick={togglePlay}
                    />
                    <IconButton
                        aria-label="Toggle player collapse"
                        icon={<RiArrowDropUpLine size="2.5rem" />}
                        onClick={onOpen}
                    />
                </ButtonGroup>
            </HStack>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="full"
                motionPreset="slideInBottom"
                closeOnEsc={true}
                closeOnOverlayClick={true}
                returnFocusOnClose={false}
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent margin={0} bg={bg}>
                    <ModalCloseButton size="lg" top={5} left={3} right={0}>
                        <RiArrowDropDownLine size="2.5rem" />
                    </ModalCloseButton>
                    <ModalBody
                        w="full"
                        h="full"
                        px={6}
                        py={20}
                        display="flex"
                    >
                        <VStack
                            flex={1}
                            justify="space-around"
                        >
                            <Image
                                boxSize="64vw"
                                src={imgSrc}
                                fallbackSrc="/fallback.svg"
                                alt={title}
                            />

                            <VStack spacing={4}>
                                <VStack w="full" px={5} py={2} alignItems="start" spacing={1}>
                                    <Text fontSize="lg" fontWeight="bold" noOfLines={2}>
                                        {title}
                                    </Text>
                                    <Text fontSize="md" noOfLines={1}>
                                        {artist}
                                    </Text>
                                </VStack>

                                <VStack>
                                    <HStack>
                                        <Text fontSize="xs">{timeToText(currentTime)}</Text>
                                        <Slider
                                            aria-label="Song progress"
                                            colorScheme="gray"
                                            w="66vw"
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
                                    <ButtonGroup variant="ghost" size="md" justifyContent="space-evenly" alignItems="center" spacing={4} w="full">
                                        <IconButton
                                            aria-label="Shuffle"
                                            icon={<RiShuffleLine />}
                                        />
                                        <ButtonGroup variant="ghost" size="lg" isDisabled={isPlaybackEmpty}>
                                            <IconButton
                                                aria-label="Previous"
                                                icon={<FaStepBackward />}
                                                onClick={prev}
                                                disabled={!canPrev && currentTime <= 5}
                                            />
                                            <IconButton
                                                aria-label={isPlaying ? "Pause" : "Play"}
                                                icon={isPlaying ? <FaPause /> : <FaPlay />}
                                                variant="solid"
                                                onClick={togglePlay}
                                            />
                                            <IconButton
                                                aria-label="Next"
                                                icon={<FaStepForward />}
                                                onClick={next}
                                            />
                                        </ButtonGroup>
                                        <IconButton
                                            aria-label="Repeat"
                                            icon={<RiRepeat2Line />}
                                        />
                                    </ButtonGroup>
                                </VStack>
                            </VStack>

                            <HStack w="75vw" justify="space-between">
                                <IconButton
                                    aria-label="Queue"
                                    icon={<RiPlayListFill />}
                                    variant="ghost"
                                    size="lg"
                                />
                                <Slider
                                    aria-label="Volume"
                                    colorScheme="gray"
                                    min={0}
                                    max={100}
                                    value={volume}
                                    onChange={setVolume}
                                    w={120}
                                >
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb boxSize={4} color="black" bg="gray.200" p="0.1rem">
                                        {volume > 50 ? <RiVolumeUpFill /> : <RiVolumeDownFill />}
                                    </SliderThumb>
                                </Slider>
                            </HStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default PlayerMobile;

import { FC, DOMAttributes, } from "react";
import { Box, Icon, IconButton, Td } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { RiVolumeUpFill } from "react-icons/ri";

type Props = {
    title: string,
    playLabel: string,
    index: number,
    onClick: DOMAttributes<any>["onClick"],
    isPlaying: boolean,
    isOpen: boolean
};

const ListTrackAlbum: FC<Props> = ({
    title,
    playLabel,
    index,
    onClick,
    isPlaying,
    isOpen
}) => (
    <>
        <Td isNumeric={true}>
            <Box w={6} ms="auto">
                {isOpen || isPlaying ? (
                    <IconButton
                        aria-label={`${playLabel} '${title}'`}
                        icon={<Icon as={isPlaying ? RiVolumeUpFill: FaPlay} />}
                        onClick={onClick}
                        disabled={isPlaying}
                        _disabled={{ color: "currentColor", cursor: "not-allowed" }}
                        variant="unstyled"
                        colorScheme="kaihui"
                        size="xs"
                        w="fit-content"
                        h="fit-content"
                        minW={0}
                        minH={0}
                        lineHeight={0}
                    />
                ) : (
                    <>{index}</>
                )}
            </Box>
        </Td>

        <Td
            noOfLines={2}
            fontWeight="bold"
            cursor={isPlaying ? "not-allowed" : "pointer"}
            userSelect="none"
            onClick={isPlaying ? null : onClick}
        >
            {title}
        </Td>
    </>
);

export default ListTrackAlbum;

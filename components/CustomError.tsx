import { FC } from "react";
import { useRouter } from "next/router";
import { VStack, HStack, Spacer, Icon, IconButton, Heading } from "@chakra-ui/react";
import { FaRedo } from "react-icons/fa";
import { RiVolumeMuteFill } from "react-icons/ri";
import { FallbackProps } from "react-error-boundary";
import { CustomHead } from ".";

type Props = {
    statusCode: number,
    statusText: string
} | {
    errorSubject: string
} | {
    fallbackError: FallbackProps["error"]
};

const CustomError: FC<Props> = (props) => {
    const router = useRouter();
    return (
        <VStack
            mx={[8, null, 14]}
            my="auto"
            spacing={3}
            textAlign="center"
            userSelect="none"
        >
            {"statusCode" in props ? (
                <>
                    <CustomHead customTitle={`${props.statusCode} - ${props.statusText}`} robots={false} />

                    <HStack spacing={6}>
                        <Heading as="h2" size="4xl">
                            {props.statusCode}
                        </Heading>
                        <Icon as={RiVolumeMuteFill} boxSize={[16, null, 20]} aria-hidden="true" />
                    </HStack>

                    <Heading as="p" size="xl">
                        {props.statusText}
                    </Heading>
                </>
            ) : (
                <>
                    <Icon as={RiVolumeMuteFill} boxSize={[16, null, 20]} aria-hidden="true" />

                    {"errorSubject" in props ? (
                        <>
                            <CustomHead customTitle={`Couldn't load ${props.errorSubject}`} robots={false} />

                            <Heading as="h2" size="2xl">
                                Couldn&apos;t load {props.errorSubject}
                            </Heading>
                            <Heading as="p" size="md">
                                An error occurred while retrieving the {props.errorSubject}
                            </Heading>
                        </>
                    ) : (
                        <>
                            <CustomHead customTitle="Unexpected error" robots={false} />

                            <Heading as="h2" size="2xl">
                                Unexpected error
                            </Heading>
                            <Heading as="p" size="md" color="kaihong.700">
                                {props.fallbackError.message}
                            </Heading>
                        </>
                    )}

                    <Heading as="p" size="md">
                        Please reload the page several times or try again later
                    </Heading>

                    <Spacer />

                    <IconButton
                        aria-label="Reload"
                        icon={<FaRedo />}
                        onClick={router.reload}
                        variant="outline"
                        colorScheme="kaihui"
                        size="lg"
                    />
                </>
            )}
        </VStack>
    );
};

export default CustomError;

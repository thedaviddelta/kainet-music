import { extendTheme } from "@chakra-ui/react";
import { mode, transparentize } from "@chakra-ui/theme-tools";

const parseFieldColors = (props: Record<string, any>) => {
    const { colorScheme: c, theme } = props;
    return {
        color: mode(`${c}.600`, `${c}.200`)(props),
        _placeholder: {
            color: mode(`${c}.600`, `${c}.200`)(props),
            opacity: 0.6
        },
        borderColor: "currentColor",
        bg: "transparent",
        _hover: {
            bg: mode(`${c}.50`, transparentize(`${c}.200`, 0.12)(theme))(props),
        },
        _active: {
            bg: mode(`${c}.100`, transparentize(`${c}.200`, 0.24)(theme))(props),
        }
    }
};

export default extendTheme({
    colors: {
        kaihong: {
            50: "#feebee",
            100: "#fdcdd3",
            200: "#ec9a9c",
            300: "#e17476",
            400: "#eb5554",
            500: "#ef453c",
            600: "#e03c3a",
            700: "#ce3334",
            800: "#c12c2d",
            900: "#b22222"
        },
        kaihui: {
            50: "#f7fafc",
            100: "#edf2f7",
            200: "#e2e8f0",
            300: "#cbd5e0",
            400: "#a0aec0",
            500: "#718096",
            600: "#4a5568",
            700: "#2d3748",
            800: "#1a202c",
            900: "#171923",
        }
    },
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false
    },
    components: {
        Input: {
            variants: {
                ghost: props => ({
                    field: parseFieldColors(props)
                })
            }
        },
        Select: {
            variants: {
                ghost: props => ({
                    field: parseFieldColors(props)
                })
            }
        },
        Button: {
            variants: {
                thumbnail: props => {
                    const { colorScheme: c, theme } = props;
                    return {
                        color: `${c}.50`,
                        _disabled: {
                            opacity: 1
                        },
                        bg: transparentize(`${c}.300`, 0.15)(theme),
                        _hover: {
                            bg: transparentize(`${c}.300`, 0.3)(theme)
                        },
                        _active: {
                            bg: transparentize(`${c}.300`, 0.5)(theme)
                        },
                    }
                },
                customSolid: props => ({
                    color: "#1a1a1a",
                    bg: `${props.colorScheme}.600`,
                    _hover: {
                        bg: mode(`${props.colorScheme}.500`, `${props.colorScheme}.700`)(props)
                    },
                    _active: {
                        bg: mode(`${props.colorScheme}.400`, `${props.colorScheme}.800`)(props)
                    },
                    boxShadow: "0 0 0.5rem #1a1a1a"
                })
            }
        }
    }
});

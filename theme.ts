import { extendTheme } from "@chakra-ui/react";

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
        kailan: {
            50: "#e3f3ff",
            100: "#bce1ff",
            200: "#91cfff",
            300: "#62bbff",
            400: "#3dacff",
            500: "#189dff",
            600: "#1e90ff",
            700: "#1f7ceb",
            800: "#206ad9",
            900: "#1f4ab9"
        },
        kaihei: {
            700: "#1a1a1a",
            800: "#141414",
            900: "#000000"
        }
    },
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false
    }
});

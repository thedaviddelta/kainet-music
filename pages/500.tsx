import { FC } from "react";
import { CustomError } from "@components";

const My500: FC = () => (
    <CustomError statusCode={500} statusText="Internal server error" />
);

export default My500;

import { FC } from "react";
import NextLink from "next/link";
import { Link, forwardRef, LinkProps } from "@chakra-ui/react";

const LocalLink: FC<LinkProps> = forwardRef(({ href, children, ...props }, ref) => (
    <NextLink href={href} passHref={true}>
        <Link ref={ref} {...props}>
            {children}
        </Link>
    </NextLink>
));

export default LocalLink;

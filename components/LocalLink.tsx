import { FC } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { Link, forwardRef, LinkProps } from "@chakra-ui/react";

type Props = {
    prefetch?: NextLinkProps["prefetch"]
};

const LocalLink: FC<Props & LinkProps> = forwardRef(({ href, prefetch, children, ...props }, ref) => (
    <NextLink href={href} passHref={true} prefetch={prefetch}>
        <Link ref={ref} {...props}>
            {children}
        </Link>
    </NextLink>
));

export default LocalLink;

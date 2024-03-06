import React from "react";

import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import { Link as RemixLink, type LinkProps } from "@remix-run/react";

interface LinkPropsWithHref extends LinkProps {
   href?: string;
}

export const Link = React.forwardRef(function Link(
   props: LinkPropsWithHref,
   ref: React.ForwardedRef<HTMLAnchorElement>,
) {
   return (
      <HeadlessDataInteractive>
         <RemixLink {...props} to={props.href ?? props.to} ref={ref} />
      </HeadlessDataInteractive>
   );
});

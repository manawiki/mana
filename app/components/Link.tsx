import React from "react";

import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import { Link as RemixLink, type LinkProps } from "@remix-run/react";

export const Link = React.forwardRef(function Link(
   props: { href: string | LinkProps["to"] } & Omit<LinkProps, "to">,
   ref: React.ForwardedRef<HTMLAnchorElement>,
) {
   return (
      <HeadlessDataInteractive>
         <RemixLink {...props} to={props.href} ref={ref} />
      </HeadlessDataInteractive>
   );
});

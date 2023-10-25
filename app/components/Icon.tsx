import type { SVGProps } from "react";
import React from "react";

import { type IconName } from "./icons";

/**
 * Renders an SVG icon. The icon defaults to the size of the font. To make it
 * align vertically with neighboring text, you can pass the text as a child of
 * the icon and it will be automatically aligned.
 * Alternatively, if you're not ok with the icon being to the left of the text,
 * you need to wrap the icon and text in a common parent and set the parent to
 * display "flex" (or "inline-flex") with "items-center" and a reasonable gap.
 */
export function Icon({
   name,
   size,
   title,
   children,
   ...props
}: SVGProps<SVGSVGElement> & {
   name: IconName;
   size?: number;
   title?: string; // for accessibility
}) {
   if (children) {
      return (
         <span className="inline-flex items-center gap-1.5">
            <Icon
               name={name}
               size={size}
               title={
                  typeof children === "string"
                     ? children.toString().trim()
                     : title
               }
               {...props}
            />
            {children}
         </span>
      );
   }

   return (
      <svg viewBox="0 0 24 24" width={size} height={size} {...props}>
         <title>{title ?? name}</title>
         <use href={`/icons/${name}.svg#${name}`} />
      </svg>
   );
}

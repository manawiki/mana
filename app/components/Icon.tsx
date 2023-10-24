import type { SVGProps } from "react";

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
   className,
   children,
   ...props
}: SVGProps<SVGSVGElement> & {
   href: string;
   name?: IconName;
}) {
   if (children) {
      return (
         <span className="inline-flex items-center gap-1.5">
            <Icon name={name} className={className} {...props} />
            {children}
         </span>
      );
   }

   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className={"inline self-center " + className}
         {...props}
      >
         <use href={`/icons/${name}.svg#${name}`} />
      </svg>
   );
}

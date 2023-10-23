import type { SVGProps } from "react";

/**
 * Renders an SVG icon. The icon defaults to the size of the font. To make it
 * align vertically with neighboring text, you can pass the text as a child of
 * the icon and it will be automatically aligned.
 * Alternatively, if you're not ok with the icon being to the left of the text,
 * you need to wrap the icon and text in a common parent and set the parent to
 * display "flex" (or "inline-flex") with "items-center" and a reasonable gap.
 */
export function Icon({
   href,
   className,
   name = "icon",
   children,
   ...props
}: SVGProps<SVGSVGElement> & {
   href: string;
   name?: string;
}) {
   if (children) {
      return (
         <span className="inline-flex items-center gap-1.5">
            <Icon name={name} href={href} className={className} {...props} />
            {children}
         </span>
      );
   }
   return (
      <svg {...props} className={"inline self-center" + className}>
         <use href={href + "#" + name} />
      </svg>
   );
}

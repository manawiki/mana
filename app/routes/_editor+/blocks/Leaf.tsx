import type { RenderLeafProps } from "slate-react";
export const Leaf = ({ leaf, children, attributes }: RenderLeafProps) => {
   if (leaf.placeholder) {
      return (
         <>
            <span
               className="pointer-events-none absolute select-none text-zinc-300 dark:text-zinc-500"
               contentEditable={false}
            >
               {leaf.placeholder}
            </span>
            <span {...attributes}>{children}</span>
         </>
      );
   }

   if (leaf.bold) {
      children = <strong>{children}</strong>;
   }

   if (leaf.italic) {
      children = <em>{children}</em>;
   }

   if (leaf.underline) {
      children = <u>{children}</u>;
   }

   if (leaf.strikeThrough) {
      children = <del>{children}</del>;
   }

   return <span {...attributes}>{children}</span>;
};

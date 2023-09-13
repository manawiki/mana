import type { RenderLeafProps } from "slate-react";
export function Leaf({ leaf, children, attributes }: RenderLeafProps) {
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
}

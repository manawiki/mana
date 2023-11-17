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

   if (leaf.small) {
      children = <small>{children}</small>;
   }

   if (leaf.color) {
      children = <span className={leaf.color}>{children}</span>;
   }

   return <span {...attributes}>{children}</span>;
}

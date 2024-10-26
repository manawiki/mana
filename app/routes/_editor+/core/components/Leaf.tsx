import clsx from "clsx";
import { useReadOnly, type RenderLeafProps } from "slate-react";

import { Badge } from "~/components/Badge";

import { COLORS } from "./Toolbar";
export function Leaf({ leaf, children, attributes }: RenderLeafProps) {
   const readOnly = useReadOnly();

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

   if (leaf.redBG) {
      children = <Badge color="red">{children}</Badge>;
   }
   if (leaf.grayBG) {
      children = <Badge color="zinc">{children}</Badge>;
   }
   if (leaf.orangeBG) {
      children = <Badge color="orange">{children}</Badge>;
   }
   if (leaf.yellowBG) {
      children = <Badge color="yellow">{children}</Badge>;
   }
   if (leaf.greenBG) {
      children = <Badge color="green">{children}</Badge>;
   }
   if (leaf.limeBG) {
      children = <Badge color="lime">{children}</Badge>;
   }
   if (leaf.blueBG) {
      children = <Badge color="blue">{children}</Badge>;
   }
   if (leaf.violetBG) {
      children = <Badge color="violet">{children}</Badge>;
   }
   if (leaf.pinkBG) {
      children = <Badge color="pink">{children}</Badge>;
   }
   if (leaf.redText) {
      const { twClass } = COLORS.find((element) => element.id == "redText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.grayText) {
      const { twClass } = COLORS.find((element) => element.id == "grayText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.orangeText) {
      const { twClass } = COLORS.find((element) => element.id == "orangeText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.yellowText) {
      const { twClass } = COLORS.find((element) => element.id == "yellowText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.greenText) {
      const { twClass } = COLORS.find((element) => element.id == "greenText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.limeText) {
      const { twClass } = COLORS.find((element) => element.id == "limeText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.blueText) {
      const { twClass } = COLORS.find((element) => element.id == "blueText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.violetText) {
      const { twClass } = COLORS.find((element) => element.id == "violetText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.pinkText) {
      const { twClass } = COLORS.find((element) => element.id == "pinkText");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }

   // make sure text empty string never render as br, otherwise <span><br /></span> will cause html validation error
   if (readOnly && leaf.text === "") {
      children = "";
   }

   return <span {...attributes}>{children}</span>;
}

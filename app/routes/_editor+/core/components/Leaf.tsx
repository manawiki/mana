import clsx from "clsx";
import type { RenderLeafProps } from "slate-react";

import { COLORS } from "./Toolbar";
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

   if (leaf.redBG) {
      const { twClass } = COLORS.find((element) => element.id == "redBG");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.grayBG) {
      const { twClass } = COLORS.find((element) => element.id == "grayBG");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.orangeBG) {
      const { twClass } = COLORS.find((element) => element.id == "orangeBG");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.yellowBG) {
      const { twClass } = COLORS.find((element) => element.id == "yellowBG");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.greenBG) {
      const { twClass } = COLORS.find((element) => element.id == "greenBG");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.blueBG) {
      const { twClass } = COLORS.find((element) => element.id == "blueBG");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.violetBG) {
      const { twClass } = COLORS.find((element) => element.id == "violetBG");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
   }
   if (leaf.pinkBG) {
      const { twClass } = COLORS.find((element) => element.id == "pinkBG");
      children = (
         <span className={clsx(twClass, "px-0.5 rounded")}>{children}</span>
      );
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

   return <span {...attributes}>{children}</span>;
}

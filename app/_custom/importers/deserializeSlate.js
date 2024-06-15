import { jsx } from "slate-hyperscript";

import { nanoid } from "nanoid";

// Create a JSDOM instance to access DOM Node constants
const { JSDOM } = require("jsdom");
const { Node } = new JSDOM().window;

export const deserializeSlate = (el, markAttributes = {}) => {
   if (el.nodeType === Node.TEXT_NODE) {
      return jsx("text", markAttributes, el.textContent);
   } else if (el.nodeType !== Node.ELEMENT_NODE) {
      return null;
   }

   const nodeAttributes = { ...markAttributes };

   // define attributes for text nodes
   switch (el.nodeName) {
      case "STRONG":
         nodeAttributes.bold = true;
   }

   const children = Array.from(el.childNodes)
      .map((node) => deserializeSlate(node, nodeAttributes))
      .flat();

   if (children.length === 0) {
      children.push(jsx("text", nodeAttributes, ""));
   }
   console.log(el.nodeName);

   switch (el.nodeName) {
      case "BODY":
         return jsx("fragment", {}, children);
      case "BR":
         return "\n";
      case "BLOCKQUOTE":
         return jsx("element", { type: "quote", id: nanoid() }, children);
      case "P":
         return jsx("element", { type: "paragraph", id: nanoid() }, children);
      case "A":
         return jsx(
            "element",
            { type: "link", id: nanoid(), url: el.getAttribute("href") },
            children,
         );
      default:
         return children;
   }
};

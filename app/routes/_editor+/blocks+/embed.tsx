import { Transforms } from "slate";
import { ReactEditor, type RenderElementProps, useSlate } from "slate-react";

import type { EmbedElement, CustomElement } from "../core/types";

export function BlockEmbed({
   children,
   element,
   readOnly,
   attributes,
}: RenderElementProps & {
   element: EmbedElement;
   readOnly: Boolean;
}) {
   const editor = useSlate();

   const path = ReactEditor.findPath(editor, element);

   return <div className="" contentEditable={false} {...attributes}></div>;
}

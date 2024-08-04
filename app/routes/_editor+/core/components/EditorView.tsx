import { useCallback, useMemo } from "react";

import { useLocation } from "@remix-run/react";
import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";

// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "./EditorBlocks";
import { Leaf } from "./Leaf";
import { BlockType } from "../types";
import { initialValue } from "../utils";

export function EditorView({
   data,
   autoWidth,
}: {
   data: any;
   autoWidth?: boolean;
}) {
   const editor = useMemo(() => withReact(createEditor()), []);
   const location = useLocation();

   const renderElement = useCallback((props: RenderElementProps) => {
      const path = ReactEditor.findPath(editor, props.element);
      const isTopLevel = path.length === 1;
      const isVariableWidth =
         props.element.type === BlockType.Image && props.element.containerWidth;

      return isTopLevel ? (
         <div
            style={{
               width: isVariableWidth
                  ? //@ts-ignore
                    `${props.element.containerWidth}px`
                  : autoWidth
                    ? "auto"
                    : "728px",
            }}
            className="relative mx-auto max-tablet:!w-full"
         >
            <EditorBlocks {...props} />
         </div>
      ) : (
         <EditorBlocks {...props} />
      );
   }, []);
   return (
      <Slate
         key={location.pathname}
         editor={editor}
         initialValue={data ?? initialValue()}
      >
         <Editable
            renderElement={renderElement}
            renderLeaf={Leaf}
            readOnly={true}
         />
      </Slate>
   );
}

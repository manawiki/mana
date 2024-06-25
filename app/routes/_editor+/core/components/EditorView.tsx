import { useCallback, useMemo } from "react";

import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";

// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "./EditorBlocks";
import { Leaf } from "./Leaf";
import { BlockType } from "../types";
import { initialValue } from "../utils";

export function EditorView({ data }: { data: any }) {
   const editor = useMemo(() => withReact(createEditor()), []);

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
                  : "auto",
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
      <Slate editor={editor} initialValue={data ?? initialValue()}>
         <Editable
            renderElement={renderElement}
            renderLeaf={Leaf}
            readOnly={true}
         />
      </Slate>
   );
}

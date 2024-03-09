import { useCallback, useMemo } from "react";

import clsx from "clsx";
import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact } from "slate-react";

// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "./EditorBlocks";
import { Leaf } from "./Leaf";
import { BlockType } from "../types";

export function EditorView({ data }: { data: any }) {
   const editor = useMemo(() => withReact(createEditor()), []);

   const renderElement = useCallback((props: RenderElementProps) => {
      const isVariableWidth = props.element.type === BlockType.Image;

      return (
         <span
            style={{
               width:
                  //@ts-ignore
                  isVariableWidth && props.element.containerWidth
                     ? //@ts-ignore
                       `${props.element.containerWidth}px`
                     : "728px",
            }}
            className={clsx(
               !isVariableWidth && "mx-auto max-w-[728px]",
               "w-full group/editor relative mx-auto max-tablet:!max-w-full max-tablet:!w-full",
            )}
         >
            <EditorBlocks {...props} />
         </span>
      );
   }, []);
   return (
      <Slate editor={editor} initialValue={data}>
         <Editable
            renderElement={renderElement}
            renderLeaf={Leaf}
            readOnly={true}
         />
      </Slate>
   );
}

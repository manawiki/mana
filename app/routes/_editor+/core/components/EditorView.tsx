import { useCallback, useMemo } from "react";

import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact } from "slate-react";

// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "./EditorBlocks";
import { Leaf } from "./Leaf";

export function EditorView({ data }: { data: any }) {
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <EditorBlocks {...props} />;
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

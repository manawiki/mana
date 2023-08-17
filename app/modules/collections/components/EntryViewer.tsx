import { useMemo, useCallback } from "react";

import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";

import Block from "~/modules/editor/blocks/Block";
import Leaf from "~/modules/editor/blocks/Leaf";

//Isolate the Slate Viewer to make it easier to tree-shake with lazily loaded components
export const EntryViewer = ({ content }: { content: any }) => {
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);
   return (
      <Slate editor={editor} initialValue={content}>
         <Editable
            renderElement={renderElement}
            renderLeaf={Leaf}
            readOnly={true}
         />
      </Slate>
   );
};

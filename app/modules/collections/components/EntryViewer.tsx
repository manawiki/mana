import { useMemo, useCallback } from "react";

import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";

import { EditorBlocks } from "~/routes/_editor+/core/components/EditorBlocks";
import { Leaf } from "~/routes/_editor+/core/components/Leaf";

//Isolate the Slate Viewer to make it easier to tree-shake with lazily loaded components
export const EntryViewer = ({ content }: { content: any }) => {
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <EditorBlocks {...props} />;
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

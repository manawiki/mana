import { Suspense, useCallback, useMemo } from "react";

import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact } from "slate-react";

import { Icon } from "~/components/Icon";

// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "./EditorBlocks";
import { Leaf } from "./Leaf";

export function EditorView({ data }: { data: any }) {
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <EditorBlocks {...props} />;
   }, []);
   return (
      <Suspense
         //we'll use this suspense boundary to limit the damage when hydration mismatch
         fallback={<Loading />}
      >
         <Slate editor={editor} initialValue={data}>
            <Editable
               renderElement={renderElement}
               renderLeaf={Leaf}
               readOnly={true}
            />
         </Slate>
      </Suspense>
   );
}

const Loading = () => (
   <div className="flex items-center justify-center py-10">
      <Icon
         name="loader-2"
         size={20}
         className="animate-spin dark:text-zinc-500 text-zinc-400"
      />
   </div>
);

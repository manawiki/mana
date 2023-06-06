import { useEffect, useMemo, useState } from "react";
import { type Descendant, createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import type { CustomElement } from "../../../../modules/editor/types";
import Leaf from "~/modules/editor/blocks/Leaf";
import Block from "~/modules/editor/blocks/Block";
import { Toolbar } from "~/modules/editor/components";
import { onKeyDown } from "~/modules/editor/editorCore";
import { useFetcher } from "@remix-run/react";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { withHistory } from "slate-history";

const useEditor = () =>
   useMemo(() => withReact(withHistory(createEditor())), []);
export const initialValue = [
   {
      type: "updatesInline",
      children: [{ text: "" }],
   },
];

export const UpdatesEditor = ({
   rowId,
   entryId,
   blocks,
   siteId,
}: {
   rowId: string;
   entryId?: string;
   blocks?: CustomElement[];
   siteId: string | undefined;
}) => {
   const editor = useEditor();
   editor.isInline = (element) => ["link"].includes(element.type);
   const isMount = useIsMount();
   const fetcher = useFetcher();
   const [value, setValue] = useState("");

   const debouncedValue = useDebouncedValue(value, 500);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            {
               content: JSON.stringify(debouncedValue),
               intent: "updateEntry",
               rowId,
               entryId: entryId ?? "",
            },
            { method: "patch", action: `/${siteId}/blocks/BlockUpdates` }
         );
      }
   }, [debouncedValue]);

   return (
      <Slate
         onChange={(e) => setValue(e)}
         editor={editor}
         value={(blocks as Descendant[]) ?? initialValue}
      >
         <Toolbar />
         <Editable
            renderElement={Block}
            renderLeaf={Leaf}
            onKeyDown={(e) => onKeyDown(e, editor)}
         />
      </Slate>
   );
};

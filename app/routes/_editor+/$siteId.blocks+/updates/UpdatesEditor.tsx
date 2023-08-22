import { useEffect, useMemo, useState } from "react";

import { useFetcher } from "@remix-run/react";
import { type Descendant, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

import { useDebouncedValue, useIsMount } from "~/hooks";
// eslint-disable-next-line import/no-cycle
import { Block } from "~/routes/_editor+/blocks/Block";
import { Leaf } from "~/routes/_editor+/blocks/Leaf";
import { Toolbar } from "~/routes/_editor+/components";
import { onKeyDown } from "~/routes/_editor+/functions/editorCore";
import type { CustomElement } from "~/routes/_editor+/types";

const useEditor = () =>
   useMemo(() => withReact(withHistory(createEditor())), []);

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
            { method: "patch", action: `/${siteId}/blocks/updates` }
         );
      }
   }, [debouncedValue]);

   return (
      <Slate
         //@ts-ignore
         onChange={(e) => setValue(e)}
         editor={editor}
         initialValue={blocks as Descendant[]}
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

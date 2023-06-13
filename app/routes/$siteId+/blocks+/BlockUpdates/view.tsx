import { useRouteLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import type { Update } from "~/db/payload-types";
import Block from "~/modules/editor/blocks/Block";
import Leaf from "~/modules/editor/blocks/Leaf";
import type { UpdatesElement } from "~/modules/editor/types";

type Props = {
   element: UpdatesElement;
};

const dateFormat = (dateString: string) =>
   new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
   }).format(new Date(dateString));

export const BlockUpdatesView = ({ element }: Props) => {
   const { updateResults } =
      (useRouteLoaderData("routes/$siteId+/_layout") as {
         updateResults: Update[];
      }) || [];

   return (
      <section className="my-6">
         <h2>Updates</h2>
         {updateResults?.length === 0 ? null : (
            <div className="divide-color border-color divide-y border-y">
               {updateResults?.map((row) => (
                  <section key={row.id} className="flex items-start gap-2">
                     <time
                        className="text-1 w-20 flex-none py-3 text-xs font-semibold uppercase"
                        dateTime={row?.createdAt}
                     >
                        {dateFormat(row?.createdAt)}
                     </time>
                     <span className="divide-color flex-grow divide-y text-sm">
                        {row.entry?.length === 0 ? null : (
                           <>
                              {row.entry?.map((item) => (
                                 <div key={item.id} className="py-2.5">
                                    <UpdatesEditorView
                                       content={item.content as Descendant[]}
                                    />
                                 </div>
                              ))}
                           </>
                        )}
                     </span>
                  </section>
               ))}
            </div>
         )}
      </section>
   );
};

const useEditor = () => useMemo(() => withReact(createEditor()), []);

const UpdatesEditorView = ({ content }: { content: Descendant[] }) => {
   const editor = useEditor();
   editor.isInline = (element) => ["link"].includes(element.type);
   return (
      <Slate editor={editor} value={content}>
         <Editable renderElement={Block} renderLeaf={Leaf} readOnly={true} />
      </Slate>
   );
};

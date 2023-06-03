import { useFetcher, useParams, useRouteLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useMemo } from "react";
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
                        {format(new Date(row?.createdAt), "MMM dd")}
                     </time>
                     <span className="divide-color flex-grow divide-y text-sm">
                        {row.entry?.length === 0 ? null : (
                           <>
                              {row.entry?.map((item) => (
                                 <UpdatesEditorView
                                    key={item.id}
                                    content={item.content as Descendant[]}
                                 />
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

const UpdatesEditorView = ({ content }: { content: Descendant[] }) => {
   const editor = withReact(createEditor());
   editor.isInline = (element) => ["link"].includes(element.type);
   return (
      <Slate editor={editor} value={content}>
         <Editable renderElement={Block} renderLeaf={Leaf} readOnly={true} />
      </Slate>
   );
};

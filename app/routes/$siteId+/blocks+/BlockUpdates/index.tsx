import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useParams, useRouteLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { z } from "zod";
import { zx } from "zodix";
import type { Update } from "~/db/payload-types";
import { UpdatesEditor } from "~/routes/$siteId+/blocks+/BlockUpdates/UpdatesEditor";
import type { UpdatesElement } from "~/modules/editor/types";

type Props = {
   element: UpdatesElement;
};

export const BlockUpdates = ({ element }: Props) => {
   const { updateResults } =
      (useRouteLoaderData("routes/$siteId+/_layout") as {
         updateResults: Update[];
      }) || [];
   const { siteId } = useParams();

   return (
      <div className="">
         {updateResults?.length === 0 ? null : (
            <>
               <h2>Updates</h2>
               <div className="divide-color border-color divide-y border-y">
                  <div className="flex items-center justify-between gap-2 py-2">
                     <span className="text-1 w-20 flex-none py-2.5 text-xs font-bold uppercase">
                        Today
                     </span>
                     <button className="bg-4 shadow-1 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-sm">
                        Add
                     </button>
                  </div>
                  {updateResults?.map((row) => (
                     <section key={row.id} className="flex items-start gap-2">
                        <time
                           className="text-1 w-20 flex-none py-3 text-xs font-semibold uppercase"
                           dateTime={row?.createdAt}
                        >
                           {format(new Date(row?.createdAt), "MMM dd")}
                        </time>
                        <span className="divide-color flex-grow divide-y text-sm">
                           {row.entry?.length === 0 ? (
                              <UpdatesEditor rowId={row.id} siteId={siteId} />
                           ) : (
                              <>
                                 {row.entry?.map((item) => (
                                    <UpdatesEditor
                                       key={item.id}
                                       rowId={row.id}
                                       entryId={item.id}
                                       siteId={siteId}
                                       blocks={item.content}
                                    />
                                 ))}
                              </>
                           )}
                        </span>
                     </section>
                  ))}
               </div>
            </>
         )}
      </div>
   );
};

export const action = async ({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) => {
   if (!user || !user.id) throw redirect("/login", { status: 302 });

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   switch (intent) {
      case "createUpdate": {
         const slug = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteId,
               },
            },
            user,
         });
         const site = slug?.docs[0];

         try {
            return await payload.create({
               collection: "updates",
               data: {
                  site: site.id,
                  entry: [
                     {
                        content: [
                           {
                              type: "updatesInline",
                              children: [{ text: "" }],
                           },
                        ],
                     },
                  ],
               },
               overrideAccess: false,
               user,
            });
         } catch (error) {
            console.log(error);
            return json({
               error: "Something went wrong...",
            });
         }
      }
      case "updateEntry": {
         const { content, rowId, entryId } = await zx.parseForm(request, {
            content: z.string(),
            rowId: z.string(),
            entryId: z.string().optional(),
         });
         console.log(rowId);
         const updateData = await payload.findByID({
            collection: "updates",
            id: rowId,
            user,
         });

         const entryData = updateData.entry;

         //Update nested entry content for particular date
         const updatedData = entryData?.map((x) =>
            x.id === entryId ? { ...x, content: JSON.parse(content) } : x
         );

         try {
            return await payload.update({
               collection: "updates",
               id: rowId,
               data: {
                  entry: updatedData ?? {},
               },
               overrideAccess: false,
               user,
            });
         } catch (error) {
            console.log(error);
            return json({
               error: "Something went wrong...unable to update title.",
            });
         }
      }
   }
};

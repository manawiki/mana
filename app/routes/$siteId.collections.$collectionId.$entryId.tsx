import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { ChevronRight, Edit2, Plus } from "lucide-react";
import { Suspense } from "react";
import { NoteViewer } from "~/modules/note/components/NoteViewer";
import { formatDistanceStrict } from "date-fns";

import type { Note } from "payload-types";
import { AdminOrOwner } from "~/modules/auth";

export async function loader({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) {
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });
   const entry = await payload.findByID({
      collection: "entries",
      id: entryId,
   });
   return json({ entry });
}

export const meta: V2_MetaFunction = ({ parentsData }) => {
   const name = parentsData["routes/$siteId"].site.name;
   return [
      {
         title: `Entry Page - ${name}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   breadcrumb: ({ pathname, data }: { pathname: string; data: any }) => (
      <NavLink
         end
         className={({ isActive }) =>
            `${
               isActive &&
               "font-semibold text-zinc-500 underline  dark:text-zinc-300"
            } flex items-center gap-3 decoration-blue-300 underline-offset-2 hover:underline dark:decoration-blue-400`
         }
         to={pathname}
      >
         <ChevronRight className="h-5 w-5 text-zinc-300 dark:text-zinc-500" />
         <span>{data.entry.name}</span>
      </NavLink>
   ),
};

export default function CollectionEntry() {
   const { entry } = useLoaderData<typeof loader>();

   return (
      <div
         className="post-content max-laptop:pt-24 max-laptop:pb-20 relative mx-auto 
      min-h-screen max-w-[728px]  laptop:py-12 desktop:px-0"
      >
         <h1 className="pb-3 font-mono text-2xl font-semibold laptop:text-3xl">
            {entry?.name}
         </h1>
         <time
            className="block pb-5 text-sm dark:text-zinc-400"
            dateTime={entry?.updatedAt}
         >
            {formatDistanceStrict(
               new Date(entry?.updatedAt as string),
               new Date(),
               {
                  addSuffix: true,
               }
            )}
         </time>
         {entry.icon ? (
            <img
               alt={entry.name}
               className="h-full w-full object-cover"
               //@ts-ignore
               src={`https://mana.wiki/cdn-cgi/image/fit=crop,height=440,gravity=auto/${entry?.icon?.url}`}
            />
         ) : null}
         <Suspense fallback={<div>Loading...</div>}>
            {(entry?.notes as Note[])?.map((note) => (
               <div key={note.id} className="group">
                  <div
                     className="max-desktop:justify-end max-desktop:pb-2 hidden group-hover:flex
                                          desktop:absolute desktop:right-0 desktop:mr-2 "
                  >
                     <Link
                        to={`edit/${note.id}`}
                        prefetch="intent"
                        className="flex h-8 w-8 items-center justify-center rounded-full
                                              border border-blue-300 bg-blue-50 text-blue-500 
                                              dark:border-blue-600 dark:bg-blue-900 dark:text-white"
                     >
                        <Edit2 className="h-3.5 w-3.5 text-blue-500 dark:text-white" />
                     </Link>
                  </div>
                  <NoteViewer
                     className="border-color post-content mb-4 min-h-[50px] border-b"
                     note={note}
                     //insert custom components here
                     components={
                        {
                           // h2: (props) => <h2 className="text-2xl" {...props} />,
                        }
                     }
                  />
               </div>
            ))}
         </Suspense>
         <AdminOrOwner>
            <div
               className="border-color bg-2 laptop:bg-1 sticky bottom-12 z-20 flex h-20 
                    items-center justify-between 
                    border-t px-3 shadow laptop:bottom-0 laptop:h-14"
            >
               <div className="mx-auto -mt-14 laptop:-mt-8">
                  <Link to="add" prefetch="intent">
                     <div
                        className="mx-auto flex h-11 w-11 items-center justify-center
                    rounded-full border border-blue-300
                   bg-blue-500 font-semibold text-white dark:border-blue-700 
                   dark:bg-blue-800 "
                     >
                        <Plus className="h-6 w-6" />
                     </div>
                     <div className="pt-1 text-sm font-semibold">
                        Add Section
                     </div>
                  </Link>
               </div>
            </div>
         </AdminOrOwner>
         <Outlet />
      </div>
   );
}

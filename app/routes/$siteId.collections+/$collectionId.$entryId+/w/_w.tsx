import { Link, useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { Fragment, Suspense } from "react";
import { NoteViewer } from "~/modules/note/components/NoteViewer";
import { WikiInlineEditor } from "./WikiInlineEditor";
import { EntryHeader, getDefaultEntryData, meta } from "~/modules/collections";
import { Popover, Transition } from "@headlessui/react";
import { Plus, Type, Component } from "lucide-react";
import { AdminOrOwner } from "~/modules/auth";
import type { Note } from "payload/generated-types";

export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });
   let notes = [] as Note[];

   const authorId =
      typeof entryDefault.author === "string"
         ? entryDefault.author
         : entryDefault?.author?.id;

   //pass in draft docs if the user is the author
   if (entryDefault?.notes && authorId === user?.id)
      notes = await Promise.all(
         entryDefault?.notes?.map((note) =>
            payload.findByID({
               collection: "notes",
               id: typeof note === "string" ? note : note.id,
               draft: true,
               overrideAccess: false,
               user,
            })
         )
      );

   return json({ entryDefault, notes });
}

export { meta };

export default function CollectionEntryWiki() {
   const { entryDefault, notes } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const { siteId, entryId, collectionId } = useParams();

   return (
      <>
         <EntryHeader entry={entryDefault} />
         {notes.length === 0 ? (
            <div className="border-b flex items-center justify-center border-color mb-12 py-20 bg-3">
               Wiki entry is empty...
            </div>
         ) : (
            <Suspense fallback={<div>Loading...</div>}>
               {notes.map((note, noteIdx) => (
                  <div key={note.id} className="group">
                     {/* @ts-ignore */}
                     {note?.ui?.id == "textarea" ? (
                        <WikiInlineEditor
                           note={note}
                           index={noteIdx}
                           notes={notes}
                        />
                     ) : (
                        <>
                           {/* Render noteview with edit button */}
                           <Link
                              to={`edit/${note.id}`}
                              prefetch="intent"
                              className="absolute right-0 hidden rounded bg-blue-500 px-2 py-1 
                           text-xs font-bold text-white group-hover:inline-block"
                           >
                              Edit
                           </Link>
                           <NoteViewer
                              className="post-content outline-1 outline-offset-8 
                           outline-zinc-300 group-hover:cursor-pointer 
                           group-hover:rounded-sm group-hover:outline-dotted 
                           dark:outline-zinc-600"
                              note={note}
                              //insert custom components here
                              components={
                                 {
                                    // h2: (props) => <h2 className="text-2xl" {...props} />,
                                 }
                              }
                           />
                        </>
                     )}
                  </div>
               ))}
            </Suspense>
         )}
         <AdminOrOwner>
            <div
               className="bg-2 border-color sticky bottom-12 z-30 flex h-12 
                    items-center justify-between mt-60 mb-12
                    border-y px-3 laptop:bottom-0 laptop:h-14"
            >
               <div className="mx-auto -mt-14 laptop:-mt-11">
                  <Popover className="relative flex items-center justify-center">
                     {({ open }) => (
                        <>
                           <Popover.Button className="focus:outline-none justify-center mx-auto">
                              <div
                                 className="flex h-14 w-14 items-center justify-center
                              rounded-full border-2 border-yellow-200 active:translate-y-0.5
                              shadow shadow-yellow-100 bg-yellow-100
                              font-semibold text-yellow-500 dark:border-yellow-800 
                              dark:shadow-yellow-900/40 focus-visible:blur-none
                              transition duration-300 dark:bg-yellow-900"
                              >
                                 <Plus
                                    size={28}
                                    className={`${
                                       open
                                          ? "rotate-45 dark:text-zinc-200 text-zinc-400"
                                          : ""
                                    } transform transition duration-300 ease-in-out`}
                                 />
                              </div>
                           </Popover.Button>
                           <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                           >
                              <Popover.Panel
                                 className="absolute flex items-center gap-3 -top-[50px] 
                                    left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                              >
                                 <Popover.Button
                                    onClick={() =>
                                       fetcher.submit(
                                          {
                                             intent: "addNewInlineSection",
                                             ui: "textarea",
                                          },
                                          {
                                             method: "post",
                                             action: `/${siteId}/collections/${collectionId}/${entryId}/add`,
                                          }
                                       )
                                    }
                                    className="flex rounded-full text-sm shadow dark:shadow-black/50 font-bold hover:border-zinc-100
                                       border border-color bg-2 items-center gap-2 h-11 justify-center hover:bg-white
                                       dark:hover:bg-zinc-700 dark:hover:border-zinc-600 w-28"
                                 >
                                    <Type
                                       className="text-yellow-500 flex-none -ml-0.5"
                                       size={20}
                                    />
                                    <span>Text</span>
                                 </Popover.Button>
                                 <Link
                                    className="flex rounded-full text-sm shadow dark:shadow-black/50 font-bold hover:border-zinc-100
                                       border border-color bg-2 items-center gap-2 w-28 h-11 justify-center hover:bg-white
                                     dark:hover:bg-zinc-700 dark:hover:border-zinc-600"
                                    to={`/${siteId}/collections/${collectionId}/${entryId}/add`}
                                    prefetch="intent"
                                 >
                                    <Component
                                       className="text-yellow-500 flex-none -ml-0.5"
                                       size={20}
                                    />
                                    <span>Widget</span>
                                 </Link>
                              </Popover.Panel>
                           </Transition>
                        </>
                     )}
                  </Popover>
                  <div className="pt-2 max-laptop:hidden uppercase text-xs text-1 font-bold">
                     Add Section
                  </div>
               </div>
            </div>
         </AdminOrOwner>
      </>
   );
}

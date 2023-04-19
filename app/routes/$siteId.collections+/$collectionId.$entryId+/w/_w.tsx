import { Link, useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { Fragment } from "react";
import { EntryHeader, getDefaultEntryData, meta } from "~/modules/collections";
import { Popover, Transition } from "@headlessui/react";
import { Plus, Type, Component } from "lucide-react";
import { AdminOrStaffOrOwner } from "~/modules/auth";

export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });

   return json({ entryDefault });
}

export { meta };

export default function CollectionEntryWiki() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const { siteId, entryId, collectionId } = useParams();

   return (
      <>
         <EntryHeader entry={entryDefault} />

         <AdminOrStaffOrOwner>
            <div
               className="bg-2 border-color sticky bottom-12 z-30 mb-12 mt-60 
                    flex h-12 items-center justify-between
                    border-y px-3 laptop:bottom-0 laptop:h-14"
            >
               <div className="mx-auto -mt-14 laptop:-mt-11">
                  <Popover className="relative flex items-center justify-center">
                     {({ open }) => (
                        <>
                           <Popover.Button className="mx-auto justify-center focus:outline-none">
                              <div
                                 className="flex h-14 w-14 items-center justify-center
                              rounded-full border-2 border-yellow-200 bg-yellow-100
                              font-semibold text-yellow-500 shadow
                              shadow-yellow-100 transition duration-300 
                              focus-visible:blur-none active:translate-y-0.5
                              dark:border-yellow-800 dark:bg-yellow-900 dark:shadow-yellow-900/40"
                              >
                                 <Plus
                                    size={28}
                                    className={`${
                                       open
                                          ? "rotate-45 text-zinc-400 dark:text-zinc-200"
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
                                 className="absolute -top-[50px] left-1/2 flex -translate-x-1/2 
                                    -translate-y-1/2 transform items-center gap-3"
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
                                    className="border-color bg-2 flex h-11 w-28 items-center justify-center
                                       gap-2 rounded-full border text-sm font-bold shadow hover:border-zinc-100 hover:bg-white
                                       dark:shadow-black/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                                 >
                                    <Type
                                       className="-ml-0.5 flex-none text-yellow-500"
                                       size={20}
                                    />
                                    <span>Text</span>
                                 </Popover.Button>
                                 <Link
                                    className="border-color bg-2 flex h-11 w-28 items-center justify-center
                                       gap-2 rounded-full border text-sm font-bold shadow hover:border-zinc-100 hover:bg-white dark:shadow-black/50
                                     dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                                    to={`/${siteId}/collections/${collectionId}/${entryId}/add`}
                                    prefetch="intent"
                                 >
                                    <Component
                                       className="-ml-0.5 flex-none text-yellow-500"
                                       size={20}
                                    />
                                    <span>Widget</span>
                                 </Link>
                              </Popover.Panel>
                           </Transition>
                        </>
                     )}
                  </Popover>
                  <div className="text-1 pt-2 text-xs font-bold uppercase max-laptop:hidden">
                     Add Section
                  </div>
               </div>
            </div>
         </AdminOrStaffOrOwner>
      </>
   );
}

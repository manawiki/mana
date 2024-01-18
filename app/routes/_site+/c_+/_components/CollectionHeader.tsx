import { Fragment, useEffect, useState } from "react";

import { Menu } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import {
   useLocation,
   useMatches,
   NavLink,
   Link,
   useFetcher,
   useRouteLoaderData,
} from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import clsx from "clsx";
import { useZorm } from "react-zorm";
import { z } from "zod";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { NotAdminOrStaffOrOwner } from "~/routes/_auth+/components/NotAdminOrStaffOrOwner";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { isAdding, isProcessing } from "~/utils/form";

import { CircleImageUploader } from "./ImageUpload";
import type { EntryType } from "../$collectionId_.$entryId/utils/_entryTypes";

const CollectionSchema = z.object({
   name: z.string().min(3),
   collectionId: z.string(),
   intent: z.enum(["updateCollectionName"]),
});

export function CollectionHeader() {
   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };

   //entry data should live in $collectionId_$entryId, this may be potentially brittle if we shift site architecture around
   const { entry } = (useMatches()?.[2]?.data as {
      entry: EntryType | null;
   }) ?? {
      entry: null,
   };

   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[2];

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionSlug,
   );

   const entryName = entry?.name;

   const isEntry = entry?.name && entry?.id;

   const icon = isEntry
      ? entry?.icon && entry?.icon
      : collection?.icon && collection?.icon;

   const intent = isEntry ? "entry" : "collection";

   const entityId = isEntry ? entry?.id : collection?.id;

   const actionPath = isEntry
      ? `/c/${collection?.slug}/${entry?.id}`
      : `/c/${collection?.slug}`;

   const [isChanged, setIsChanged] = useState(false);

   const fetcher = useFetcher();

   const zo = useZorm("collectionSettings", CollectionSchema);

   const disabled =
      isProcessing(fetcher.state) || zo.validation?.success === false;
   const saving = isAdding(fetcher, "updateCollectionName");

   useEffect(() => {
      if (!saving) {
         setIsChanged(false);
      }
   }, [saving]);

   return (
      <div className="bg-gradient-to-t from-zinc-50 to-white dark:from-dark350 dark:to-bg3Dark relative">
         <div className="mx-auto max-w-[728px] pb-2 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6 z-20 relative">
            <div className="flex items-center justify-between gap-4">
               <NotAdminOrStaffOrOwner>
                  <h1 className="font-bold font-header text-2xl laptop:text-3xl">
                     {entryName ?? collection?.name}
                  </h1>
               </NotAdminOrStaffOrOwner>
               <AdminOrStaffOrOwner>
                  <fetcher.Form
                     action={actionPath}
                     className="flex items-center justify-between gap-3 w-full"
                     method="post"
                     onChange={() => setIsChanged(true)}
                     ref={zo.ref}
                  >
                     <input
                        name={zo.fields.name()}
                        className="bg-transparent w-full font-bold font-header text-2xl laptop:text-3xl focus:outline-none"
                        defaultValue={entryName ?? collection?.name}
                     />
                     <input
                        name={zo.fields.intent()}
                        value="updateCollectionName"
                        type="hidden"
                     />
                     <input
                        name={zo.fields.collectionId()}
                        value={collection?.id}
                        type="hidden"
                     />
                     {isChanged && (
                        <>
                           <Tooltip placement="top">
                              <TooltipTrigger
                                 type="reset"
                                 onClick={() => {
                                    //@ts-ignore
                                    zo.refObject.current.reset();
                                    setIsChanged(false);
                                 }}
                                 className="text-xs cursor-pointer hover:dark:bg-dark400 
                                 flex items-center justify-center size-7 rounded-full"
                              >
                                 <Icon
                                    title="Reset"
                                    size={16}
                                    name="refresh-ccw"
                                    className="dark:text-zinc-500"
                                 />
                              </TooltipTrigger>
                              <TooltipContent>Reset</TooltipContent>
                           </Tooltip>
                           <Button
                              type="submit"
                              color="green"
                              className="cursor-pointer text-xs !rounded-md w-12 h-7"
                              disabled={!isChanged || disabled}
                           >
                              {saving ? (
                                 <Icon
                                    size={16}
                                    name="loader-2"
                                    className="mx-auto animate-spin"
                                 />
                              ) : (
                                 "Save"
                              )}
                           </Button>
                        </>
                     )}
                  </fetcher.Form>
               </AdminOrStaffOrOwner>
               <div className="flex-none group relative tablet:-mr-1 border border-color-sub shadow-1 shadow-sm bg-white dark:bg-dark350 -mb-6 flex h-16 w-16 rounded-full overflow-hidden items-center">
                  <CircleImageUploader
                     image={icon}
                     actionPath={actionPath}
                     intent={intent}
                     entityId={entityId}
                  />
               </div>
            </div>
         </div>
         <section
            className="border-b border-zinc-200/50 dark:border-darkBorder max-tablet:px-3 [clip-path:inset(0px_-10px_-10px_-10px)] 
            shadow-zinc-200/40 dark:shadow-zinc-800/80 shadow-sm relative z-10"
         >
            <div className="mx-auto max-w-[728px] flex items-center border-t py-1.5 border-zinc-100 dark:border-zinc-700/40">
               <Link
                  to="/collections"
                  className="flex items-center gap-2 group pr-3"
               >
                  <Icon
                     name="database"
                     className="hover:text-zinc-500 dark:hover:text-zinc-400 text-zinc-400 dark:text-zinc-500"
                     size={16}
                  />
               </Link>
               <Icon
                  name="slash"
                  size={16}
                  className="text-zinc-200 text-lg -rotate-[20deg] dark:text-zinc-700"
               />
               <Menu as="div" className="relative">
                  {({ open }) => (
                     <Float
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                        placement="bottom-start"
                        portal
                     >
                        <Menu.Button className="flex items-center gap-2 group focus:outline-none hover:bg-zinc-50 hover:dark:bg-dark350 mx-1 pl-2 pr-1.5 py-2 rounded-lg">
                           <span className="font-bold text-1 text-xs">
                              {collection?.name}
                           </span>
                           <span className="w-4 h-4 flex items-center justify-center">
                              <svg
                                 className={`${
                                    open ? "rotate-180" : ""
                                 } transform transition duration-300 fill-zinc-400 dark:fill-zinc-500 ease-in-out w-3.5 h-3.5`}
                                 viewBox="0 0 320 512"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                              </svg>
                           </span>
                        </Menu.Button>

                        <Menu.Items className="absolute left-0 mt-0.5 min-w-[160px] max-w-[240px] z-20 w-full">
                           <div className="overflow-hidden p-1.5 space-y-0.5 rounded-lg bg-white dark:bg-dark350 border border-color-sub shadow-1 shadow">
                              {site?.collections?.map((row) => (
                                 <Menu.Item key={row.slug}>
                                    <NavLink
                                       end
                                       className={({ isActive }) =>
                                          clsx(
                                             isActive
                                                ? "bg-zinc-100 dark:bg-dark450"
                                                : "hover:bg-zinc-50 dark:hover:bg-dark400",
                                             "flex items-center p-1 rounded-md gap-1.5",
                                          )
                                       }
                                       to={`/c/${row.slug}`}
                                    >
                                       <span className="flex-none flex h-5 w-5 items-center">
                                          {row.icon?.url ? (
                                             <Image
                                                url={row.icon?.url}
                                                options="aspect_ratio=1:1&height=80&width=80"
                                                alt="Collection Icon"
                                             />
                                          ) : (
                                             <Icon
                                                name="component"
                                                className="text-1 mx-auto"
                                                size={18}
                                             />
                                          )}
                                       </span>
                                       <span className="text-xs font-semibold text-1 flex-none">
                                          {row.name}
                                       </span>
                                    </NavLink>
                                 </Menu.Item>
                              ))}
                           </div>
                        </Menu.Items>
                     </Float>
                  )}
               </Menu>
               <Icon
                  name="slash"
                  size={16}
                  className="text-zinc-200 text-lg -rotate-[20deg] dark:text-zinc-700"
               />
               <Link
                  to={`/c/${collection?.slug}`}
                  className={clsx(
                     !entryName ? "underline" : "",
                     "pl-4 pr-3 font-bold text-1 text-xs flex items-center gap-2 hover:underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2",
                  )}
               >
                  List
               </Link>
               {isEntry ? (
                  <>
                     <Icon
                        name="chevron-right"
                        title="Entry"
                        className="text-1"
                        size={12}
                     />
                     <span className="font-bold pl-3 text-1 underline text-xs flex items-center gap-2 decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2">
                        Entry
                     </span>
                  </>
               ) : (
                  <></>
               )}
            </div>
         </section>
         <span
            className="pattern-dots absolute left-0 top-0 -z-0 h-full
                  w-full pattern-bg-white pattern-zinc-700 pattern-opacity-10 
                  pattern-size-1 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
         />
         <span
            className="bg-gradient-to-b dark:from-bg3Dark/90 dark:to-bg3Dark/60 
            from-white/90 to-white/60
             w-full h-full absolute top-0 left-0 z-0"
         />
      </div>
   );
}

import { useState } from "react";

import { useMatches, Link } from "@remix-run/react";
import clsx from "clsx";

import { Avatar } from "~/components/Avatar";
import { Badge, BadgeButton } from "~/components/Badge";
import { Button } from "~/components/Button";
import {
   Dropdown,
   DropdownButton,
   DropdownItem,
   DropdownMenu,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import type { Section } from "./List";
import { AddSection } from "../$collectionId_.$entryId/components/AddSection";
import { CollectionEdit } from "../$collectionId_.$entryId/components/CollectionEdit";
import { EntryEdit } from "../$collectionId_.$entryId/components/EntryEdit";
import { SectionCommandBar } from "../$collectionId_.$entryId/components/SectionCommandBar";
import { SectionList } from "../$collectionId_.$entryId/components/SectionList";
import type { EntryType } from "../$collectionId_.$entryId/utils/_entryTypes";

export function CollectionHeader({
   collection,
   setIsChanged,
   isChanged,
   setAllSections,
   allSections,
}: {
   collection: Collection;
   setAllSections: (sections: any) => void;
   isChanged: boolean;
   setIsChanged: (value: boolean) => void;
   allSections: Section[] | undefined | null;
}) {
   const { site } = useSiteLoaderData();

   const { entry } = (useMatches()?.[2]?.data as {
      entry: EntryType | null;
   }) ?? {
      entry: null,
   };

   const entryName = entry?.name;

   const collectionName = collection?.name;

   const isEntry = entry?.name && entry?.id;

   const [isSectionsOpen, setSectionsOpen] = useState<boolean>(false);

   return (
      <div className="bg-gradient-to-t from-white to-zinc-100 dark:from-dark350 dark:to-bg3Dark relative">
         <div className="laptop:pt-0 z-20 relative">
            <div className="flex items-center w-full py-2.5 border-b border-color dark:border-zinc-700/70 bg-white dark:bg-bg3Dark">
               <div className="max-tablet:px-3 tablet:mx-auto w-full tablet:max-w-[728px] tablet:w-[728px] flex items-center justify-between">
                  <Link
                     to="/collections"
                     className="flex items-center hover:underline decoration-zinc-300 dark:decoration-zinc-600 
                  underline-offset-2  group gap-2.5 group"
                  >
                     <div
                        className="bg-zinc-50 group-hover:bg-zinc-100 dark:bg-dark450 group-hover:dark:bg-dark500 dark:shadow-zinc-800/50
               w-6 h-6 rounded-full flex items-center justify-center shadow-sm shadow-1 border border-color dark:border-transparent"
                     >
                        <Icon name="arrow-left" size={13} />
                     </div>
                     <div className="font-bold text-sm text-1">Collections</div>
                  </Link>
                  <AdminOrStaffOrOwner>
                     <div className="flex items-center justify-between gap-3">
                        <Button
                           color="zinc"
                           className="h-8"
                           onClick={() => setSectionsOpen(!isSectionsOpen)}
                        >
                           Sections
                           <Icon
                              name="chevron-down"
                              className={clsx(
                                 isSectionsOpen ? "rotate-180" : "",
                                 "transform transition duration-300 ease-in-out",
                              )}
                              size={16}
                           />
                        </Button>
                        {entry ? (
                           <>
                              {collection?.customDatabase ? (
                                 <>
                                    <EntryEdit entry={entry} />
                                    <span className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-600 rounded" />

                                    <Button
                                       className="size-8 !p-0"
                                       color="violet"
                                       target="_blank"
                                       href={`/admin/collections/${collection.slug}/${entry.id}`}
                                       onMouseOver={(e: any) => {
                                          e.target.port = 4000;
                                       }}
                                    >
                                       <Icon
                                          title="Edit"
                                          name="database"
                                          size={16}
                                       />
                                    </Button>
                                 </>
                              ) : (
                                 <EntryEdit entry={entry} />
                              )}
                           </>
                        ) : (
                           <CollectionEdit collection={collection} />
                        )}
                     </div>
                  </AdminOrStaffOrOwner>
               </div>
            </div>
            <AdminOrStaffOrOwner>
               <div className="mx-auto tablet:w-[728px]">
                  {isSectionsOpen && (
                     <>
                        <AddSection
                           collection={collection}
                           setAllSections={setAllSections}
                        />
                        <SectionList
                           setIsChanged={setIsChanged}
                           setAllSections={setAllSections}
                           allSections={allSections}
                           collection={collection}
                        />
                     </>
                  )}
                  <SectionCommandBar
                     collection={collection}
                     allSections={allSections}
                     setAllSections={setAllSections}
                     isChanged={isChanged}
                     setIsChanged={setIsChanged}
                  />
               </div>
            </AdminOrStaffOrOwner>
            <div className="flex items-center max-tablet:px-3 justify-between gap-4 pt-4 mx-auto max-w-[728px] laptop:w-[728px] relative">
               <h1 className="font-bold font-header text-2xl tablet:text-3xl pb-3 max-tablet:pr-14">
                  {entryName ?? collectionName}
               </h1>
               <div className="absolute right-3 laptop:right-0 top-7">
                  <Avatar
                     src={isEntry ? entry?.icon?.url : collection?.icon?.url}
                     className="size-16 bg-3"
                     initials={
                        entry?.icon?.url || collection?.icon?.url
                           ? undefined
                           : isEntry
                             ? entryName?.charAt(0)
                             : collectionName?.charAt(0)
                     }
                     options="aspect_ratio=1:1&height=128&width=128"
                  />
               </div>
            </div>
         </div>
         <section className="border-b border-zinc-200/50 dark:border-darkBorder shadow-sm max-tablet:px-3 pb-1 [clip-path:inset(0px_-10px_-10px_-10px)] relative z-10">
            <div
               className="mx-auto max-w-[728px] flex items-center border-t max-tablet:mr-5
             py-2.5 border-zinc-200/50 dark:border-zinc-700/40 overflow-auto"
            >
               <Dropdown>
                  <DropdownButton
                     plain
                     className="dark:bg-dark450 bg-zinc-200/50 !p-0 !pr-2 !rounded-full"
                  >
                     <Avatar
                        src={collection?.icon?.url}
                        className="size-6 dark:!bg-zinc-800/30"
                        initials={
                           collection?.icon?.url
                              ? undefined
                              : collectionName?.charAt(0)
                        }
                        options="aspect_ratio=1:1&height=80&width=80"
                     />
                     <Icon
                        name="chevron-down"
                        title="Options"
                        className="text-1"
                        size={14}
                     />
                  </DropdownButton>
                  <DropdownMenu className="z-30" anchor="bottom start">
                     {site?.collections?.map((row) => (
                        <DropdownItem
                           className="gap-2 !px-1.5"
                           key={row.slug}
                           href={`/c/${row.slug}`}
                        >
                           <Avatar
                              src={row?.icon?.url}
                              className="size-6"
                              initials={
                                 row?.icon?.url
                                    ? undefined
                                    : row.name?.charAt(0)
                              }
                              options="aspect_ratio=1:1&height=80&width=80"
                           />
                           {row.name}
                        </DropdownItem>
                     ))}
                  </DropdownMenu>
               </Dropdown>
               <Icon name="chevron-right" className="text-1 mx-3" size={14} />
               <BadgeButton href={`/c/${collection?.slug}`} color="blue">
                  List
               </BadgeButton>
               {isEntry ? (
                  <>
                     <Icon
                        name="chevron-right"
                        className="text-1 mx-3"
                        size={14}
                     />
                     <Badge color="indigo">Entry</Badge>
                  </>
               ) : (
                  <></>
               )}
            </div>
         </section>
         <span
            className="pattern-dots absolute left-0 top-0 -z-0 h-full
                  w-full pattern-bg-white pattern-zinc-800 pattern-opacity-10 
                  pattern-size-1 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
         />
         <span
            className="bg-gradient-to-b dark:from-dark350 dark:to-bg3Dark/60 
            from-white/80 to-white/60
             w-full h-full absolute top-0 left-0 z-0"
         />
      </div>
   );
}

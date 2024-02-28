import { useState } from "react";

import { useLocation, useMatches, Link } from "@remix-run/react";
import clsx from "clsx";

import { Avatar } from "~/components/Avatar";
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

import { CollectionImageUploader } from "./CollectionImageUploader";
import type { Section } from "./List";
import { AddSection } from "../$collectionId_.$entryId/components/AddSection";
import { CollectionEdit } from "../$collectionId_.$entryId/components/CollectionEdit";
import { EntryEdit } from "../$collectionId_.$entryId/components/EntryEdit";
import { SectionCommandBar } from "../$collectionId_.$entryId/components/SectionCommandBar";
import { SectionList } from "../$collectionId_.$entryId/components/SectionList";
import type { EntryType } from "../$collectionId_.$entryId/utils/_entryTypes";

export function CollectionHeader({
   setIsChanged,
   isChanged,
   setAllSections,
   allSections,
}: {
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

   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[2];

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionSlug,
   ) as Collection;

   const entryName = entry?.name;

   const isEntry = entry?.name && entry?.id;

   const icon = isEntry
      ? entry?.icon && entry?.icon
      : collection?.icon && collection?.icon;

   const intent = isEntry ? "entry" : "collection";

   const entityId = isEntry ? entry?.id : collection?.id;

   const actionPath = isEntry
      ? `/c/${collection?.slug}/${entry?.id}`
      : "/collections";
   const [isSectionsOpen, setSectionsOpen] = useState<boolean>(false);

   return (
      <div className="bg-gradient-to-t from-white to-zinc-100 dark:from-dark350 dark:to-bg3Dark relative">
         <div className="pt-[61px] laptop:pt-0 z-20 relative">
            <div className="flex items-center w-full py-2.5 mb-4 border-b border-color dark:border-zinc-700/40 bg-zinc-50 dark:bg-dark350">
               <div className="max-tablet:px-3 tablet:mx-auto w-full tablet:max-w-[728px] tablet:w-[728px] flex items-center justify-between">
                  <Link
                     to="/collections"
                     className="flex items-center hover:underline decoration-zinc-300 dark:decoration-zinc-600 
                  underline-offset-2  group gap-2.5 group"
                  >
                     <div
                        className="bg-white group-hover:bg-zinc-50 dark:bg-dark450 group-hover:dark:bg-dark500 dark:shadow-zinc-800/50
               w-6 h-6 rounded-full flex items-center justify-center shadow-sm shadow-1 border border-color dark:border-transparent"
                     >
                        <Icon name="arrow-left" size={13} />
                     </div>
                     <div className="font-bold font-header">Collections</div>
                  </Link>
                  <AdminOrStaffOrOwner>
                     <div className="flex items-center justify-between gap-3">
                        <Button
                           color="zinc"
                           className="max-tablet:!py-1.5"
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
                           <EntryEdit entry={entry} />
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
            <div className="flex items-center max-tablet:px-3  justify-between gap-4 tablet:pt-2 tablet:pb-1 mx-auto max-w-[728px] laptop:w-[728px]">
               <h1 className="font-bold font-header text-3xl">
                  {entryName ?? collection?.name}
               </h1>
               <div
                  className="flex-none group relative tablet:-mr-1 border border-color-sub
                  shadow-1 shadow-sm bg-white dark:bg-dark350 -mb-3 tablet:-mb-5 flex 
                  size-16 rounded-full overflow-hidden items-center"
               >
                  <CollectionImageUploader
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
            <div
               className="mx-auto max-w-[728px] flex items-center border-t max-tablet:mr-5
             py-3 border-zinc-200/50 dark:border-zinc-700/40 overflow-auto"
            >
               <Dropdown>
                  <DropdownButton
                     plain
                     className="dark:bg-dark450 bg-zinc-200/50 !p-0.5 !pr-2 !rounded-full"
                  >
                     <Avatar
                        src={collection?.icon?.url}
                        className="size-6 !bg-white dark:!bg-zinc-800/30"
                        initials={collection?.name.charAt(0)}
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
                              initials={row?.name.charAt(0)}
                              options="aspect_ratio=1:1&height=80&width=80"
                           />
                           {row.name}
                        </DropdownItem>
                     ))}
                  </DropdownMenu>
               </Dropdown>
               <Icon
                  name="arrow-right"
                  title="Entry"
                  className="text-1 mx-3.5"
                  size={14}
               />
               <Link
                  to={`/c/${collection?.slug}`}
                  className={clsx(
                     isEntry
                        ? "text-1 hover:text-light dark:hover:text-dark"
                        : "",
                     `text-xs flex items-center gap-2 bg-zinc-200/50
                  dark:bg-dark450 rounded-md dark:text-dark100 font-header
                 px-2.5 py-1 hover:bg-zinc-200 dark:hover:bg-dark500`,
                  )}
               >
                  List
               </Link>
               {isEntry ? (
                  <>
                     <Icon
                        name="chevron-right"
                        title="Entry"
                        className="text-1 mx-3.5"
                        size={16}
                     />
                     <div
                        className="text-xs flex items-center gap-2 bg-zinc-200/50
                     dark:bg-dark450 rounded-full px-3 py-1 font-header"
                     >
                        Entry
                     </div>
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

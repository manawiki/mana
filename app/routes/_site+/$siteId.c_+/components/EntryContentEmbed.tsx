import { Fragment } from "react";

import { offset } from "@floating-ui/react";
import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import {
   useFetcher,
   useLocation,
   useMatches,
   useParams,
} from "@remix-run/react";
import { lazily } from "react-lazily";

import { Tooltip, TooltipContent, TooltipTrigger } from "~/components";
import { H2 } from "~/components/Headers";
import { Icon } from "~/components/Icon";
import type { Site } from "~/db/payload-types";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/src/functions";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { initialValue } from "~/routes/_editor+/core/utils";

import type { Section } from "./Sections";

// we'll lazy load the editor and viewer to make sure they get tree-shaken when not used
//@ts-ignore
const { ManaEditor } = lazily(() => import("~/routes/_editor+/editor.tsx"));

export function EntryContentEmbed({
   section,
   title,
   sectionId,
}: {
   section?: Section;
   title?: string | undefined;
   sectionId?: string;
}) {
   const fetcher = useFetcher();

   //Site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   //Get path for custom site
   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[3];
   const collectionId = useParams()?.collectionId ?? collectionSlug;

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   );

   //Entry data should live in $collectionId_$entryId, this may be potentially brittle if we shift site architecture around
   const { entry } = useMatches()?.[2]?.data as any;

   //Filter out content based on sectionId
   const data = entry?.embeddedContent?.find(
      (item: any) => item?.sectionId === sectionId,
   );

   const hasContent = data?.content && data?.content[0].children[0].text != "";
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   return (
      <>
         {hasAccess ? (
            <Float
               middleware={[
                  offset({
                     mainAxis: 50,
                     crossAxis: 0,
                  }),
               ]}
               zIndex={20}
               placement="right-start"
               show
            >
               <main className="mx-auto max-w-[728px] laptop:w-[728px] group hover:border-color border-transparent border-y border-dashed relative">
                  <Popover className="group-hover:block absolute right-0 bottom-1 hidden">
                     {({ open }) => (
                        <>
                           <Float
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                              placement="top-end"
                              offset={4}
                           >
                              <Popover.Button
                                 className="flex relative items-center gap-2"
                                 as="div"
                              >
                                 <div className="text-[10px] text-1">
                                    {title}
                                 </div>
                                 <Tooltip placement="left">
                                    <TooltipTrigger
                                       className="transition w-7 h-7 duration-100 flex items-center justify-center 
                                       rounded-full z-20 hover:dark:bg-dark400 hover:bg-zinc-100 active:translate-y-0.5"
                                    >
                                       {open ? (
                                          <Icon
                                             name="x"
                                             className="text-1"
                                             size={14}
                                          />
                                       ) : (
                                          <Icon
                                             name="more-horizontal"
                                             size={16}
                                          />
                                       )}
                                    </TooltipTrigger>
                                    <TooltipContent>Settings</TooltipContent>
                                 </Tooltip>
                              </Popover.Button>
                              <Popover.Panel className="border-color-sub bg-3-sub w-32 shadow-1 p-1 transform rounded-lg border shadow-sm"></Popover.Panel>
                           </Float>
                        </>
                     )}
                  </Popover>
                  {title && !section?.showTitle && <H2 text={title} />}
                  <ManaEditor
                     key={data?.id}
                     collectionSlug="contentEmbeds"
                     sectionId={sectionId}
                     siteId={entry?.siteId}
                     fetcher={fetcher}
                     entryId={entry?.id}
                     pageId={data?.id}
                     collectionEntity={collection?.id}
                     defaultValue={data?.content ?? initialValue()}
                  />
               </main>
               <div>
                  <EditorCommandBar
                     collectionSlug="contentEmbeds"
                     collectionId={collection?.slug}
                     siteId={site?.slug}
                     entryId={entry?.id}
                     pageId={data?.id}
                     fetcher={fetcher}
                     isChanged={data?.isChanged}
                  />
               </div>
            </Float>
         ) : (
            <>
               {hasContent && (
                  <>
                     {title && !section?.showTitle && <H2 text={title} />}
                     <EditorView data={data?.content} />
                  </>
               )}
            </>
         )}
      </>
   );
}

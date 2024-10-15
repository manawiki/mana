import { useEffect, type ReactNode } from "react";

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { gql, request as gqlRequest } from "graphql-request";
import type { PaginatedDocs } from "payload/dist/database/types";
import qs from "qs";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import type { Collection, Entry } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { gqlFormat } from "~/utils/to-words";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

import type { CustomElement, LinkElement } from "../../core/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

import { Listbox, ListboxOption, ListboxLabel } from "~/components/Listbox";
import { Input } from "~/components/Input";
import clsx from "clsx";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { linkUrl } = zx.parseQuery(request, {
      linkUrl: z.string(),
   });

   try {
      let url = new URL(linkUrl);

      const pathSection = url.pathname.split("/");
      const subdomain = url.host.split(".")[0];
      let domain = url.hostname.split(".").slice(-2).join(".");

      const slug = await payload.find({
         collection: "sites",
         where: {
            ...(domain === "mana.wiki"
               ? {
                    slug: {
                       equals: subdomain,
                    },
                 }
               : {
                    domain: {
                       equals: `${subdomain}.${domain}`,
                    },
                 }),
         },
         depth: 1,
         overrideAccess: false,
         user,
      });

      const site = slug?.docs[0];

      switch (pathSection[1]) {
         case "c": {
            //List
            if (pathSection[2] && pathSection[3] == null) {
               try {
                  const collectionData = await payload.find({
                     collection: "collections",
                     where: {
                        site: {
                           equals: site?.id,
                        },
                        slug: {
                           equals: pathSection[2],
                        },
                     },
                     depth: 1,
                     overrideAccess: false,
                     user,
                  });

                  const collection = collectionData?.docs[0];

                  if (collection == undefined) return null;

                  return {
                     name: collection?.name,
                     icon: {
                        url: collection?.icon?.url,
                     },
                  };
               } catch (err: unknown) {
                  payload.logger.error(`${err}`);
               }
            }

            //Entry
            if (pathSection[3]) {
               try {
                  const entryId = pathSection[3];
                  const collectionId = pathSection[2];

                  const collection = site?.collections?.find(
                     (collection) => collection.slug === collectionId,
                  ) as Collection;

                  if (collection?.customDatabase === true) {
                     const label = gqlFormat(collectionId ?? "", "list");

                     //Document request if slug does exist
                     const entryQuery = gql`
                        query ($entryId: String!) {
                           entryData: ${label}(
                                 where: { OR: [{ slug: { equals: $entryId } }, { id: { equals: $entryId } }] }
                              ) {
                              docs {
                                 name
                                 icon {
                                    url
                                 }
                              }
                           }
                        }
                  `;

                     //Fetch to see if slug exists
                     //@ts-ignore
                     const { entryData }: { entryData: PaginatedDocs<Entry> } =
                        await gqlRequest(
                           url.origin + ":4000/api/graphql",
                           entryQuery,
                           {
                              entryId,
                           },
                        );

                     return json(entryData?.docs[0]);
                  }
                  //If not custom site, fetch local api entries collection
                  const coreEntryData = await payload.find({
                     collection: "entries",
                     where: {
                        "site.slug": {
                           equals: site?.slug,
                        },
                        "collectionEntity.slug": {
                           equals: collectionId,
                        },
                        or: [
                           {
                              slug: {
                                 equals: entryId,
                              },
                           },
                           {
                              id: {
                                 equals: entryId,
                              },
                           },
                        ],
                     },
                     depth: 1,
                     user,
                     overrideAccess: false,
                  });

                  const entryData = coreEntryData?.docs[0];

                  const entry = {
                     name: entryData?.name,
                     icon: {
                        url: entryData?.icon?.url,
                     },
                  };

                  return entry;
               } catch (err: unknown) {
                  payload.logger.error(`${err}`);
               }
            }
         }
         // Posts version (future)
         // case "posts": {
         //    if (pathSection[3]) {
         //       const postId = pathSection[3];
         //       const doc = await payload.findByID({
         //          collection: "posts",
         //          id: postId,
         //          depth: 1,
         //          overrideAccess: false,
         //          user,
         //       });
         //       const filtered = select({ name: true, banner: true }, doc);
         //       return filtered;
         //    }
         //    return;
         // }

         //Otherwise, return site
         default:
            // Determine if the path is a custom page
            try {
               const customPageData = await payload.find({
                  collection: "customPages",
                  where: {
                     site: {
                        equals: site?.id,
                     },
                     slug: {
                        equals: pathSection[1],
                     },
                  },
                  depth: 1,
                  overrideAccess: false,
                  user,
               });

               const customPage = customPageData?.docs[0];

               if (customPage == undefined)
                  return {
                     message: "ok",
                  };

               return {
                  name: customPage?.name,
                  icon: {
                     //@ts-ignore
                     url: customPage?.icon?.url,
                  },
               };
            } catch (err: unknown) {
               payload.logger.error(`${err}`);
            }
            return {
               message: "ok",
            };
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
      return {
         error: "Error fetching link data",
      };
   }
}

type Props = {
   element: LinkElement;
   children: ReactNode;
};

type Fields = {
   name: string;
   icon: {
      url: string;
   };
};

export function BlockLink({ element, children }: Props) {
   const canFetch = element?.icon == undefined;

   const linkDataQuery = qs.stringify(
      {
         linkUrl: element?.url,
      },
      { addQueryPrefix: true },
   );

   const editor = useSlate();

   const fetcher = useFetcher({ key: linkDataQuery });

   const data = fetcher.data as Fields | undefined;

   useEffect(() => {
      // we'll use fetcher to fetch the link icon if it's not already fetched
      if (canFetch && data == undefined && fetcher.state === "idle") {
         fetcher.load("/blocks/link" + linkDataQuery);
      }

      // Once we have the data, Slate will update the element
      if (canFetch && data && data.name && data.icon?.url) {
         const path = ReactEditor.findPath(editor, element);

         const newProperties: Partial<CustomElement> = {
            view: "icon-inline",
            removeCircleBorder: false,
            hideLinkText: false,
            ...data,
         };

         Transforms.setNodes<CustomElement>(editor, newProperties, {
            at: path,
         });
         //We update the child text
         Transforms.insertText(editor, data.name, {
            at: path,
         });
         //Move cursor out of the "link" so they can continue typing
         Transforms.move(editor, { unit: "offset" });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- Slate elements aren't stable
   }, [canFetch, fetcher, linkDataQuery]);

   if (element.icon) {
      return (
         <div
            className="group/link relative inline-flex items-baseline gap-1 whitespace-nowrap
          text-blue-600 visited:text-purple-600 dark:text-blue-500"
         >
            <LinkPopover element={element} children={children} />
            <LinkBlockElement element={element} children={children} />
         </div>
      );
   }

   return (
      <a
         rel="nofollow"
         className="inline-flex text-blue-600 visited:text-purple-600 hover:underline dark:text-blue-500"
         href={element.url}
      >
         {children}
      </a>
   );
}

function LinkPopover({ element, children }: Props) {
   const editor = useSlate();
   const view = element.view;

   const path = ReactEditor.findPath(editor, element);

   const { pathname } = new URL(element?.url as string);

   return (
      <Popover className="absolute -left-1 -top-1 z-20 transition-opacity opacity-0 duration-200 ease-out group-hover/link:opacity-100">
         {({ open }) => (
            <>
               <PopoverButton
                  className="rounded-full !size-4 !p-0 shadow-lg shadow-1 
               flex items-center justify-center bg-zinc-800 dark:bg-zinc-200 hover:bg-zinc-200 
             dark:hover:bg-black  focus:outline-none"
               >
                  <Icon
                     title={open ? "Close" : "Options"}
                     name={open ? "x" : "more-horizontal"}
                     className="text-zinc-100 dark:text-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200"
                     size={14}
                  />
               </PopoverButton>
               <PopoverPanel
                  anchor="top"
                  transition
                  className="flex items-center origin-top transition duration-200 ease-out rounded-xl dark:border-zinc-600 gap-2
               data-[closed]:scale-95 data-[closed]:opacity-0 p-2 bg-3-sub border border-zinc-200 z-50 shadow-lg"
               >
                  <div className="flex items-center gap-2">
                     <Listbox
                        onChange={(value) => {
                           return Transforms.setNodes<CustomElement>(
                              editor,
                              { view: value },
                              { at: path },
                           );
                        }}
                        defaultValue={element.view}
                     >
                        <ListboxOption value="icon-inline">
                           <ListboxLabel>Inline</ListboxLabel>
                        </ListboxOption>
                        <ListboxOption value="icon-block">
                           <ListboxLabel>Block</ListboxLabel>
                        </ListboxOption>
                     </Listbox>
                     {view == "icon-block" ? (
                        <div>
                           <Input
                              placeholder="Width"
                              type="number"
                              className="!w-16"
                              min={10}
                              max={728}
                              value={element.iconWidth}
                              onChange={(e) => {
                                 Transforms.setNodes(
                                    editor,
                                    {
                                       iconWidth: parseInt(e.target.value),
                                    },
                                    { at: path },
                                 );
                              }}
                              defaultValue={element.iconWidth}
                           />
                        </div>
                     ) : null}
                  </div>
                  <Tooltip>
                     <TooltipTrigger
                        onClick={() => {
                           return Transforms.setNodes(
                              editor,
                              {
                                 removeCircleBorder:
                                    !element.removeCircleBorder,
                              },
                              {
                                 at: path,
                              },
                           );
                        }}
                        className="size-9 rounded-lg flex items-center justify-center dark:border-zinc-500/50
                     border border-zinc-200 bg-zinc-100 dark:bg-dark500 relative"
                     >
                        <span className="size-4 rounded-full block bg-zinc-300 dark:bg-zinc-500" />
                        {element.removeCircleBorder ? null : (
                           <div
                              className="size-3 absolute flex items-center justify-center 
                  -top-1 -right-1 rounded-lg bg-green-500"
                           ></div>
                        )}
                     </TooltipTrigger>
                     <TooltipContent>
                        {element.removeCircleBorder
                           ? "Disable Circle"
                           : "Enable Circle"}
                     </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger
                        onClick={() => {
                           return Transforms.setNodes(
                              editor,
                              {
                                 hideLinkText: !element.hideLinkText,
                              },
                              {
                                 at: path,
                              },
                           );
                        }}
                        className="size-9 rounded-lg flex items-center justify-center dark:border-zinc-500/50
                     border border-zinc-200 bg-zinc-100 dark:bg-dark500 relative"
                     >
                        <Icon name="type" size={14} />
                        {!element.hideLinkText ? null : (
                           <div
                              className="size-3 absolute flex items-center justify-center 
                  -top-1 -right-1 rounded-lg bg-green-500"
                           ></div>
                        )}
                     </TooltipTrigger>
                     <TooltipContent>
                        {element.hideLinkText ? "Hide Text" : "Show Text"}
                     </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger
                        onClick={() => {
                           return Transforms.setNodes(
                              editor,
                              {
                                 enableTooltip: !element.enableTooltip,
                              },
                              {
                                 at: path,
                              },
                           );
                        }}
                        className="size-9 rounded-lg flex items-center justify-center dark:border-zinc-500/50
                     border border-zinc-200 bg-zinc-100 dark:bg-dark500 relative"
                     >
                        <Icon name="info" size={14} />
                        {!element.enableTooltip ? null : (
                           <div
                              className="size-3 absolute flex items-center justify-center 
                              -top-1 -right-1 rounded-lg bg-green-500"
                           ></div>
                        )}
                     </TooltipTrigger>
                     <TooltipContent>
                        {element.enableTooltip
                           ? "Disable Tooltip"
                           : "Enable Tooltip"}
                     </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger
                        asChild
                        className="size-9 rounded-lg flex items-center justify-center dark:border-zinc-500/50
                     border border-zinc-200 bg-zinc-100 dark:bg-dark500 relative"
                     >
                        <Link to={pathname}>
                           <Icon name="link" size={14} />
                        </Link>
                     </TooltipTrigger>
                     <TooltipContent>Go to page </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger
                        onClick={() => {
                           return Transforms.removeNodes(editor, {
                              at: path,
                           });
                        }}
                        className="size-9 rounded-lg flex items-center justify-center dark:border-zinc-500/50
                     border border-zinc-200 bg-zinc-100 dark:bg-dark500 relative"
                     >
                        <Icon
                           name="trash"
                           className="text-red-500 dark:text-red-400"
                           size={14}
                        />
                     </TooltipTrigger>
                     <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
               </PopoverPanel>
            </>
         )}
      </Popover>
   );
}

export function LinkBlockElement({ element, children }: Props) {
   const view = element.view;

   return view === "icon-inline" ? (
      <>
         {element.enableTooltip ? (
            <Tooltip>
               <TooltipTrigger className="inline-flex items-baseline gap-1">
                  <>
                     <span
                        className={clsx(
                           `border-color-sub shadow-1 flex items-center justify-center
                              self-center  bg-2-sub border shadow-sm`,
                           !element.removeCircleBorder
                              ? "size-6 rounded-full overflow-hidden"
                              : "w-6",
                        )}
                     >
                        {element?.icon?.url ? (
                           <Image
                              className={clsx(
                                 "contain",
                                 !element.removeCircleBorder
                                    ? "rounded-full overflow-hidden size-6"
                                    : "w-6",
                              )}
                              width={!element.removeCircleBorder ? 60 : 120}
                              height={
                                 !element.removeCircleBorder ? 60 : undefined
                              }
                              url={element.icon.url}
                              alt={element?.name}
                           />
                        ) : (
                           <Icon
                              name="component"
                              className="text-1 mx-auto"
                              size={12}
                           />
                        )}
                     </span>
                     {!element.hideLinkText ? (
                        <span className="group-hoverx/link:underline">
                           {children}
                        </span>
                     ) : undefined}
                  </>
               </TooltipTrigger>
               <TooltipContent className="!p-0 z-50">
                  <Image url={element.icon.url} alt={element?.name} />
               </TooltipContent>
            </Tooltip>
         ) : (
            <>
               <span
                  className={clsx(
                     `border-color-sub shadow-1 flex items-center justify-center
                         self-center overflow-hidden bg-2-sub border shadow-sm`,
                     !element.removeCircleBorder
                        ? "size-6 rounded-full"
                        : "w-6",
                  )}
               >
                  {element?.icon?.url ? (
                     <Image
                        className={clsx(
                           "contain",
                           !element.removeCircleBorder
                              ? "rounded-full overflow-hidden size-6"
                              : "w-6",
                        )}
                        width={!element.removeCircleBorder ? 60 : 120}
                        height={!element.removeCircleBorder ? 60 : undefined}
                        url={element.icon.url}
                        alt={element?.name}
                     />
                  ) : (
                     <Icon name="component" className="text-1" size={12} />
                  )}
               </span>
               {!element.hideLinkText ? (
                  <span className="group-hover/link:underline">{children}</span>
               ) : undefined}
            </>
         )}
      </>
   ) : view === "icon-block" ? (
      <>
         {element.enableTooltip ? (
            <Tooltip>
               <TooltipTrigger>
                  <div className="flex items-center justify-center flex-col gap-1">
                     {!element.removeCircleBorder ? (
                        <Image
                           className="border border-color-sub rounded-full object-contain overflow-hidden"
                           style={{
                              ...(!element.removeCircleBorder
                                 ? {
                                      width: element.iconWidth,
                                      height: element.iconWidth,
                                   }
                                 : undefined),
                           }}
                           width={
                              element.iconWidth
                                 ? element.iconWidth * 2
                                 : undefined
                           }
                           height={
                              element.iconWidth
                                 ? element.iconWidth * 2
                                 : undefined
                           }
                           url={element.icon.url}
                           alt={children ? "" : element?.name}
                        />
                     ) : (
                        <Image
                           className="object-contain"
                           width={
                              element.iconWidth
                                 ? element.iconWidth * 2
                                 : undefined
                           }
                           style={{
                              width: element.iconWidth,
                           }}
                           url={element.icon.url}
                           alt={element?.name}
                        />
                     )}
                     {!element.hideLinkText ? null : (
                        <div className="group-hover/link:underline">
                           {children}
                        </div>
                     )}
                  </div>
               </TooltipTrigger>
               <TooltipContent className="!p-0 z-50">
                  <Image url={element.icon.url} alt={element?.name} />
               </TooltipContent>
            </Tooltip>
         ) : (
            <div className="flex items-center justify-center flex-col gap-1">
               {!element.removeCircleBorder ? (
                  <Image
                     className="border border-color-sub rounded-full object-contain overflow-hidden"
                     style={{
                        width: element.iconWidth,
                        height: element.iconWidth,
                     }}
                     width={
                        element.iconWidth ? element.iconWidth * 2 : undefined
                     }
                     height={
                        element.iconWidth ? element.iconWidth * 2 : undefined
                     }
                     url={element.icon.url}
                     alt={children ? "" : element?.name}
                  />
               ) : (
                  <Image
                     className="object-contain"
                     width={
                        element.iconWidth ? element.iconWidth * 2 : undefined
                     }
                     style={{
                        width: element.iconWidth,
                     }}
                     url={element.icon.url}
                     alt={element?.name}
                  />
               )}
               {!element.hideLinkText ? undefined : (
                  <div className="group-hover/link:underline">{children}</div>
               )}
            </div>
         )}
      </>
   ) : null;
}

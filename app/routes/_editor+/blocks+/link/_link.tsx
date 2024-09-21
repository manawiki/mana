import { useEffect, type ReactNode } from "react";

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
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

import type { CustomElement, LinkElement } from "../../core/types";

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
         <span
            className="group/link relative inline-flex items-baseline gap-1 whitespace-nowrap
          text-blue-600 visited:text-purple-600 dark:text-blue-500"
         >
            <button
               className="shadow-1 absolute right-0 top-1 z-20 flex h-4 w-4 items-center justify-center rounded-full
               bg-red-500 opacity-0 shadow hover:bg-zinc-500 group-hover/link:opacity-100"
               onClick={() => {
                  const path = ReactEditor.findPath(editor, element);
                  return Transforms.removeNodes(editor, { at: path });
               }}
            >
               <Icon name="trash" className="h-3 w-3 text-white" />
            </button>
            <span
               className="border-color-sub shadow-1 flex h-6 w-6 items-center justify-center
               self-center overflow-hidden bg-2-sub rounded-full border shadow-sm"
            >
               {element?.icon?.url ? (
                  <Image
                     width={30}
                     height={30}
                     url={element.icon.url}
                     alt={children ? "" : element?.name}
                     options="aspect_ratio=1:1&height=40&width=40"
                  />
               ) : (
                  <Icon name="component" className="text-1 mx-auto" size={12} />
               )}
            </span>
            {children}
         </span>
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

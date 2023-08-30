import type { ReactNode } from "react";

import { TrashIcon } from "@heroicons/react/20/solid";
import { Link, useParams } from "@remix-run/react";
import qs from "qs";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import useSWR from "swr";

import customConfig from "~/_custom/config.json";
import { Image } from "~/components";
import { swrRestFetcher } from "~/utils";

import type { CustomElement, LinkElement } from "../../functions/types";

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

export const BlockLink = ({ element, children }: Props) => {
   const { hostname, pathname } = new URL(element.url as string);
   const isSafeLink = ["mana.wiki"].includes(hostname);
   const siteId = useParams()?.siteId ?? customConfig?.siteId;
   const editor = useSlate();

   const linkDataQuery = qs.stringify(
      {
         linkUrl: element.url,
      },
      { addQueryPrefix: true }
   );

   const url = element.url && new URL(element.url).pathname;

   const pathSection = url && url.split("/");

   const canFetch =
      isSafeLink &&
      element.icon == undefined &&
      pathSection &&
      pathSection[2] == "collections" &&
      pathSection[3];

   const { data }: { data: Fields } = useSWR(
      canFetch && `/${siteId}/blocks/link${linkDataQuery}`,
      swrRestFetcher
   );

   // If iconURL property is null and we get data then update
   if (canFetch && data) {
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
   if (isSafeLink && element.icon) {
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
               <TrashIcon className="h-3 w-3 text-white" />
            </button>
            <span
               className="border-color shadow-1 flex h-6 w-6 items-center justify-center
               self-center overflow-hidden rounded-full border shadow-sm"
            >
               <Image
                  width={30}
                  height={30}
                  url={element.icon.url}
                  options="aspect_ratio=1:1&height=40&width=40"
               />
            </span>
            {children}
         </span>
      );
   }
   if (isSafeLink) {
      return (
         <Link
            className="text-blue-600 visited:text-purple-600 hover:underline dark:text-blue-500"
            to={pathname}
         >
            {children}
         </Link>
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
};

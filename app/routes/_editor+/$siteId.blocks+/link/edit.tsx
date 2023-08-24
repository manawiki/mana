import type { ReactNode } from "react";

import { Link, useParams } from "@remix-run/react";
import qs from "qs";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import useSWR from "swr";

import customConfig from "~/_custom/config.json";
import { swrRestFetcher } from "~/utils";

import type { CustomElement, LinkElement } from "../../types";

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

   // If iconURL property is null and we get data, we update
   if (canFetch && data) {
      const path = ReactEditor.findPath(editor, element);

      const newProperties: Partial<CustomElement> = {
         view: "icon-inline",
         ...data,
      };

      Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   if (isSafeLink) {
      return (
         <Link
            className="text-blue-600 visited:text-purple-600 hover:underline"
            to={pathname}
         >
            {children}
         </Link>
      );
   }
   return (
      <a
         rel="nofollow"
         className="text-blue-600 visited:text-purple-600 hover:underline"
         href={element.url}
      >
         {children}
      </a>
   );
};

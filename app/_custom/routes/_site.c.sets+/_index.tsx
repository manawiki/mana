import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";

import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import { Card } from "~/db/payload-custom-types";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { List } from "~/routes/_site+/c_+/_components/List";

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const list = await fetchList({
      params,
      request,
      payload,
      user,
      gql: {
         query: SETS,
      },
   });
   return json({ list });
}

export default function ListPage() {
   return (
      <List
         columnViewability={{}}
         gridView={gridView}
         columns={columns}
         //@ts-ignore
         filters={filters}
      />
   );
}

const columnHelper = createColumnHelper<Card>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         prefetch="intent"
         to={`/c/sets/${info.row.original.slug}`}
      >
         <div
            className="truncate text-xs font-semibold text-center pt-1
               group-hover:underline decoration-zinc-400 underline-offset-2"
         >
            {info.getValue()}
         </div>
      </Link>
   ),
});

const columns = [
   columnHelper.accessor("name", {
      header: "Card",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               prefetch="intent"
               to={`/c/sets/${info.row.original.slug}`}
               className="flex items-center gap-3 group py-0.5"
            >
               {info.getValue()}
               {/* {info.row.original.image?.url ? (
                  <Image
                     className="w-9 object-contain"
                     width={100}
                     url={info.row.original.image?.url}
                  />
               ) : (
                  <div className="w-9 h-12 dark:bg-dark500 bg-zinc-300 rounded" />
               )} */}
            </Link>
         );
      },
   }),
];

const SETS = gql`
   query {
      listData: Sets(limit: 5000) {
         totalDocs
         docs {
            id
            name
            slug
         }
      }
   }
`;

const filters: {
   id: string;
   label: string;
   cols?: 1 | 2 | 3 | 4 | 5;
   options: { label?: string; value: string; icon?: string }[];
}[] = [];

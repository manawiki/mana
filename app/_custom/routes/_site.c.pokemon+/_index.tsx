import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { gql } from "graphql-request";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { List } from "~/routes/_site+/c_+/_components/List";

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { list } = await fetchList({
      params,
      request,
      payload,
      user,
      gql: {
         query: POKEMON,
      },
   });

   return json({ entries: list?.data?.allPokemon });
}

function Cell({ entry }: { entry: any }) {
   return (
      <Link
         to={entry.slug ?? entry.id}
         className="bg-2-sub border border-color-sub rounded-lg gap-2 p-2 flex flex-col items-center justify-center shadow-sm shadow-1"
      >
         {entry.icon?.url ? (
            <Image
               width={50}
               height={50}
               url={entry.icon?.url}
               options="aspect_ratio=1:1&height=80&width=80"
               className="mx-auto"
               alt={entry.name ?? "Entry Icon"}
            />
         ) : (
            <Icon name="component" className="text-1 mx-auto" size={18} />
         )}
         <div className="text-xs font-semibold text-center">{entry.name}</div>
      </Link>
   );
}

export default function ListPage() {
   return (
      <List
         CellComponent={Cell}
         cellContainerClass="grid grid-cols-2 tablet:grid-cols-4 gap-3"
      />
   );
}

const POKEMON = gql`
   query ($page: Int) {
      allPokemon(limit: 100, sort: "number", page: $page) {
         pagingCounter
         totalDocs
         totalPages
         limit
         hasNextPage
         hasPrevPage
         nextPage
         prevPage
         docs {
            id
            name
            slug
            icon {
               url
            }
         }
      }
   }
`;

{
   /* <Link
to={entry.slug ?? entry.id}
className="flex items-center justify-center flex-col gap-2.5 border border-color-sub shadow-sm shadow-1 bg-2-sub rounded-lg p-3 dark:hover:border-zinc-600/80 relative"
>
<div className="relative">
   <Avatar
      src={entry.icon?.url}
      initials={entry.icon?.url ? undefined : entry.name.charAt(0)}
      className="size-14"
      options="aspect_ratio=1:1&height=120&width=120"
   />
   <div className="absolute -bottom-2 flex items-center justify-center gap-1 w-14">
      {entry.types.map((row: any) => (
         <Image
            key={row.name}
            url={row.icon?.url}
            width={16}
            height={16}
            options="aspect_ratio=1:1&height=40&width=40"
            className="size-4"
         />
      ))}
   </div> 
</div>
<div className="text-xs text-center font-bold">{entry.name}</div>
</Link> */
}

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
         query: MOVES,
      },
   });
   return json({ list });
}

export default function ListPage() {
   //@ts-ignore
   return <List gridView={gridView} columns={columns} filters={filters} />;
}

const columnHelper = createColumnHelper<Card>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         prefetch="intent"
         to={`/c/moves/${info.row.original.slug}`}
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
               to={`/c/moves/${info.row.original.slug}`}
               className="flex items-center gap-3 group py-0.5"
            >
               {/* <Image
                  width={36}
                  height={36}
                  url={info.row.original.icon?.url}
                  options="aspect_ratio=1:1&height=80&width=80"
               /> */}
               <span
                  className="space-y-0.5 font-semibold group-hover:underline 
                decoration-zinc-400 underline-offset-2 truncate"
               >
                  <div className="truncate">{info.getValue()}</div>
               </span>
            </Link>
         );
      },
   }),
];

const MOVES = gql`
   query {
      listData: Moves(limit: 5000) {
         totalDocs
         docs {
            id
            name
            slug
         }
      }
   }
`;

const filters = [
   {
      id: "type",
      label: "Type",
      cols: 3,
      options: [
         {
            label: "Bug",
            value: "bug",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Bug.svg",
         },
         {
            label: "Dark",
            value: "dark",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dark.svg",
         },
         {
            label: "Dragon",
            value: "dragon",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dragon.svg",
         },
         {
            label: "Electric",
            value: "electric",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Electric.svg",
         },
         {
            label: "Fairy",
            value: "fairy",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fairy.svg",
         },
         {
            label: "Fighting",
            value: "fighting",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fighting.svg",
         },
         {
            label: "Fire",
            value: "fire",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fire.svg",
         },
         {
            label: "Flying",
            value: "flying",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Flying.svg",
         },
         {
            label: "Ghost",
            value: "ghost",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ghost.svg",
         },
         {
            label: "Grass",
            value: "grass",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Grass.svg",
         },
         {
            label: "Ground",
            value: "ground",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ground.svg",
         },
         {
            label: "Ice",
            value: "ice",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ice.svg",
         },
         {
            label: "Normal",
            value: "normal",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Normal.svg",
         },
         {
            label: "Poison",
            value: "poison",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Poison.svg",
         },
         {
            label: "Psychic",
            value: "psychic",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Psychic.svg",
         },
         {
            label: "Rock",
            value: "rock",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Rock.svg",
         },
         {
            label: "Steel",
            value: "steel",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Steel.svg",
         },
         {
            label: "Water",
            value: "water",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Water.svg",
         },
      ],
   },
];

import type { LoaderFunctionArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";

import { Badge } from "~/components/Badge";
import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import type { Pokemon } from "~/db/payload-custom-types";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { List } from "~/routes/_site+/c_+/_components/List";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";

import { RatingsLabel } from "./components/RatingsLabel";

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const list = fetchList({
      params,
      request,
      payload,
      user,
      gql: {
         query: POKEMON,
      },
   });
   return defer({ list });
}

export default function ListPage() {
   return (
      <List
         viewType="list"
         gridView={gridView}
         columns={columns}
         columnViewability={{ type: false, generation: false }}
         filters={filters}
      />
   );
}

const columnHelper = createColumnHelper<Pokemon>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         prefetch="intent"
         to={`/c/pokemon/${info.row.original.slug}`}
      >
         <div className="flex items-center gap-0.5 absolute top-0 left-0">
            {info.row.original.type?.map((type) => (
               <Tooltip key={type.name} placement="top">
                  <TooltipTrigger>
                     <Image
                        height={14}
                        width={14}
                        url={type?.icon?.url}
                        options="height=40&width=40"
                        alt={type?.name}
                     />
                  </TooltipTrigger>
                  <TooltipContent>{type?.name}</TooltipContent>
               </Tooltip>
            ))}
         </div>
         <Image
            width={36}
            height={36}
            url={info.row.original.icon?.url}
            className="mx-auto"
            options="aspect_ratio=1:1&height=80&width=80"
         />
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
      header: "Pokemon",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               prefetch="intent"
               to={`/c/pokemon/${info.row.original.slug}`}
               className="flex items-center gap-3 group py-0.5"
            >
               <Image
                  width={36}
                  height={36}
                  url={info.row.original.icon?.url}
                  options="aspect_ratio=1:1&height=80&width=80"
               />
               <span
                  className="space-y-0.5 font-semibold group-hover:underline 
                decoration-zinc-400 underline-offset-2 truncate"
               >
                  <div className="truncate">{info.getValue()}</div>
                  <div className="flex items-center gap-0.5">
                     {info.row.original.type?.map((type) => (
                        <Tooltip key={type.name} placement="top">
                           <TooltipTrigger>
                              <Image
                                 height={14}
                                 width={14}
                                 url={type?.icon?.url}
                                 options="height=40&width=40"
                                 alt={type?.name}
                              />
                           </TooltipTrigger>
                           <TooltipContent>{type?.name}</TooltipContent>
                        </Tooltip>
                     ))}
                  </div>
               </span>
            </Link>
         );
      },
   }),
   columnHelper.accessor("type", {
      filterFn: (row, columnId, filterValue) => {
         const existingFilter =
            filterValue && filterValue.length > 0
               ? row?.original?.type?.every((type: any) =>
                    filterValue.includes(type.slug),
                 )
               : true;

         return existingFilter ?? true;
      },
   }),
   columnHelper.accessor("generation", {
      filterFn: (row, columnId, filterValue) => {
         const existingFilter =
            filterValue && filterValue.length > 0
               ? filterValue.includes(row?.original?.generation)
               : true;
         return existingFilter;
      },
   }),
   columnHelper.accessor("level50CP", {
      header: "Lvl 50 CP",
      cell: (info) =>
         info.getValue() ? (
            <div className="tabular-nums">
               {info.getValue()?.toLocaleString()}
            </div>
         ) : (
            "-"
         ),
   }),
   columnHelper.accessor("ratings.greatLeagueRating", {
      header: () => (
         <>
            <Tooltip placement="top">
               <TooltipTrigger>GL</TooltipTrigger>
               <TooltipContent>Great League Rating</TooltipContent>
            </Tooltip>
         </>
      ),
      cell: (info) =>
         info.getValue() ? (
            <Badge color="blue">
               <RatingsLabel
                  fieldName="greatLeagueRating"
                  value={info.getValue()}
               />
            </Badge>
         ) : (
            "-"
         ),
   }),
   columnHelper.accessor("ratings.ultraLeagueRating", {
      header: () => (
         <>
            <Tooltip placement="top">
               <TooltipTrigger>UL</TooltipTrigger>
               <TooltipContent>Ultra League Rating</TooltipContent>
            </Tooltip>
         </>
      ),
      cell: (info) =>
         info.getValue() ? (
            <Badge color="yellow">
               <RatingsLabel
                  fieldName="ultraLeagueRating"
                  value={info.getValue()}
               />
            </Badge>
         ) : (
            "-"
         ),
   }),
   columnHelper.accessor("ratings.masterLeagueRating", {
      header: () => (
         <>
            <Tooltip placement="top">
               <TooltipTrigger>ML</TooltipTrigger>
               <TooltipContent>Master League Rating</TooltipContent>
            </Tooltip>
         </>
      ),
      cell: (info) =>
         info.getValue() ? (
            <Badge color="purple">
               <RatingsLabel
                  fieldName="masterLeagueRating"
                  value={info.getValue()}
               />
            </Badge>
         ) : (
            "-"
         ),
   }),
   columnHelper.accessor("ratings.attackerRating", {
      header: () => (
         <>
            <Tooltip placement="top">
               <TooltipTrigger>Tier</TooltipTrigger>
               <TooltipContent>Attackers Tier Rating</TooltipContent>
            </Tooltip>
         </>
      ),
      cell: (info) =>
         info.getValue() ? (
            <Badge color="green">
               <RatingsLabel
                  fieldName="attackerRating"
                  value={info.getValue()}
               />
            </Badge>
         ) : (
            "-"
         ),
   }),
];

const POKEMON = gql`
   query {
      listData: allPokemon(limit: 5000, sort: "number") {
         totalDocs
         docs {
            id
            name
            number
            slug
            generation
            level50CP
            icon {
               url
            }
            type {
               slug
               name
               icon {
                  url
               }
            }
            ratings {
               greatLeagueRating
               ultraLeagueRating
               masterLeagueRating
               attackerRating
            }
         }
      }
   }
`;

const filters = [
   {
      id: "generation",
      label: "Generation",
      cols: 5,
      options: [
         { label: "1", value: "_1" },
         { label: "2", value: "_2" },
         { label: "3", value: "_3" },
         { label: "4", value: "_4" },
         { label: "5", value: "_5" },
         { label: "6", value: "_6" },
         { label: "7", value: "_7" },
         { label: "8", value: "_8" },
         { label: "9", value: "_9" },
      ],
   },
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

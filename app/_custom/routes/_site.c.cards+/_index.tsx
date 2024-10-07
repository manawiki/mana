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
         query: CARDS,
      },
   });
   return json({ list });
}

export default function ListPage() {
   return (
      <List
         columnViewability={{
            pokemonType: false,
            isEX: false,
            cardType: false,
         }}
         gridView={gridView}
         defaultViewType="grid"
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
         to={`/c/cards/${info.row.original.slug}`}
      >
         <Image
            className="object-contain"
            width={400}
            url={
               info.row.original.image?.url ??
               "https://static.mana.wiki/tcgwiki-pokemonpocket/Card_Back.png"
            }
         />
         <div className="flex items-center gap-2 justify-between pt-2">
            <div className="text-sm font-semibold">{info.getValue()}</div>
            {info.row.original.pokemonType?.icon?.url ? (
               <Image
                  className="size-4 object-contain"
                  width={40}
                  height={40}
                  url={info.row.original.pokemonType?.icon?.url}
               />
            ) : undefined}
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
               to={`/c/cards/${info.row.original.slug}`}
               className="flex items-center gap-3 group py-0.5"
            >
               {info.row.original.image?.url ? (
                  <Image
                     className="w-9 object-contain"
                     width={100}
                     url={info.row.original.image?.url}
                  />
               ) : (
                  <div className="w-9 h-12 dark:bg-dark500 bg-zinc-300 rounded" />
               )}
               <span
                  className="space-y-1.5 font-semibold group-hover:underline 
                decoration-zinc-400 underline-offset-2 truncate"
               >
                  <div className="truncate">{info.getValue()}</div>
                  {info.row.original.pokemonType?.icon?.url ? (
                     <Image
                        className="size-4 object-contain"
                        width={40}
                        height={40}
                        url={info.row.original.pokemonType?.icon?.url}
                     />
                  ) : undefined}
               </span>
            </Link>
         );
      },
   }),
   columnHelper.accessor("pokemonType", {
      header: "Type",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.pokemonType?.name);
      },
   }),
   columnHelper.accessor("rarity", {
      header: "Rarity",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.rarity?.name);
      },
      cell: (info) => {
         return info.getValue()?.icon?.url ? (
            <Image
               className="h-6"
               height={40}
               url={info.getValue()?.icon?.url}
            />
         ) : (
            "-"
         );
      },
   }),
   columnHelper.accessor("weaknessType", {
      header: "Weakness",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.weaknessType?.name);
      },
      cell: (info) => {
         return info.getValue()?.icon?.url ? (
            <Image
               className="size-4"
               width={40}
               height={40}
               url={info.getValue()?.icon?.url}
            />
         ) : (
            "-"
         );
      },
   }),

   columnHelper.accessor("retreatCost", {
      header: "Retreat",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.retreatCost);
      },
      cell: (info) => {
         return info.getValue() ? info.getValue() : "-";
      },
   }),
   columnHelper.accessor("isEX", {
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.isEX?.toString());
      },
   }),
   columnHelper.accessor("cardType", {
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.cardType?.toString());
      },
   }),
   columnHelper.accessor("hp", {
      header: "HP",
      cell: (info) => {
         return info.getValue() ? info.getValue() : "-";
      },
   }),
];

const CARDS = gql`
   query {
      listData: Cards(limit: 5000, sort: "-rarity") {
         totalDocs
         docs {
            id
            name
            slug
            isEX
            retreatCost
            hp
            cardType
            pokemonType {
               name
               icon {
                  url
               }
            }
            weaknessType {
               name
               icon {
                  url
               }
            }
            rarity {
               name
               icon {
                  url
               }
            }
            image {
               url
            }
         }
      }
   }
`;

const filters: {
   id: string;
   label: string;
   cols?: 1 | 2 | 3 | 4 | 5;
   options: { label?: string; value: string; icon?: string }[];
}[] = [
   {
      id: "cardType",
      label: "Card Type",
      cols: 2,
      options: [
         {
            label: "Pokémon",
            value: "pokemon",
         },
         {
            label: "Trainer",
            value: "trainer",
         },
      ],
   },
   {
      id: "isEX",
      label: "Is EX Pokémon?",
      options: [
         {
            label: "EX Pokémon",
            value: "true",
         },
      ],
   },
   {
      id: "rarity",
      label: "Rarity",
      cols: 3,
      options: [
         {
            value: "UR",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/UR-rarity.png",
         },
         {
            value: "IM",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/IM-rarity.png",
         },
         {
            value: "SAR",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/SRSAR-Rarity.png",
         },
         {
            value: "SR",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/SRSAR-Rarity.png",
         },
         {
            value: "AR",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/AR-rarity.png",
         },
         {
            value: "RR",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/RR-rarity.png",
         },
         {
            value: "R",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/R-rarity.png",
         },
         {
            value: "U",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/U-rarity.png",
         },
         {
            value: "C",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/c-rarity.png",
         },
      ],
   },
   {
      id: "pokemonType",
      label: "Pokémon Type",
      cols: 3,
      options: [
         {
            label: "Colorless",
            value: "Colorless",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Colorless.png",
         },
         {
            label: "Metal",
            value: "Metal",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Metal.png",
         },
         {
            label: "Darkness",
            value: "Darkness",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Darkness.png",
         },
         {
            label: "Dragon",
            value: "Dragon",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Dragon.png",
         },
         {
            label: "Fighting",
            value: "Fighting",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Fighting.png",
         },
         {
            label: "Fire",
            value: "Fire",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Fire.png",
         },
         {
            label: "Grass",
            value: "Grass",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Grass.png",
         },
         {
            label: "Lightning",
            value: "Lightning",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Lightning.png",
         },
         {
            label: "Psychic",
            value: "Psychic",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Psychic.png",
         },

         {
            label: "Water",
            value: "Water",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Water.png",
         },
      ],
   },
   {
      id: "weaknessType",
      label: "Pokémon Weakness",
      cols: 3,
      options: [
         {
            label: "Colorless",
            value: "Colorless",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Colorless.png",
         },
         {
            label: "Metal",
            value: "Metal",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Metal.png",
         },
         {
            label: "Darkness",
            value: "Darkness",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Darkness.png",
         },
         {
            label: "Dragon",
            value: "Dragon",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Dragon.png",
         },
         {
            label: "Fighting",
            value: "Fighting",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Fighting.png",
         },
         {
            label: "Fire",
            value: "Fire",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Fire.png",
         },
         {
            label: "Grass",
            value: "Grass",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Grass.png",
         },
         {
            label: "Lightning",
            value: "Lightning",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Lightning.png",
         },
         {
            label: "Psychic",
            value: "Psychic",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Psychic.png",
         },
         {
            label: "Water",
            value: "Water",
            icon: "https://static.mana.wiki/tcgwiki-pokemonpocket/TypeIcon_Water.png",
         },
      ],
   },
];

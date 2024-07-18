import { useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { List } from "~/routes/_site+/c_+/_components/List";

import { formatValue } from "~/_custom/utils/valueFormat";
import { calculateStat } from "~/_custom/utils/formulas";

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const list = await fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: CHARACTERS,
      },
   });

   //@ts-ignore
   return json({ wengines: list?.listData?.docs });
}

export default function CharactersList() {
   const { wengines } = useLoaderData<typeof loader>();
   return <CharacterList chars={wengines} />;
}

type FilterTypes = {
   id: string;
   name: string;
   field: string;
};

type FilterOptionType = {
   name: string;
   id: string;
   icon?: string;
};

const CharacterList = ({ chars }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("id");
   const [search, setSearch] = useState("");

   const sortOptions = [
      { name: "ID", field: "id" },
      { name: "Name", field: "name" },
   ];

   // All Filter Options listed individually atm to control order filter options appear in

   const rarities = [
      {
         id: "2",
         //name: "B",
         icon: "https://static.mana.wiki/zzz/ItemRarityIcon_ItemRarityB.png",
      },
      {
         id: "3",
         //name: "A",
         icon: "https://static.mana.wiki/zzz/ItemRarityIcon_ItemRarityA.png",
      },
      {
         id: "4",
         //name: "S",
         icon: "https://static.mana.wiki/zzz/ItemRarityIcon_ItemRarityS.png",
      },
   ] as FilterOptionType[];
   const statsecondary = chars
      .map((c: any) => c.stat_secondary?.stat?.name)
      .flat();
   const secondarystats = [
      {
         id: "HP",
         name: "HP",
      },
      {
         id: "ATK",
         name: "ATK",
      },
      {
         id: "DEF",
         name: "DEF",
      },
      {
         id: "Crit DMG",
         name: "Crit DMG",
      },
      {
         id: "CRIT Rate",
         name: "CRIT Rate",
      },
      {
         id: "PEN Ratio",
         name: "PEN Ratio",
      },
      {
         id: "Impact",
         name: "Impact",
      },
      {
         id: "Attribute Mastery",
         name: "Attribute Mastery",
      },
      {
         id: "Anomaly Rate Bonus",
         name: "Anomaly Rate Bonus",
      },
   ] as FilterOptionType[];

   // const camps = chars.map((c) => {
   //    return c?.camp;
   // }).filter((v,i,a) => a.indexOf(v) === i);

   // sort((a,b) => {
   // return campsort.findIndex((x) => x.id == a) - campsort.findIndex((x) => x.id == b)})

   const filterOptions = [
      {
         name: "Rarity",
         field: "rarity",
         options: rarities,
      },
      {
         name: "Secondary Stat",
         field: "stat_secondary",
         options: secondarystats,
      },
   ];

   // var pathlist = filterUnique(chars.map((c) => c.path));

   // Sort entries
   let csorted = [...chars];
   csorted.sort((a, b) => (a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0));

   // Filter entries
   // Filter out by each active filter option selected, if matches filter then output 0; if sum of all filters is 0 then show entry.
   let cfiltered = csorted.filter((char) => {
      var showEntry = filters
         .map((filt) => {
            var matches = 0;
            if (char[filt.field]?.id) {
               matches = char[filt.field]?.id == filt.id ? 0 : 1;
            } else if (Array.isArray(char[filt.field])) {
               matches =
                  char[filt.field]?.map((v: any) => v.id)?.indexOf(filt.id) > -1
                     ? 0
                     : 1;
            } else {
               matches = char[filt.field] == filt.id ? 0 : 1;
            }
            return matches;
         })
         .reduce((p, a) => p + a, 0);

      return showEntry == 0;
   });

   // Filter search by name
   cfiltered = cfiltered.filter((char) => {
      return char.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
   });

   return (
      <List>
         <div className="divide-color-sub bg-2-sub border-color-sub divide-y rounded-md border shadow-sm shadow-1">
            {filterOptions.map((cat) => {
               return (
                  <div
                     className="cursor-pointer items-center justify-between gap-3 p-3 laptop:flex"
                     key={cat.name}
                  >
                     <div className="flex items-center gap-2.5 text-sm font-bold max-laptop:pb-3">
                        {cat.name}
                     </div>
                     <div className="items-center justify-between gap-3 grid grid-cols-4 laptop:grid-cols-5">
                        {cat.options.map((opt) => {
                           return (
                              <div
                                 key={opt.id}
                                 className={`bg-3 border-color-sub shadow-1 items-center rounded-lg border px-2.5 py-1 shadow-sm ${
                                    filters.find((a) => a.id == opt.id)
                                       ? `bg-slate-200 dark:bg-dark450`
                                       : ``
                                 }`}
                                 onClick={(event) => {
                                    if (filters.find((a) => a.id == opt.id)) {
                                       setFilters(
                                          filters.filter((a) => a.id != opt.id),
                                       );
                                    } else {
                                       setFilters([
                                          // Allows only one filter per category
                                          ...filters.filter(
                                             (a) => a.field != cat.field,
                                          ),
                                          { ...opt, field: cat.field },
                                       ]);
                                    }
                                 }}
                              >
                                 {opt?.icon && (
                                    <div className="shadow-1 border-color mx-auto flex h-7 w-7 rounded-md border bg-zinc-900 bg-opacity-50 shadow-sm">
                                       <Image
                                          width={40}
                                          height={40}
                                          className="mx-auto self-center"
                                          alt="Icon"
                                          options="height=50"
                                          url={opt.icon}
                                       />
                                    </div>
                                 )}
                                 {opt?.name && (
                                    <div className="text-1 truncate pt-0.5 text-center text-[10px] font-semibold">
                                       {opt.name}
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Search Text Box */}
         <div
            className="border-color-sub bg-2-sub shadow-1 mb-2 mt-4 flex h-12 items-center
            justify-between gap-3 rounded-lg border px-3 shadow-sm"
         >
            <Icon name="search" className="text-zinc-500" size={24} />
            <input
               className="h-10 w-full border-0 flex-grow bg-transparent focus:outline-none"
               placeholder="Search..."
               value={search}
               onChange={(event) => {
                  setSearch(event.target.value);
               }}
            />
            <div className="text-1 flex items-center gap-1.5 pr-1 text-sm italic">
               <span>{cfiltered.length}</span> <span>entries</span>
            </div>
         </div>

         {/* Sort Options */}
         <div className="flex items-center justify-between py-3">
            <div className="text-1 flex items-center gap-2 text-sm font-bold">
               <Icon name="sort" size={16} className="text-zinc-500">
                  Sort
               </Icon>
            </div>
            <div className="flex items-center gap-2">
               {sortOptions.map((opt) => {
                  return (
                     <div
                        key={opt.field}
                        className={`border-color text-1 relative cursor-pointer
                        rounded-full border px-4 py-1 text-center text-xs font-bold ${
                           sort == opt.field
                              ? `bg-zinc-50 dark:bg-zinc-500/10`
                              : ``
                        }`}
                        onClick={(event) => {
                           setSort(opt.field);
                        }}
                     >
                        {opt.name}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* List of Characters with applied sorting */}
         <div className="grid grid-cols-1 gap-3 pb-4 text-center laptop:grid-cols-2">
            {cfiltered?.map((char, int) => {
               const raritynum = char?.rarity?.name;
               const rarityurl = char?.rarity?.icon_item?.url;

               const mainname = char?.stat_primary?.stat?.name;
               const mainval = formatValue(
                  char?.stat_primary?.stat,
                  char?.stat_primary?.value,
               );

               const secondname = char?.stat_secondary?.stat?.name;
               const secondval = formatValue(
                  char?.stat_secondary?.stat,
                  char?.stat_secondary?.value /
                     char?.stat_secondary?.stat?.divisor,
               );

               const talentname = char?.talent_title;
               const talentfirst = char?.talent?.[0]?.desc;

               var rarityhex;
               switch (raritynum) {
                  case "B":
                     rarityhex = "#339CDD";
                     break;
                  case "A":
                     rarityhex = "#d06bff";
                     break;
                  case "S":
                     rarityhex = "#ffa114";
                     break;
                  default:
               }
               const cid = char.slug ?? char?.id;
               const iconurl = char.icon?.url;

               return (
                  <Link
                     key={cid}
                     prefetch="intent"
                     to={`/c/w-engines/${cid}`}
                     className="bg-2-sub border-color-sub shadow-1 flex items-baseline justify-center rounded-md border p-2 shadow-sm"
                  >
                     <div className="w-full">
                        {/* Character Icon */}
                        <div className="relative w-full">
                           {/* Rarity */}
                           <div className="border-color shadow-1 absolute right-1 top-0 z-20 h-7 w-7 rounded-full border bg-zinc-800 shadow">
                              <Image
                                 options="aspect_ratio=1:1&height=42&width=42"
                                 alt="Path"
                                 className="object-contain"
                                 url={rarityurl}
                                 loading={int < 10 ? "lazy" : undefined}
                              />
                           </div>

                           <div className="relative flex w-full items-center justify-center">
                              <div className="border-color shadow-1 overflow-hidden rounded-full border-2 shadow-sm">
                                 <Image
                                    width={50}
                                    height={50}
                                    options="aspect_ratio=1:1&height=50&width=50"
                                    url={iconurl}
                                    alt={char?.name}
                                 />
                              </div>
                           </div>
                           {/* Character Name, Color border by rarity */}
                           <div
                              style={{ "border-color": `${rarityhex}` }}
                              className={`p-1 text-center text-xs font-bold border-b-4`}
                           >
                              {char.name}
                           </div>
                        </div>

                        {/* Base Stats + Effect */}
                        <div className="w-full">
                           <div className="my-1 grid grid-cols-2 gap-1 w-full">
                              <div className="inline-flex justify-between rounded-full bg-black px-3 py-1">
                                 <div className="text-white text-sm font-bold">
                                    {mainname}
                                 </div>
                                 <div className="text-white text-sm">
                                    {mainval}
                                 </div>
                              </div>
                              <div className="inline-flex justify-between rounded-full bg-black px-3 py-1">
                                 <div className="text-white text-sm font-bold">
                                    {secondname}
                                 </div>
                                 <div className="text-white text-sm">
                                    {secondval}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="w-full">
                           <div className="my-1 font-bold border-b">
                              {talentname}
                           </div>
                           <div
                              className="dark:brightness-100 brightness-7 text-xs"
                              dangerouslySetInnerHTML={{ __html: talentfirst }}
                           ></div>
                        </div>
                     </div>
                  </Link>
               );
            })}
         </div>
      </List>
   );
};

// function filterUnique(input: any) {
//    let output: any = [];
//    for (let i = 0; i < input.length; i++) {
//       if (!output.find((a) => a.id == input[i].id)) {
//          output.push({
//             id: input[i].id,
//             name: input[i].name,
//             icon: input[i].icon?.url,
//          });
//       }
//    }

//    return output;
// }

const CHARACTERS = gql`
   query {
      listData: WEngines(limit: 0) {
         docs {
            id
            slug
            name
            icon {
               url
            }
            rarity {
               id
               name
               icon_item {
                  url
               }
            }
            specialty {
               name
               icon {
                  url
               }
            }
            stat_primary {
               stat {
                  id
                  name
               }
               value
            }
            stat_secondary {
               stat {
                  id
                  name
                  fmt
                  divisor
               }
               value
            }
            talent_title
            talent {
               level
               desc
            }
         }
      }
   }
`;

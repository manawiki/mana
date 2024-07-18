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

export { listMeta as meta };

export async function loader({
   request,
   params,
   context: { payload, user },
}: LoaderFunctionArgs) {
   const list = await fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: QUERY,
      },
   });

   //@ts-ignore
   return json({ servants: list?.listData?.docs });
}

export default function Servants() {
   const { servants } = useLoaderData<typeof loader>();
   return <ServantList chars={servants} />;
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

const ServantList = ({ chars }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("ID");
   const [sortState, setSortState] = useState(true);
   const [search, setSearch] = useState("");

   const sortOptions = [
      { name: "ID", field: "library_id" },
      { name: "Name", field: "name" },
      { name: "Tier", field: "tier_list_score" },
   ];

   // All Filter Options listed individually atm to control order filter options appear in

   const rarities = [
      {
         id: "3046",
         name: "0★",
      },
      {
         id: "71",
         name: "1★",
      },
      {
         id: "66",
         name: "2★",
      },
      {
         id: "61",
         name: "3★",
      },
      {
         id: "56",
         name: "4★",
      },
      {
         id: "51",
         name: "5★",
      },
   ] as FilterOptionType[];
   const classes = [
      {
         id: "81",
         name: "Saber",
         icon: chars.find((c: any) => c.class?.id == "81")?.class.icon?.url,
      },
      {
         id: "86",
         name: "Archer",
         icon: chars.find((c: any) => c.class?.id == "86")?.class.icon?.url,
      },
      {
         id: "91",
         name: "Lancer",
         icon: chars.find((c: any) => c.class?.id == "91")?.class.icon?.url,
      },
      {
         id: "96",
         name: "Rider",
         icon: chars.find((c: any) => c.class?.id == "96")?.class.icon?.url,
      },
      {
         id: "101",
         name: "Caster",
         icon: chars.find((c: any) => c.class?.id == "101")?.class.icon?.url,
      },
      {
         id: "106",
         name: "Assassin",
         icon: chars.find((c: any) => c.class?.id == "106")?.class.icon?.url,
      },
      {
         id: "111",
         name: "Berserker",
         icon: chars.find((c: any) => c.class?.id == "111")?.class.icon?.url,
      },
      {
         id: "76",
         name: "Shielder",
         icon: chars.find((c: any) => c.class?.id == "76")?.class.icon?.url,
      },
      {
         id: "116",
         name: "Ruler",
         icon: chars.find((c: any) => c.class?.id == "116")?.class.icon?.url,
      },
      {
         id: "126",
         name: "Avenger",
         icon: chars.find((c: any) => c.class?.id == "126")?.class.icon?.url,
      },
      {
         id: "2881",
         name: "Alter Ego",
         icon: chars.find((c: any) => c.class?.id == "2881")?.class.icon?.url,
      },
      {
         id: "3171",
         name: "Moon Cancer",
         icon: chars.find((c: any) => c.class?.id == "3171")?.class.icon?.url,
      },
      {
         id: "3166",
         name: "Foreigner",
         icon: chars.find((c: any) => c.class?.id == "3166")?.class.icon?.url,
      },
      {
         id: "9566",
         name: "Pretender",
         icon: chars.find((c: any) => c.class?.id == "9566")?.class.icon?.url,
      },
      {
         id: "10586",
         name: "Beast",
         icon: chars.find((c: any) => c.class?.id == "10586")?.class.icon?.url,
      },
   ] as FilterOptionType[];
   const servers = [
      {
         id: "1691",
         name: "NA",
      },
      {
         id: "1696",
         name: "JP",
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
         field: "star_rarity",
         options: rarities,
      },
      { name: "Class", field: "class", options: classes },
      {
         name: "Server",
         field: "release_status",
         options: servers,
      },
   ];

   // var pathlist = filterUnique(chars.map((c) => c.path));

   // Sort entries
   let csorted = [...chars];

   if (sortState) {
      csorted.sort((a, b) =>
         a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0,
      );
   } else {
      csorted.sort((a, b) =>
         a[sort] < b[sort] ? 1 : b[sort] < a[sort] ? -1 : 0,
      );
   }

   // Filter entries
   // Filter out by each active filter option selected, if matches filter then output 0; if sum of all filters is 0 then show entry.
   let cfiltered = csorted.filter((char) => {
      var showEntry = filters
         .map((filt) => {
            var matches = 0;
            if (char[filt.field]?.id) {
               matches = char[filt.field]?.id == filt.id ? 0 : 1;
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
                     className="cursor-pointer items-center justify-between gap-1 p-3 laptop:flex"
                     key={cat.name}
                  >
                     <div className="flex items-center gap-2.5 text-sm font-bold max-laptop:pb-3 w-12">
                        {cat.name}
                     </div>
                     <div className="items-center justify-between gap-1 grid max-laptop:grid-cols-4 grid-cols-8 w-full">
                        {cat.options.map((opt) => {
                           return (
                              <div
                                 key={opt.id}
                                 className={`bg-3 border-color-sub shadow-1 items-center rounded-lg border px-2.5 py-1 shadow-sm ${
                                    filters.find((a) => a.id == opt.id)
                                       ? `bg-zinc-200 dark:bg-dark450`
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
                                    <div className="shadow-1 border-color mx-auto flex h-8 w-8 rounded-full border bg-zinc-800 bg-opacity-50 shadow-sm">
                                       <Image
                                          className="mx-auto self-center"
                                          alt="Icon"
                                          options="height=50"
                                          url={opt.icon}
                                       />
                                    </div>
                                 )}
                                 <div className="text-1 truncate pt-0.5 text-center text-[10px] font-semibold">
                                    {opt.name}
                                 </div>
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
                           if (opt.field == sort) {
                              setSortState(!sortState);
                           } else {
                              setSortState(true);
                           }
                        }}
                     >
                        {opt.name}
                        {sort == opt.field ? (sortState ? " ↑" : " ↓") : null}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* List of Characters with applied sorting */}
         <div className="pb-4 text-center divide-y divide-color-sub bg-1-sub border-color-sub shadow-1 rounded-md border shadow-sm">
            {/* Deck Card formatting */}
            <div
               dangerouslySetInnerHTML={{
                  __html: `
                  <style>
                  .q-card {
                     color: white;
                     background-color: green;
                     padding: 2px 5px;
                     text-align: center;
                     border-radius: 2px;
                  }
                  .b-card {
                     color: white;
                     background-color: red;
                     padding: 2px 5px;
                     text-align: center;
                     border-radius: 2px;
                  }
                  .a-card {
                     color: white;
                     background-color: blue;
                     padding: 2px 5px;
                     text-align: center;
                     border-radius: 2px;
                  }
                  </style>
                  `,
               }}
            ></div>

            {cfiltered?.map((char, int) => {
               const cicon = char?.icon?.url;
               const libraryid = char?.library_id;
               const class_small = char?.class?.icon?.url;
               const class_name = char?.class?.name;
               const deck_layout = char?.deck_layout?.description;
               const rarity_url = char?.star_rarity?.icon?.url;
               const rarity_num = char?.star_rarity?.name;
               const cid = char.slug ?? char?.id;
               const tier_value = char.tier_list_score?.toString();
               var tier_score = "";
               switch (tier_value) {
                  case "101":
                     tier_score = "EX+";
                     break;
                  case "100":
                     tier_score = "EX";
                     break;
                  case "99":
                     tier_score = "EX-";
                     break;
                  case "91":
                     tier_score = "A+";
                     break;
                  case "90":
                     tier_score = "A";
                     break;
                  case "81":
                     tier_score = "B+";
                     break;
                  case "80":
                     tier_score = "B";
                     break;
                  case "71":
                     tier_score = "C+";
                     break;
                  case "70":
                     tier_score = "C";
                     break;
                  case "61":
                     tier_score = "D+";
                     break;
                  case "60":
                     tier_score = "D";
                     break;
                  case "50":
                     tier_score = "E";
                     break;
                  default:
               }

               return (
                  <Link
                     key={cid}
                     prefetch="intent"
                     to={`/c/servants/${cid}`}
                     className="grid grid-cols-12 items-center justify-center py-2"
                  >
                     {/* Character Icon */}
                     <div className="w-full text-xs">{libraryid}</div>

                     <div className="shadow-1 overflow-hidden shadow-sm w-fit">
                        <Image
                           width={50}
                           height={54}
                           options="height=80&width=80"
                           url={cicon}
                           alt={char?.name}
                        />
                     </div>

                     {/* Character Name */}
                     <div className="col-span-8 justify-self-start self-start ml-1">
                        <div className="text-left ">
                           <div className="text-sm text-blue-500 inline-block mr-1 ">
                              {char.name}
                           </div>
                           <div className="text-xs inline-block ">
                              {class_name}
                           </div>
                        </div>
                        <div className="mb-1 text-left">
                           <div
                              className="text-xs"
                              dangerouslySetInnerHTML={{
                                 __html: deck_layout,
                              }}
                           ></div>
                        </div>
                     </div>

                     {/* Rarity */}
                     <div className="flex items-center">
                        <div className="text-sm inline-flex">{rarity_num}</div>
                        <div className="inline-flex ml-0.5">
                           <div className="shadow-1 overflow-hidden shadow-sm">
                              <Image
                                 width={13}
                                 height={13}
                                 options="height=80&width=80"
                                 url={rarity_url}
                                 alt={"★"}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Tier */}
                     <div className="flex items-center">
                        <div className="">{tier_score}</div>
                     </div>
                  </Link>
               );
            })}
         </div>
      </List>
   );
};

// Add stats under atk_lv120 later.
const QUERY = gql`
   query {
      listData: Servants(
         limit: 2000
         sort: "library_id"
         where: {
            library_id: { not_equals: null }
            name: { not_equals: "Mash (Ortinax)" }
         }
      ) {
         docs {
            id
            name
            library_id
            cost
            hp_base
            hp_max
            atk_base
            atk_max
            star_generation_rate
            star_absorption
            instant_death_chance
            np_charge_per_hit
            np_charge_when_attacked
            class {
               id
               name
               icon {
                  url
               }
            }
            release_status {
               id
               name
            }
            attribute {
               id
               name
            }
            deck_layout {
               name
               description
            }
            alignment {
               id
               name
            }
            icon {
               url
            }
            star_rarity {
               id
               name
               icon {
                  url
               }
            }
            summon_availability {
               name
               description
            }
            jp_release_date
            np_release_date
            slug
            tier_list_score
         }
      }
   }
`;

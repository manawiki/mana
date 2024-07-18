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

   console.log(list);

   return json({ characters: list?.listData?.docs });
}

export default function CharactersList() {
   const { characters } = useLoaderData<typeof loader>();
   return <CharacterList chars={characters} />;
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
      // {
      //   id: "2",
      //   //name: "B",
      //   icon: "https://static.mana.wiki/zzz/IconRoleBBig.png",
      // },
      {
         id: "3",
         //name: "A",
         icon: "https://static.mana.wiki/zzz/RarityIcon_IconRoleABig.png",
      },
      {
         id: "4",
         //name: "S",
         icon: "https://static.mana.wiki/zzz/RarityIcon_IconRoleSBig.png",
      },
   ] as FilterOptionType[];
   const elementries = chars.map((c: any) => c.damage_element).flat();
   const elements = [
      {
         id: "200",
         name: "Physical",
         icon: elementries.find((c: any) => c.id == "200")?.icon?.url,
      },
      {
         id: "201",
         name: "Fire",
         icon: elementries.find((c: any) => c.id == "201")?.icon?.url,
      },
      {
         id: "202",
         name: "Ice",
         icon: elementries.find((c: any) => c.id == "202")?.icon?.url,
      },
      {
         id: "203",
         name: "Electric",
         icon: elementries.find((c: any) => c.id == "203")?.icon?.url,
      },
      // {
      //   id: "204",
      //   name: "Wind",
      //   icon: elementries.find((c: any) => c.id == "204")?.icon?.url,
      // },
      {
         id: "205",
         name: "Ether",
         icon: elementries.find((c: any) => c.id == "205")?.icon?.url,
      },
   ] as FilterOptionType[];
   const typeentries = chars.map((c: any) => c.damage_type).flat();
   const types = [
      {
         id: "101",
         name: "Slash",
         icon: typeentries.find((c: any) => c.id == "101")?.icon?.url,
      },
      {
         id: "102",
         name: "Strike",
         icon: typeentries.find((c: any) => c.id == "102")?.icon?.url,
      },
      {
         id: "103",
         name: "Pierce",
         icon: typeentries.find((c: any) => c.id == "103")?.icon?.url,
      },
   ] as FilterOptionType[];
   const camps = [
      {
         id: "1",
         name: "Cunning Hares",
         icon: chars.find((c: any) => c.character_camp?.id == "1")
            ?.character_camp.icon?.url,
      },
      {
         id: "2",
         name: "Victoria Housekeeping Co.",
         icon: chars.find((c: any) => c.character_camp?.id == "2")
            ?.character_camp.icon?.url,
      },
      {
         id: "3",
         name: "Belobog Heavy Ind.",
         icon: chars.find((c: any) => c.character_camp?.id == "3")
            ?.character_camp.icon?.url,
      },
      {
         id: "5",
         name: "Obol Squad",
         icon: chars.find((c: any) => c.character_camp?.id == "5")
            ?.character_camp.icon?.url,
      },
      {
         id: "6",
         name: "Hollow Spec. Ops. S6",
         icon: chars.find((c: any) => c.character_camp?.id == "6")
            ?.character_camp.icon?.url,
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
         name: "Element",
         field: "damage_element",
         options: elements,
      },
      { name: "Type", field: "damage_type", options: types },
      {
         name: "Faction",
         field: "character_camp",
         options: camps,
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
                     <div className="items-center justify-between gap-3 max-laptop:grid max-laptop:grid-cols-4 laptop:flex">
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
         <div className="grid grid-cols-3 gap-3 pb-4 text-center laptop:grid-cols-5">
            {cfiltered?.map((char, int) => {
               const elemurl = char?.damage_element[0]?.icon?.url;
               const typesmall = char?.damage_type[0]?.icon?.url;
               const campurl = char?.character_camp?.icon?.url;
               const raritynum = char?.rarity?.name;
               var rarityhex;
               switch (raritynum) {
                  case "A":
                     rarityhex = "#d06bff";
                     break;
                  case "S":
                     rarityhex = "#ffa114";
                     break;
                  default:
               }
               const rarityurl = char?.rarity?.icon?.url;
               const cid = char.slug ?? char?.id;
               const iconurl =
                  char.icon_round?.id == "IconRoleCircle01" &&
                  char?.id != "1011"
                     ? "https://static.mana.wiki/zzz/IconRoleCircle_Generic_Unknown.png"
                     : char.icon_round?.url;

               return (
                  <Link
                     key={cid}
                     prefetch="intent"
                     to={`/c/agents/${cid}`}
                     className="bg-2-sub border-color-sub shadow-1 flex items-center justify-center rounded-md border p-2 shadow-sm"
                  >
                     {/* Character Icon */}
                     <div className="relative w-full">
                        {/* Camp */}
                        <div
                           className="border-color shadow-1 absolute left-1 bottom-5 z-20 flex
                        h-7 w-7 items-center justify-center rounded-full border bg-zinc-800 shadow"
                        >
                           <Image
                              options="aspect_ratio=1:1&height=42&width=42"
                              alt="Name"
                              url={campurl}
                              className="object-contain"
                           />
                           {/* layout="fill" objectFit="contain" /> */}
                        </div>

                        {/* Type */}
                        <div className="border-color shadow-1 absolute left-1 -top-2 z-20 h-7 w-7 rounded-full border bg-zinc-800 shadow">
                           <Image
                              options="aspect_ratio=1:1&height=42&width=42"
                              alt="Path"
                              className="object-contain"
                              url={typesmall}
                              loading={int < 10 ? "lazy" : undefined}
                           />
                        </div>

                        {/* Element */}
                        <div className="border-color shadow-1 absolute right-1 -top-2 z-20 h-7 w-7 rounded-full border bg-zinc-800 shadow">
                           <Image
                              options="aspect_ratio=1:1&height=42&width=42"
                              alt="Path"
                              className="object-contain"
                              url={elemurl}
                              loading={int < 10 ? "lazy" : undefined}
                           />
                        </div>

                        {/* Rarity */}
                        <div className="border-color shadow-1 absolute right-1 bottom-5 z-20 h-7 w-7 rounded-full border bg-zinc-800 shadow">
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
                                 width={96}
                                 height={96}
                                 options="aspect_ratio=1:1&height=96&width=96"
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
      listData: Agents(
         limit: 100
         sort: "name"
         where: { name: { not_equals: null } }
      ) {
         docs {
            id
            name
            name_code
            slug
            icon_round {
               id
               url
            }
            rarity {
               id
               name
               icon {
                  url
               }
            }
            damage_type {
               id
               name
               icon {
                  url
               }
            }
            damage_element {
               id
               name
               icon {
                  url
               }
            }
            character_camp {
               id
               name
               icon {
                  url
               }
            }
         }
      }
   }
`;

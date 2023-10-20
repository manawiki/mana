import { useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";
import { Search, SortDesc } from "lucide-react";

import { Image } from "~/components";
import { List } from "~/routes/_site+/$siteId.c_+/components/List";
import {
   customListMeta,
   fetchList,
} from "~/routes/_site+/$siteId.c_+/functions/list";

export { customListMeta as meta };

export async function loader({ params }: LoaderFunctionArgs) {
   const { list } = await fetchList({
      params,
      gql: {
         query: CHARACTERS,
      },
   });

   //@ts-ignore
   return json({ characters: list?.data?.Characters?.docs });
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
   const [sort, setSort] = useState("name");
   const [search, setSearch] = useState("");

   const sortOptions = [
      { name: "ID", field: "id" },
      { name: "Name", field: "name" },
   ];

   // All Filter Options listed individually atm to control order filter options appear in

   const rarities = [
      {
         id: "VeryRare",
         name: "4",
      },
      {
         id: "SuperRare",
         name: "5",
      },
   ] as FilterOptionType[];
   const paths = [
      {
         id: "Warlock",
         name: "Nihility",
         icon: chars.find((c: any) => c.path?.id == "Warlock")?.path.icon?.url,
      },
      {
         id: "Mage",
         name: "Erudition",
         icon: chars.find((c: any) => c.path?.id == "Mage")?.path.icon?.url,
      },
      {
         id: "Priest",
         name: "Abundance",
         icon: chars.find((c: any) => c.path?.id == "Priest")?.path.icon?.url,
      },
      {
         id: "Knight",
         name: "Preservation",
         icon: chars.find((c: any) => c.path?.id == "Knight")?.path.icon?.url,
      },
      {
         id: "Rogue",
         name: "Hunt",
         icon: chars.find((c: any) => c.path?.id == "Rogue")?.path.icon?.url,
      },
      {
         id: "Shaman",
         name: "Harmony",
         icon: chars.find((c: any) => c.path?.id == "Shaman")?.path.icon?.url,
      },
      {
         id: "Warrior",
         name: "Destruction",
         icon: chars.find((c: any) => c.path?.id == "Warrior")?.path.icon?.url,
      },
   ] as FilterOptionType[];
   const elements = [
      {
         id: "Physical",
         name: "Physical",
         icon: chars.find((c: any) => c.element?.id == "Physical")?.element.icon
            ?.url,
      },
      {
         id: "Ice",
         name: "Ice",
         icon: chars.find((c: any) => c.element?.id == "Ice")?.element.icon
            ?.url,
      },
      {
         id: "Thunder",
         name: "Lightning",
         icon: chars.find((c: any) => c.element?.id == "Thunder")?.element.icon
            ?.url,
      },
      {
         id: "Fire",
         name: "Fire",
         icon: chars.find((c: any) => c.element?.id == "Fire")?.element.icon
            ?.url,
      },

      {
         id: "Wind",
         name: "Wind",
         icon: chars.find((c: any) => c.element?.id == "Wind")?.element.icon
            ?.url,
      },
      {
         id: "Quantum",
         name: "Quantum",
         icon: chars.find((c: any) => c.element?.id == "Quantum")?.element.icon
            ?.url,
      },
      {
         id: "Imaginary",
         name: "Imaginary",
         icon: chars.find((c: any) => c.element?.id == "Imaginary")?.element
            .icon?.url,
      },
   ] as FilterOptionType[];
   const campsort = [
      {
         id: "Astral Express",
         name: "Astral Express",
      },
      {
         id: "Herta Space Station",
         name: "Herta Station",
      },
      {
         id: "Belobog",
         name: "Belobog",
      },
      {
         id: "Xianzhou: The Luofu",
         name: "Xianzhou: The Luofu",
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
      { name: "Path", field: "path", options: paths },
      {
         name: "Element",
         field: "element",
         options: elements,
      },
      {
         name: "Group",
         field: "camp",
         options: campsort,
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
                                       ? `bg-zinc-50 dark:bg-dark450`
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
                                    <div className="shadow-1 border-color mx-auto flex h-7 w-7 rounded-full border bg-zinc-800 bg-opacity-50 shadow-sm">
                                       <Image
                                          width={30}
                                          height={30}
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
            <Search className="text-zinc-500" size={24} />
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
               <SortDesc size={16} className="text-zinc-500" />
               Sort
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
               const elemurl = char?.element?.icon?.url;
               const pathsmall = char?.path?.icon?.url;
               const rarityurl = char?.rarity?.icon?.url;
               const raritynum = char?.rarity?.display_number;
               const cid = char.slug ?? char?.id;

               return (
                  <Link
                     key={cid}
                     prefetch="intent"
                     to={`/starrail/c/characters/${cid}`}
                     className="bg-2-sub border-color-sub shadow-1 flex items-center justify-center rounded-md border p-2 shadow-sm"
                  >
                     {/* Character Icon */}
                     <div className="relative w-full">
                        {/* Element Symbol */}
                        <div
                           className="border-color shadow-1 absolute left-1 top-0 z-20 flex 
                        h-7 w-7 items-center justify-center rounded-full border bg-zinc-800 shadow"
                        >
                           <Image
                              options="aspect_ratio=1:1&height=42&width=42"
                              alt="Name"
                              url={elemurl}
                              className="object-contain"
                           />
                           {/* layout="fill" objectFit="contain" /> */}
                        </div>

                        {/* Path + Path Name ? */}
                        <div className="border-color shadow-1 absolute right-1 top-0 z-20 h-7 w-7 rounded-full border bg-zinc-800 shadow">
                           <Image
                              options="aspect_ratio=1:1&height=42&width=42"
                              alt="Path"
                              className="relative inline-block object-contain"
                              url={pathsmall}
                              loading={int < 10 ? "lazy" : undefined}
                           />
                        </div>

                        <div className="relative flex w-full items-center justify-center">
                           {/* Rarity */}
                           <div
                              className={`z-20 rounded-full object-contain px-1 color-rarity-${
                                 raritynum ?? "1"
                              } absolute -bottom-2 left-1/2 flex h-4 w-12 -translate-x-1/2 transform items-center bg-opacity-10`}
                           >
                              <Image
                                 options="height=16"
                                 alt="Rarity"
                                 url={rarityurl}
                              />
                           </div>
                           <div className="border-color shadow-1 overflow-hidden rounded-full border-2 shadow-sm">
                              <Image
                                 width={80}
                                 height={80}
                                 options="aspect_ratio=1:1&height=80&width=80"
                                 url={char.icon?.url}
                                 alt={char?.name}
                              />
                           </div>
                        </div>
                        {/* Character Name */}
                        <div className="pt-3 text-center text-xs font-bold">
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
   query Characters {
      Characters(limit: 100, sort: "name") {
         docs {
            id
            name
            slug
            element {
               id
               icon {
                  url
               }
            }
            path {
               id
               icon {
                  url
               }
            }
            rarity {
               id
               display_number
               icon {
                  url
               }
            }
            icon {
               url
            }
            camp
         }
      }
   }
`;

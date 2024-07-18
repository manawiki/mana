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
   const fetchResonatorList = fetchList({
      params,
      request,
      payload,
      user,
      gql: {
         query: QUERY_RESONATORS,
      },
   });
   const fetchElementList = fetchList({
      params,
      request,
      payload,
      user,
      gql: {
         query: QUERY_ELEMENTS,
      },
   });

   const [ResonatorsList, elementsList] = await Promise.all([
      fetchResonatorList,
      fetchElementList,
   ]);

   return json({
      resonators: ResonatorsList?.listData?.docs,
      elements: elementsList?.listData?.docs,
   });
}

export default function HomePage() {
   const { resonators, elements } = useLoaderData<typeof loader>();

   return <ResonatorList chars={resonators} elementlist={elements} />;
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
   color?: string;
};

const ResonatorList = ({ chars, elementlist }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("id");
   const [search, setSearch] = useState("");
   const [showDesc, setShowDesc] = useState(false);

   const sortOptions = [
      { name: "ID", field: "id" },
      { name: "Name", field: "name" },
   ];

   const elemfilter = elementlist.sort((a, b) => a.id - b.id);

   // All Filter Options listed individually atm to control order filter options appear in
   const rarities = [
      {
         id: "4",
         name: "4",
      },
      {
         id: "5",
         name: "5",
      },
   ] as FilterOptionType[];
   const elements = elemfilter?.map((elem: any) => {
      return {
         id: elem.id,
         name: elem.name,
         icon: elem.icon?.url,
      };
   }) as FilterOptionType[];

   const weapons = [
      {
         id: "1",
         name: "Broadblade",
      },
      {
         id: "2",
         name: "Sword",
      },
      {
         id: "3",
         name: "Pistols",
      },
      {
         id: "4",
         name: "Gauntlets",
      },
      {
         id: "5",
         name: "Rectifier",
      },
   ] as FilterOptionType[];

   const filterOptions = [
      {
         name: "Rarity",
         field: "class",
         options: rarities,
      },
      { name: "Elements", field: "element", options: elements },
      { name: "Weapon Types", field: "weapon_type", options: weapons },
   ];

   // var pathlist = filterUnique(chars.map((c: any) => c.path));

   // Sort entries
   var csorted = [...chars];
   csorted.sort((a, b) => (a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0));

   // Filter entries
   // Filter out by each active filter option selected, if matches filter then output 0; if sum of all filters is 0 then show entry.
   let cfiltered = csorted.filter((char) => {
      var showEntry = filters
         .map((filt) => {
            var matches = 0;
            if (Array.isArray(char[filt.field])) {
               const charids = char[filt.field]?.map((cff) => cff.id);
               matches = charids.includes(filt.id) ? 0 : 1;
            } else {
               if (char[filt.field]?.id) {
                  matches = char[filt.field]?.id == filt.id ? 0 : 1;
               } else {
                  matches = char[filt.field] == filt.id ? 0 : 1;
               }
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
         <div className="divide-color-sub bg-2-sub border-color-sub divide-y rounded-md border">
            {filterOptions.map((cat) => (
               <div
                  className="cursor-pointer items-center justify-between gap-3 p-3 laptop:flex"
                  key={cat.name}
               >
                  <div className="text-1 flex items-center gap-2.5 text-sm font-bold max-laptop:pb-3">
                     {cat.name}
                  </div>
                  <div className="items-center justify-between gap-3 max-laptop:grid max-laptop:grid-cols-4 flex">
                     {cat.options.map((opt) => (
                        <div
                           key={opt.id}
                           className={`flex flex-col items-center bg-3 shadow-1 border-color rounded-lg border px-2.5 py-1 shadow-sm ${
                              filters.find(
                                 (a) => a.id == opt.id && a.field == cat.field,
                              )
                                 ? `bg-zinc-100 dark:bg-zinc-500/10`
                                 : ``
                           }`}
                           onClick={(event) => {
                              if (
                                 filters.find(
                                    (a) =>
                                       a.id == opt.id && a.field == cat.field,
                                 )
                              ) {
                                 setFilters(
                                    filters.filter(
                                       (a) =>
                                          a.id != opt.id &&
                                          a.field != cat.field,
                                    ),
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
                              <>
                                 {opt?.color ? (
                                    <div className="flex rounded-full w-fit items-center justify-center bg-zinc-800 dark:bg-transparent ">
                                       <div
                                          style={{
                                             borderColor: `#${opt?.color}`,
                                             backgroundColor: `#${opt?.color}44`,
                                          }}
                                          className="flex h-9 w-9 items-center justify-center rounded-full border-2"
                                       >
                                          <Image
                                             options="aspect_ratio=1:1&height=80&width=80"
                                             className="object-contain"
                                             url={opt.icon}
                                             alt={opt.name}
                                             loading="lazy"
                                          />
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="mx-auto h-9 w-9 rounded-full bg-zinc-800 bg-opacity-50">
                                       <Image
                                          width={60}
                                          height={60}
                                          className="mx-auto"
                                          alt="Icon"
                                          url={opt.icon}
                                       />
                                    </div>
                                 )}
                              </>
                           )}
                           <div className="text-1 pt-0.5 text-center text-[10px]">
                              {opt.name}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
         {/* Search Text Box */}
         <div
            className="border-color-sub bg-2-sub shadow-1 mb-2 mt-3 flex h-12 items-center
                     justify-between gap-3 rounded-lg border px-3 shadow-sm"
         >
            <Icon name="search" className="text-zinc-500" size={20} />
            <input
               className="h-10 w-full flex-grow border-0 bg-transparent focus:outline-none"
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
               {sortOptions.map((opt) => (
                  <div
                     key={opt.name}
                     className={`border-color text-1 shadow-1 relative cursor-pointer rounded-full 
                        border px-4 py-1 text-center text-sm font-bold shadow ${
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
               ))}
            </div>
         </div>

         {/* List with applied sorting */}
         <div
            className={` ${
               showDesc
                  ? ""
                  : "grid grid-cols-3 gap-2 text-center laptop:grid-cols-5"
            }`}
         >
            {cfiltered?.map((char) => (
               <EntryIconOnly char={char} key={char.id} />
            ))}
         </div>
      </List>
   );
};

// function filterUnique(input: any) {
//    var output: any = [];
//    for (var i = 0; i < input.length; i++) {
//       if (!output.find((a: any) => a.id == input[i].id)) {
//          output.push({
//             id: input[i].id,
//             name: input[i].name,
//             icon: input[i].icon?.url,
//          });
//       }
//    }

//    return output;
// }

const EntryIconOnly = ({ char }: any) => {
   const elemicon = char?.element?.icon?.url;
   var name = char?.name;
   const icon = char?.icon?.url;
   const rarityurl = char?.rarity?.icon?.url;
   const raritynum = char?.rarity?.id;
   const cid = char?.id;
   const raritycolor = char?.rarity?.color;

   // Special fix for main character (Rover) names:
   switch (cid) {
      case "1501":
         name = "Rover-Spectro (M)";
         break;
      case "1502":
         name = "Rover-Spectro (F)";
         break;
      case "1604":
         name = "Rover-Havoc (F)";
         break;
      case "1605":
         name = "Rover-Havoc (M)";
         break;
   }

   return (
      <>
         <Link
            prefetch="intent"
            className="shadow-1 bg-2-sub border-color-sub rounded-lg border p-1 shadow-sm"
            to={`/c/resonators/${cid}`}
         >
            {/* Icon */}
            <div className="relative inline-block h-28 w-28">
               {/* Path + Path Name ? */}
               {elemicon ? (
                  <>
                     <div className="absolute -right-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                        <Image
                           width={28}
                           height={28}
                           alt="Icon"
                           className="relative inline-block object-contain"
                           url={elemicon}
                        />
                     </div>
                  </>
               ) : null}

               {/* Rarity */}
               <div
                  style={{ borderColor: `#${raritycolor}` }}
                  className="absolute -bottom-2 w-full transform border-b-4"
               ></div>

               <Image
                  width={150}
                  height={150}
                  className="object-contain"
                  url={icon}
                  alt={name}
               />
            </div>
            {/* Name */}
            <div className="pt-1 text-center text-xs font-bold ">{name}</div>
         </Link>
      </>
   );
};

const QUERY_RESONATORS = `
  query {
    listData: Resonators(limit: 1000) {
      docs {
         id
         name
         slug
         icon {
            url
         }
         rarity {
            id
            color
         }
         element {
            id
            name
            icon {
               url
            }
         }
         weapon_type {
            id
            name
         }
      }
    }
  }
`;

const QUERY_ELEMENTS = `
  query {
    listData: Elements(limit: 1000) {
      docs {
        id
        name
        icon {
          url
        }
      }
    }
  }
`;

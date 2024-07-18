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
   const fetchEchoList = fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: QUERY_ECHOES,
      },
   });
   const fetchSonataList = fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: QUERY_SONATA_EFFECTS,
      },
   });
   const fetchElementList = fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: QUERY_ELEMENTS,
      },
   });

   const [list, sonatadata, elemdata] = await Promise.all([
      fetchEchoList,
      fetchSonataList,
      fetchElementList,
   ]);

   return json({
      echoes: list?.listData?.docs,
      sonatas: sonatadata?.listData?.docs,
      elements: elemdata?.listData?.docs,
   });
}

export default function HomePage() {
   const { echoes, sonatas, elements } = useLoaderData<typeof loader>();

   return (
      <EchoList chars={echoes} sonatalist={sonatas} elementlist={elements} />
   );
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

const EchoList = ({ chars, sonatalist, elementlist }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("id");
   const [search, setSearch] = useState("");
   const [showDesc, setShowDesc] = useState(false);

   const elemfilter = elementlist.sort((a, b) => a.id - b.id);

   const sortOptions = [
      { name: "ID", field: "id" },
      { name: "Name", field: "name" },
   ];

   // All Filter Options listed individually atm to control order filter options appear in
   const rarities = [
      {
         id: "0",
         name: "Common (1)",
      },
      {
         id: "1",
         name: "Elite (3)",
      },
      {
         id: "2",
         name: "Overlord (4)",
      },
      {
         id: "3",
         name: "Calamity (4)",
      },
   ] as FilterOptionType[];
   const elements = elemfilter?.map((elem: any) => {
      return {
         id: elem.id,
         name: elem.name,
         icon: elem.icon?.url,
      };
   }) as FilterOptionType[];

   const sonatas = sonatalist?.map((sl: any) => {
      return {
         id: sl?.id,
         name: sl?.name,
         icon: sl?.icon?.url,
         color: sl?.color,
      };
   }) as FilterOptionType[];

   // const camps = chars.map((c) => {
   //    return c?.camp;
   // }).filter((v,i,a) => a.indexOf(v) === i);

   // sort((a,b) => {
   // return campsort.findIndex((x) => x.id == a) - campsort.findIndex((x) => x.id == b)})

   const filterOptions = [
      {
         name: "Rarity",
         field: "class",
         options: rarities,
      },
      { name: "Elements", field: "element", options: elements },
      { name: "Sonatas", field: "sonata_effect_pool", options: sonatas },
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

   // Filter search by code/name
   cfiltered = cfiltered.filter((char) => {
      return (
         char.code.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
         char.name.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
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
                  <div className="items-center justify-between gap-3 grid max-laptop:grid-cols-4 grid-cols-7 ">
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
                                          className="mx-auto"
                                          alt="Icon"
                                          options="height=60"
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

         {/* Toggle Show Description */}
         {/* <button
            type="button"
            className={`border-color-sub shadow-1 mb-3 block w-full rounded-full border-2 p-2.5 text-sm
               font-bold underline decoration-zinc-500 underline-offset-2 shadow-sm ${
                  showDesc ? "bg-3-sub bg-zinc-50" : "bg-2-sub"
               }`}
            onClick={() => setShowDesc(!showDesc)}
         >
            Click to toggle full descriptions (R5)
         </button> */}

         {/* List with applied sorting */}
         <div
            className={` ${
               showDesc
                  ? ""
                  : "grid grid-cols-3 gap-2 text-center laptop:grid-cols-5"
            }`}
         >
            {cfiltered?.map((char) =>
               showDesc ? (
                  <EntryWithDescription char={char} key={char.id} />
               ) : (
                  <EntryIconOnly char={char} key={char.id} />
               ),
            )}
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

const EntryWithDescription = ({ char }: any) => {
   const pathsmall = char?.path?.icon?.url;
   const rarityurl = char?.rarity?.icon?.url;
   const raritynum = char?.rarity?.display_number;
   const cid = char?.slug ?? char?.id;
   const skillname = char?.skill_name;
   const desc = char?.skill_desc;
   const params = char?.skill_params;

   let dispdesc = desc;
   params.forEach((par: any, i: any) => {
      dispdesc = dispdesc?.replace("{" + i + "}", par?.[4]);
   });

   return (
      <>
         <Link
            className="bg-2-sub border-color-sub shadow-1 relative mb-2.5 flex rounded-lg border shadow-sm"
            prefetch="intent"
            to={`/c/echoes/${cid}`}
         >
            <div className="relative rounded-md p-3">
               {/* Icon */}
               <div className="relative inline-block h-24 w-24">
                  {/* Path + Path Name ? */}
                  {pathsmall ? (
                     <>
                        {" "}
                        <div className="absolute -left-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                           <Image
                              alt="Icon"
                              className="relative inline-block object-contain"
                              url={pathsmall}
                           />
                        </div>
                     </>
                  ) : null}

                  {/* Rarity */}
                  <div
                     style={{ borderColor: `#${char.rarity?.color}` }}
                     className="absolute -bottom-2 w-full transform border-b-4"
                  >
                     {/* <Image
                alt={raritynum}
                className={`z-20 h-4 w-28 rounded-full object-contain color-rarity-${
                  raritynum ?? "1"
                } bg-opacity-10`}
                url={rarityurl}
              /> */}
                  </div>

                  <Image
                     className="object-contain"
                     url={char.icon?.url}
                     alt={char?.name}
                  />
               </div>
               {/* Name */}
               <div className="mt-3 text-center text-xs ">{char.name}</div>
            </div>
            <div className="relative p-3 align-middle text-sm">
               <div className="font-bold text-md">{skillname}</div>
               <div
                  dangerouslySetInnerHTML={{ __html: dispdesc }}
                  className=""
               ></div>
            </div>
         </Link>
      </>
   );
};

const EntryIconOnly = ({ char }: any) => {
   const elemicon = char?.element?.icon?.url;
   const rarityurl = char?.rarity?.icon?.url;
   const raritynum = char?.rarity?.display_number;
   const cid = char?.id;
   const sonatas = char?.sonata_effect_pool;
   const cost = char?.class?.cost;

   return (
      <>
         <Link
            prefetch="intent"
            className="shadow-1 bg-2-sub border-color-sub rounded-lg border p-1 shadow-sm"
            to={`/c/echoes/${cid}`}
         >
            {/* Icon */}
            <div className="relative inline-block h-28 w-28">
               {/* Path + Path Name ? */}
               {elemicon ? (
                  <>
                     <div className="absolute -right-1 bottom-0 z-20 h-6 w-7 rounded-sm bg-gray-800 bg-opacity-90 text-white text-center">
                        {cost}
                     </div>
                  </>
               ) : null}

               {/* Cost ? */}
               {elemicon ? (
                  <>
                     <div className="absolute -right-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                        <Image
                           alt="Icon"
                           className="relative inline-block object-contain"
                           url={elemicon}
                        />
                     </div>
                  </>
               ) : null}

               {/* Sonatas ? */}
               {sonatas?.length > 0 ? (
                  <>
                     <div className="absolute -left-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                        {sonatas?.map((son: any) => {
                           const sonata_color = son?.color;
                           const sonata_icon = son?.icon?.url;

                           return (
                              <div
                                 className="block bg-zinc-800 dark:bg-transparent rounded-full mb-1"
                                 key={son.id}
                              >
                                 <div
                                    style={{
                                       borderColor: `#${sonata_color}`,
                                       backgroundColor: `#${sonata_color}44`,
                                    }}
                                    className="flex h-7 w-7 items-center justify-center rounded-full border-2"
                                 >
                                    <Image
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       className="object-contain"
                                       url={sonata_icon}
                                       alt={"SonataIcon"}
                                       loading="lazy"
                                    />
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </>
               ) : null}

               {/* Rarity */}
               {/* <div
                  style={{ "border-color": `#${char.rarity?.color}` }}
                  className="absolute -bottom-2 w-full transform border-b-4"
               ></div> */}

               <Image
                  options="height=150"
                  className="object-contain"
                  url={char.icon?.url}
                  alt={char?.name}
               />
            </div>
            {/* Name */}
            <div className="pt-1 text-center text-xs font-bold ">
               {char.code}
               {char.name}
            </div>
         </Link>
      </>
   );
};

const QUERY_ECHOES = `
  query {
    listData: Echoes(limit: 1000) {
      docs {
         id
         code
         name
         slug
         class {
            id
            name
            cost
         }
         element {
            id
            name
            icon {
               url
            }
         }
         icon {
            url
         }
         skill {
            desc
            params
         }
         sonata_effect_pool {
            id
            name
            icon {
               url
            }
            color
         }
      }
    }
  }
`;

const QUERY_SONATA_EFFECTS = `
query {
   listData: SonataEffects(limit: 1000, sort:"id") {
     docs {
        id
        name
        slug
        color
        icon {
           url
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

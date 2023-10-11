import { useState } from "react";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
// import { characters } from "./characters";
import { Search, SortDesc } from "lucide-react";

import { settings } from "mana-config";
import { Image } from "~/components";
import { CollectionHeader } from "~/routes/_site+/$siteId.c_+/$collectionId";
import { fetchWithCache } from "~/utils/cache.server";

// export async function loader({
//    context: { payload },
//    request,
// }: LoaderFunctionArgs) {
//    const characters = await payload.find({
//       // @ts-ignore
//       collection: "characters",
//       where: {
//          id: {
//             exists: true,
//          },
//       },
//       depth: 3,
//       limit: 50,
//    });
//    return json({ characters });
// }

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderFunctionArgs) {
   const { data, errors } = await fetchWithCache(
      `https://${settings.siteId}-db.${settings.domain}/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query: QUERY_BLESSINGS,
         }),
      },
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   return json({ blessings: data.blessings.docs });
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Blessings - Honkai: Star Rail",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { blessings } = useLoaderData<typeof loader>();

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <BlessingList chars={blessings} />
      </div>
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
};

const BlessingList = ({ chars }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("data_key");
   const [search, setSearch] = useState("");

   const sortOptions = [
      { name: "ID", field: "data_key" },
      { name: "Name", field: "namestripped" },
   ];

   const collectionName = "blessings";

   // All Filter Options listed individually atm to control order filter options appear in
   const rarities = [
      {
         id: "Normal",
         name: "1",
      },
      {
         id: "NotNormal",
         name: "2",
      },
      {
         id: "Rare",
         name: "3",
      },
   ] as FilterOptionType[];

   console.log(chars);
   const paths = [
      {
         id: "1",
         name: "Preservation",
         icon: chars.find((c: any) => c.aeon?.id == "1")?.aeon.icon_class?.url,
      },
      {
         id: "2",
         name: "Remembrance",
         icon: chars.find((c: any) => c.aeon?.id == "2")?.aeon.icon_class?.url,
      },
      {
         id: "3",
         name: "Nihility",
         icon: chars.find((c: any) => c.aeon?.id == "3")?.aeon.icon_class?.url,
      },
      {
         id: "4",
         name: "Abundance",
         icon: chars.find((c: any) => c.aeon?.id == "4")?.aeon.icon_class?.url,
      },
      {
         id: "5",
         name: "Hunt",
         icon: chars.find((c: any) => c.aeon?.id == "5")?.aeon.icon_class?.url,
      },
      {
         id: "6",
         name: "Destruction",
         icon: chars.find((c: any) => c.aeon?.id == "6")?.aeon.icon_class?.url,
      },
      {
         id: "7",
         name: "Elation",
         icon: chars.find((c: any) => c.aeon?.id == "7")?.aeon.icon_class?.url,
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
      { name: "Path", field: "aeon", options: paths },
   ];

   // var pathlist = filterUnique(chars.map((c: any) => c.path));

   // Sort entries
   // For sorting of names to work, need to strip out HTML tags.
   let csorted = [
      ...chars.map((c: any) => ({ ...c, namestripped: removeTags(c.name) })),
   ];

   csorted.sort((a, b) => (a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0));

   // Filter entries
   // Filter out by each active filter option selected, if matches filter then output 0; if sum of all filters is 0 then show entry.
   let cfiltered = csorted.filter((char) => {
      let showEntry = filters
         .map((filt) => {
            let matches = 0;
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
      <div className="max-desktop:pt-14 pb-4">
         <CollectionHeader />
         <div className="divide-color-sub bg-2-sub shadow-sm shadow-1 border-color-sub divide-y rounded-md border">
            {filterOptions.map((cat) => (
               <div
                  key={cat.name}
                  className="cursor-pointer items-center justify-between gap-3 p-3 laptop:flex"
               >
                  <div className="flex items-center gap-2.5 text-sm font-bold max-laptop:pb-3">
                     {cat.name}
                  </div>
                  <div className="items-center justify-between gap-3 max-laptop:grid max-laptop:grid-cols-4 laptop:flex">
                     {cat.options.map((opt) => (
                        <div
                           key={opt.id}
                           className={`bg-3 border-color-sub shadow-sm shadow-1 rounded-lg border px-2.5 py-1 ${
                              filters.find((a) => a.id == opt.id)
                                 ? `bg-zinc-50 dark:bg-zinc-500/10`
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
                           {opt.icon ? (
                              <>
                                 <div className="mx-auto h-7 w-7 rounded-full bg-zinc-800 bg-opacity-50">
                                    <Image
                                       options="aspect_ratio=1:1&height=40&width=40"
                                       alt="Icon"
                                       className="object-contain"
                                       url={opt.icon}
                                    />
                                 </div>
                              </>
                           ) : null}
                           <div className="text-1 truncate pt-0.5 text-center text-xs">
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

         {/* List of items with applied sorting */}
         <div className="grid grid-cols-2 gap-3 text-center laptop:grid-cols-3">
            {cfiltered?.map((char) => {
               // const pathsmall = char?.path?.icon?.url;
               const rarityurl = char?.rarity?.icon?.url;
               const rarnum =
                  char?.rarity?.display_number == 3
                     ? 5
                     : char?.rarity?.display_number == 2
                     ? 3
                     : char?.rarity?.display_number;
               const cid = char?.id;
               const curl = char.icon?.url;
               const cname = char.name;

               const descsimple = char.effects?.[0]?.description_simple;

               const roguebgurl =
                  "https://static.mana.wiki/starrail/DecoRogueBuffFrame.png";

               return (
                  <Link
                     key={cid}
                     prefetch="intent"
                     to={`/starrail/c/${collectionName}/${cid}`}
                     className="bg-3-sub border-color-sub shadow-1 overflow-hidden rounded-lg border shadow-sm"
                  >
                     <div>
                        <div
                           className={`relative w-full rounded-t-md text-center bg-3-sub color-rarity-${rarnum}`}
                        >
                           {/* Rarity */}
                           <div className="absolute bottom-1 z-20 h-8 w-full text-center">
                              <Image
                                 options="height=40"
                                 alt="Stars"
                                 className="z-20 inline-block h-8 w-20 rounded-full  object-contain"
                                 url={rarityurl}
                              />
                           </div>

                           <div className="absolute flex h-40 w-full items-center justify-center">
                              {/* Main Image */}
                              <div className="inline-flex h-32 w-32">
                                 {curl ? (
                                    <Image
                                       options="aspect_ratio=1:1&height=140&width=140"
                                       alt="Main Icon"
                                       url={curl}
                                       className="object-contain"
                                    />
                                 ) : null}
                              </div>
                           </div>

                           {/* RogueBgImage */}
                           <div className="flex h-40 w-full items-end justify-center">
                              <div className="inline-flex h-auto w-auto">
                                 <Image
                                    options="height=160"
                                    alt="Background"
                                    className="object-contain"
                                    url={roguebgurl}
                                 />
                              </div>
                           </div>
                        </div>
                        <div
                           className="bg-2-sub border-color-sub relative w-full border-b px-2 pb-1 pt-2 
                              text-center text-sm font-bold"
                           dangerouslySetInnerHTML={{
                              __html: cname,
                           }}
                        ></div>
                        <div
                           className="relative h-full w-full rounded-b-md p-2 text-center text-xs"
                           dangerouslySetInnerHTML={{
                              __html: descsimple,
                           }}
                        ></div>
                     </div>
                  </Link>
               );
            })}
         </div>
      </div>
   );
};

function removeTags(str: String) {
   if (str === null || str === "") return false;
   else str = str.toString();

   // Regular expression to identify HTML tags in
   // the input string. Replacing the identified
   // HTML tag with a null string.
   return str.replace(/(<([^>]+)>)/gi, "");
}

const QUERY_BLESSINGS = `
query {
   blessings: Blessings(limit: 0) {
     docs {
       rarity {
         id
         icon {
           url
         }
         display_number
       }
       aeon {
         id
         icon_class {
            url
         }
       }
       id
       icon {
         url
       }
       name
       effects {
         description_simple
       }
     }
   }
 }
`;

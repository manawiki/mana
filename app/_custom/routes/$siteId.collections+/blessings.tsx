import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
// import { characters } from "./characters";
import { Search, SortDesc } from "lucide-react";
import { Image } from "~/components";
import { H2 } from "~/_custom/components/custom";

// export async function loader({
//    context: { payload },
//    request,
// }: LoaderArgs) {
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
}: LoaderArgs) {
   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/blessings?limit=1500`;
   const blessingRaw = await (await fetch(url)).json();
   const blessings = blessingRaw.docs;

   return json({ blessings });
}

export const meta: V2_MetaFunction = () => {
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
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
         <BlessingList chars={blessings} />
      </div>
   );
}

const BlessingList = ({ chars }: any) => {
   const [filters, setFilters] = useState([]);
   const [sort, setSort] = useState("data_key");
   const [search, setSearch] = useState("");

   // For sorting of names to work, need to strip out HTML tags.
   chars = chars.map((c: any) => {
      return { ...c, namestripped: removeTags(c.name) };
   });
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
         //icon: "https://static.mana.wiki/file/mana-prod/starrail/rarity_Stars4-1.png",
      },
      {
         id: "NotNormal",
         name: "2",
         //icon: "https://static.mana.wiki/file/mana-prod/starrail/rarity_Stars4-1.png",
      },
      {
         id: "Rare",
         name: "3",
         //icon: "https://static.mana.wiki/file/mana-prod/starrail/rarity_Stars5-1.png",
      },
   ];
   const paths = [
      {
         id: "1",
         name: "Preservation",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsKnight.png",
      },
      {
         id: "2",
         name: "Remembrance",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsMemory.png",
      },
      {
         id: "3",
         name: "Nihility",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsWarlock.png",
      },
      {
         id: "4",
         name: "Abundance",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsPirest.png",
      },
      {
         id: "5",
         name: "Hunt",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsRogue.png",
      },
      {
         id: "6",
         name: "Destruction",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsWarrior.png",
      },
      {
         id: "7",
         name: "Elation",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsJoy.png",
      },
   ];

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
   var csorted = [...chars];
   csorted.sort((a, b) => (a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0));

   // Filter entries
   // Filter out by each active filter option selected, if matches filter then output 0; if sum of all filters is 0 then show entry.
   var cfiltered = csorted.filter((char: any) => {
      var showEntry = filters
         .map((filt: any) => {
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
   var cfiltered = cfiltered.filter((char: any) => {
      return char.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
   });

   return (
      <>
         {/* Filter Options */}
         <H2 text="Blessings" />
         <div className="divide-color bg-2 border-color divide-y rounded-md border">
            {filterOptions.map((cat: any) => {
               return (
                  <>
                     <div className="cursor-pointer items-center justify-between gap-3 p-3 laptop:flex">
                        <div className="flex items-center gap-2.5 text-sm font-bold max-laptop:pb-3">
                           {cat.name}
                        </div>
                        <div className="items-center justify-between gap-3 max-laptop:grid max-laptop:grid-cols-4 laptop:flex">
                           {cat.options.map((opt: any) => {
                              return (
                                 <>
                                    <div
                                       className={`bg-3 border-color rounded-lg border px-2.5 py-1 ${
                                          filters.find(
                                             (a: any) => a.id == opt.id
                                          )
                                             ? `bg-yellow-50 dark:bg-yellow-500/10`
                                             : ``
                                       }`}
                                       onClick={(event) => {
                                          if (
                                             filters.find((a) => a.id == opt.id)
                                          ) {
                                             setFilters(
                                                filters.filter(
                                                   (a) => a.id != opt.id
                                                )
                                             );
                                          } else {
                                             setFilters([
                                                // Allows only one filter per category
                                                //@ts-expect-error
                                                ...filters.filter(
                                                   (a) =>
                                                      //@ts-expect-error
                                                      a.field != cat.field
                                                ),
                                                //@ts-expect-error
                                                { ...opt, field: cat.field },
                                             ]);
                                          }
                                       }}
                                    >
                                       {opt.icon ? (
                                          <>
                                             <div className="mx-auto h-7 w-7 rounded-full bg-zinc-800 bg-opacity-50">
                                                <Image
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
                                 </>
                              );
                           })}
                        </div>
                     </div>
                  </>
               );
            })}
         </div>

         {/* Search Text Box */}
         <div
            className="border-color bg-2 mb-2 mt-4 flex h-12
            items-center justify-between gap-3 rounded-lg border px-3"
         >
            <Search className="text-yellow-500" size={24} />
            <input
               className="h-10 w-full flex-grow bg-transparent focus:outline-none"
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
               <SortDesc size={16} className="text-yellow-500" />
               Sort
            </div>
            <div className="flex items-center gap-2">
               {sortOptions.map((opt: any) => {
                  return (
                     <div
                        key={opt.field}
                        className={`border-color text-1 relative cursor-pointer 
                        rounded-full border px-4 py-1 text-center text-xs font-bold ${
                           sort == opt.field
                              ? `bg-yellow-50 dark:bg-yellow-500/10`
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
         <div className="grid grid-cols-2 gap-3 pb-16 text-center laptop:grid-cols-3">
            {cfiltered?.map((char: any) => {
               const pathsmall = char?.path?.icon?.url;
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
                  "https://static.mana.wiki/file/mana-prod/starrail/DecoRogueBuffFrame.png";

               return (
                  <>
                     <Link
                        to={`/starrail/collections/${collectionName}/${cid}`}
                        className="bg-2 border-color shadow-1 overflow-hidden rounded-sm border shadow-sm"
                     >
                        <div>
                           <div
                              className={`relative w-full rounded-t-md bg-gray-100 text-center dark:bg-neutral-900 color-rarity-${rarnum}`}
                           >
                              {/* Rarity */}
                              <div className="absolute bottom-1 z-20 h-8 w-full text-center">
                                 <Image
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
                                          alt="Main Icon"
                                          url={curl}
                                          className="object-contain"
                                       />
                                    ) : null}
                                 </div>
                              </div>

                              {/* RogueBgImage */}
                              <div className="inline-block flex h-40 w-full items-end justify-center">
                                 <div className="inline-flex h-auto w-auto">
                                    <Image
                                       alt="Background"
                                       className="object-contain"
                                       url={roguebgurl}
                                    />
                                 </div>
                              </div>
                           </div>
                           <div
                              className="relative w-full border-b bg-gray-200 px-2 pb-1 pt-2 text-center font-bold dark:border-neutral-600 dark:bg-neutral-700"
                              dangerouslySetInnerHTML={{
                                 __html: cname,
                              }}
                           ></div>
                           <div
                              className="relative h-full w-full rounded-b-md p-2 text-center text-sm"
                              dangerouslySetInnerHTML={{
                                 __html: descsimple,
                              }}
                           ></div>
                        </div>
                     </Link>
                  </>
               );
            })}
         </div>
      </>
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

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
// import { characters } from "./characters";
import { Search } from "lucide-react";
import { Image } from "~/components";

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
   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/lightCones?limit=200&sort=lightcone_id`;
   const lightConesRaw = await (await fetch(url)).json();
   const lightCones = lightConesRaw.docs;

   return json({ lightCones });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Light Cones - Honkai: Star Rail",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { lightCones } = useLoaderData<typeof loader>();

   console.log(lightCones);
   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
         <LightConeList chars={lightCones} />
      </div>
   );
}

const LightConeList = ({ chars }: any) => {
   const [filters, setFilters] = useState([]);
   const [sort, setSort] = useState("lightcone_id");
   const [search, setSearch] = useState("");
   const [showDesc, setShowDesc] = useState(false);

   const sortOptions = [
      { name: "ID", field: "lightcone_id" },
      { name: "Name", field: "name" },
   ];

   // All Filter Options listed individually atm to control order filter options appear in
   const rarities = [
      {
         id: "Rare",
         name: "3",
         //icon: "https://static.mana.wiki/file/mana-prod/starrail/rarity_Stars3-1.png",
      },
      {
         id: "VeryRare",
         name: "4",
         //icon: "https://static.mana.wiki/file/mana-prod/starrail/rarity_Stars4-1.png",
      },
      {
         id: "SuperRare",
         name: "5",
         //icon: "https://static.mana.wiki/file/mana-prod/starrail/rarity_Stars5-1.png",
      },
   ];
   const paths = [
      {
         id: "Warlock",
         name: "Nihility",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsWarlock.png",
      },
      {
         id: "Mage",
         name: "Erudition",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsnMage.png",
      },
      {
         id: "Priest",
         name: "Abundance",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsPirest.png",
      },
      {
         id: "Knight",
         name: "Preservation",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsKnight.png",
      },
      {
         id: "Rogue",
         name: "Hunt",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsRogue.png",
      },
      {
         id: "Shaman",
         name: "Harmony",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsShaman.png",
      },
      {
         id: "Warrior",
         name: "Destruction",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/BgPathsWarrior.png",
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
      { name: "Path", field: "path", options: paths },
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
         <div className="">
            {/* Filter Options */}
            <div className="">
               {filterOptions.map((cat: any) => {
                  return (
                     <>
                        <div className="my-1 rounded-xl border px-2 py-1 dark:border-gray-700">
                           <div className="relative mr-1 inline-block w-12 text-center text-sm">
                              {cat.name}{" "}
                           </div>
                           <div className="relative inline-block">
                              {cat.options.map((opt: any) => {
                                 return (
                                    <>
                                       <div
                                          className={`relative mx-1 my-0.5 inline-block w-20 cursor-pointer rounded-md border px-2 py-1 text-center align-middle leading-none dark:border-gray-700 ${
                                             filters.find(
                                                (a: any) => a.id == opt.id
                                             )
                                                ? `bg-slate-800 bg-opacity-20 dark:bg-slate-700 dark:bg-opacity-70`
                                                : ``
                                          }`}
                                          onClick={(event) => {
                                             if (
                                                filters.find(
                                                   (a) => a.id == opt.id
                                                )
                                             ) {
                                                setFilters(
                                                   filters.filter(
                                                      (a) => a.id != opt.id
                                                   )
                                                );
                                             } else {
                                                setFilters([
                                                   // Allows only one filter per category
                                                   ...filters.filter(
                                                      (a) =>
                                                         a.field != cat.field
                                                   ),
                                                   { ...opt, field: cat.field },
                                                ]);
                                             }
                                          }}
                                       >
                                          {opt.icon ? (
                                             <>
                                                <div className="inline-flex h-8 w-8 rounded-full bg-gray-800 bg-opacity-50">
                                                   <Image
                                                      alt="Icon"
                                                      className="object-contain"
                                                      url={opt.icon}
                                                   />
                                                </div>
                                             </>
                                          ) : null}

                                          <div className="text-xs">
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

            {/* Sort Options */}
            <div className="my-2 rounded-xl border p-2 dark:border-gray-700">
               <div className="relative mr-1 inline-block w-12 text-center">
                  Sort
               </div>
               {sortOptions.map((opt: any) => {
                  return (
                     <>
                        <div
                           className={`relative mx-1 inline-block w-20 cursor-pointer rounded-full border px-2 py-1 text-center dark:border-gray-700 ${
                              sort == opt.field
                                 ? `bg-slate-800 bg-opacity-20 dark:bg-slate-700 dark:bg-opacity-70`
                                 : ``
                           }`}
                           onClick={(event) => {
                              setSort(opt.field);
                           }}
                        >
                           {opt.name}
                        </div>
                     </>
                  );
               })}
            </div>

            {/* Search Text Box */}
            <div className="my-2 flex items-center justify-between">
               <span className="border-color flex-grow border-t" />
               <div
                  className="shadow-1 bg-2 border-color relative flex h-10 w-full
                     items-center justify-between rounded-xl border px-5 shadow-sm"
               >
                  <input
                     className="h-10 w-full bg-transparent focus:outline-none"
                     placeholder="Search..."
                     value={search}
                     onChange={(event) => {
                        setSearch(event.target.value);
                     }}
                  />
                  <div className="mx-1 w-32 italic text-gray-400 dark:text-gray-600">
                     {cfiltered.length} entries
                  </div>
                  <Search className="text-1" size={24} />
               </div>
               <span className="border-color flex-grow border-t" />
            </div>

            {/* Toggle Show Description */}
            <div
               className={`my-2 w-full cursor-pointer rounded-md border p-1 text-center dark:border-gray-600 ${
                  showDesc ? "bg-slate-500 bg-opacity-20 font-bold" : ""
               }`}
               onClick={() => setShowDesc(!showDesc)}
            >
               Click to toggle full descriptions
            </div>

            {/* List with applied sorting */}
            <div className="text-center">
               {cfiltered?.map((char: any) => {
                  return (
                     <>
                        {showDesc ? (
                           <EntryWithDescription char={char} />
                        ) : (
                           <EntryIconOnly char={char} />
                        )}
                     </>
                  );
               })}
            </div>
         </div>
      </>
   );
};

function filterUnique(input: any) {
   var output: any = [];
   for (var i = 0; i < input.length; i++) {
      if (!output.find((a: any) => a.id == input[i].id)) {
         output.push({
            id: input[i].id,
            name: input[i].name,
            icon: input[i].icon?.url,
         });
      }
   }

   return output;
}

const EntryWithDescription = ({ char }: any) => {
   const pathsmall = char?.path?.icon?.url;
   const rarityurl = char?.rarity?.icon?.url;
   const raritynum = char?.rarity?.display_number;
   const cid = char?.id;
   const skillinfo = char?.skill_data[char?.skill_data?.length - 1]?.desc;

   return (
      <>
         <a href={`/starrail/collections/characters/${cid}`}>
            <div className="relative my-1 inline-block w-full rounded-md bg-slate-800 bg-opacity-10 p-2 align-middle dark:bg-slate-700 dark:bg-opacity-50">
               <div className="relative inline-block w-32  rounded-md text-left align-middle">
                  {/* Icon */}
                  <div className="relative inline-block h-28 w-28">
                     {/* Path + Path Name ? */}
                     <div className="absolute -left-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                        <Image
                           alt="Icon"
                           className="relative inline-block object-contain"
                           url={pathsmall}
                        />
                     </div>

                     {/* Rarity */}
                     <div className="absolute -bottom-4 z-20 h-4 w-28">
                        <Image
                           alt={raritynum}
                           className={`z-20 h-4 w-28 rounded-full object-contain color-rarity-${
                              raritynum ?? "1"
                           } bg-opacity-10`}
                           url={rarityurl}
                        />
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
               <div
                  className="relative inline-block w-2/3 p-3 align-middle text-sm"
                  dangerouslySetInnerHTML={{ __html: skillinfo }}
               ></div>
            </div>
         </a>
      </>
   );
};

const EntryIconOnly = ({ char }: any) => {
   const pathsmall = char?.path?.icon?.url;
   const rarityurl = char?.rarity?.icon?.url;
   const raritynum = char?.rarity?.display_number;
   const cid = char?.id;

   return (
      <>
         <a href={`/starrail/collections/lightCones/${cid}`}>
            <div className="relative m-1 inline-block w-32 rounded-md bg-slate-800 bg-opacity-10 p-2 align-top dark:bg-slate-700 dark:bg-opacity-50">
               {/* Icon */}
               <div className="relative inline-block h-28 w-28">
                  {/* Path + Path Name ? */}
                  <div className="absolute -right-1 -top-1 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                     <Image
                        alt="Icon"
                        className="relative inline-block object-contain"
                        url={pathsmall}
                     />
                  </div>

                  {/* Rarity */}
                  <div className="absolute -bottom-5 z-20 h-4 w-28">
                     <Image
                        alt={raritynum}
                        className={`z-20 h-4 w-28 rounded-full object-contain color-rarity-${
                           raritynum ?? "1"
                        } bg-opacity-10`}
                        url={rarityurl}
                     />
                  </div>

                  <Image
                     className="object-contain"
                     url={char.icon?.url}
                     alt={char?.name}
                  />
               </div>
               {/* Name */}
               <div className="mt-4 text-center text-xs ">{char.name}</div>
            </div>
         </a>
      </>
   );
};

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { SiteSwitcher } from "~/components/SiteSwitcher";
import { useState } from "react";
// import { characters } from "./characters";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { Search } from "lucide-react";

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
   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/characters?limit=100`;
   const characterRaw = await (await fetch(url)).json();
   const characters = characterRaw.docs;

   return json({ characters });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Home - Mana",
      },
      {
         name: "description",
         content: "Build Better Wikis",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { characters } = useLoaderData<typeof loader>();

   // console.log(characters);
   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
         <CharacterList chars={characters} />
      </div>
   );
}

const CharacterList = ({ chars }: any) => {
   const [filters, setFilters] = useState([]);
   const [sort, setSort] = useState("character_id");
   const [search, setSearch] = useState("");

   const sortOptions = [
      { name: "ID", field: "character_id" },
      { name: "Name", field: "name" },
   ];

   // All Filter Options listed individually atm to control order filter options appear in
   const rarities = [
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
   const elements = [
      {
         id: "Physical",
         name: "Physical",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/IconAttributePhysical.png",
      },
      {
         id: "Ice",
         name: "Ice",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/IconAttributeIce.png",
      },
      {
         id: "Thunder",
         name: "Lightning",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/IconAttributeThunder.png",
      },
      {
         id: "Fire",
         name: "Fire",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/IconAttributeFire.png",
      },

      {
         id: "Wind",
         name: "Wind",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/IconAttributeWind.png",
      },
      {
         id: "Quantum",
         name: "Quantum",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/IconAttributeQuantum.png",
      },
      {
         id: "Imaginary",
         name: "Imaginary",
         icon: "https://static.mana.wiki/file/mana-prod/starrail/IconAttributeImaginary.png",
      },
   ];
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
         {/* <DarkModeToggle /> */}
         <div className="">
            {/* Filter Options */}
            <div className="">
               {filterOptions.map((cat: any) => {
                  return (
                     <>
                        <div className="px-2 py-1 my-1 border rounded-xl dark:border-gray-700">
                           <div className="relative inline-block mr-1 w-12 text-sm text-center">
                              {cat.name}{" "}
                           </div>
                           <div className="relative inline-block">
                              {cat.options.map((opt: any) => {
                                 return (
                                    <>
                                       <div
                                          className={`relative inline-block align-middle text-center w-20 rounded-md border dark:border-gray-700 px-2 py-1 my-0.5 mx-1 leading-none cursor-pointer ${
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
                                                <div className="rounded-full bg-gray-800 bg-opacity-50 h-8 w-8 inline-flex">
                                                   <img
                                                      className="object-contain"
                                                      src={opt.icon}
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
            <div className="rounded-xl border dark:border-gray-700 p-2 my-2">
               <div className="relative inline-block mr-1 w-12 text-center">
                  Sort
               </div>
               {sortOptions.map((opt: any) => {
                  return (
                     <>
                        <div
                           className={`relative inline-block text-center w-20 rounded-full border dark:border-gray-700 px-2 py-1 mx-1 cursor-pointer ${
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
            <div className="flex items-center justify-between my-2">
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
                  <div className="text-gray-400 dark:text-gray-600 italic mx-1 w-32">
                     {cfiltered.length} entries
                  </div>
                  <Search className="text-1" size={24} />
               </div>
               <span className="border-color flex-grow border-t" />
            </div>

            {/* List of Characters with applied sorting */}
            <div className="text-center">
               {cfiltered?.map((char: any) => {
                  const elemurl = char?.element?.icon?.url;
                  const pathsmall = char?.path?.icon?.url;
                  const rarityurl = char?.rarity?.icon?.url;
                  const raritynum = char?.rarity?.display_number;

                  return (
                     <>
                        <div className="relative inline-block rounded-md bg-slate-800 bg-opacity-10 dark:bg-slate-700 dark:bg-opacity-50 p-2 m-1 w-32 align-top">
                           {/* Character Icon */}
                           <div className="relative inline-block h-28 w-28">
                              {/* Element Symbol */}
                              <div className="absolute h-7 w-7 -top-1 -left-1 bg-gray-800 bg-opacity-20 rounded-full z-20">
                                 <img
                                    src={elemurl}
                                    className="object-contain"
                                 />
                                 {/* layout="fill" objectFit="contain" /> */}
                              </div>

                              {/* Path + Path Name ? */}
                              <div className="absolute h-7 w-7 -top-1 -right-1 bg-gray-800 bg-opacity-50 rounded-full z-20">
                                 <img
                                    className="relative inline-block object-contain"
                                    src={pathsmall}
                                 />
                              </div>

                              {/* Rarity */}
                              <div className="absolute -bottom-7 w-28 z-20 h-4">
                                 <img
                                    className={`object-contain w-28 z-20 h-4 rounded-full color-rarity-${
                                       raritynum ?? "1"
                                    } bg-opacity-10`}
                                    src={rarityurl}
                                 />
                              </div>

                              <img
                                 className="object-contain"
                                 src={char.icon?.url}
                                 alt={char?.name}
                              />
                           </div>
                           {/* Character Name */}
                           <div className="text-center text-xs mt-6 ">
                              {char.name}
                           </div>
                        </div>
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

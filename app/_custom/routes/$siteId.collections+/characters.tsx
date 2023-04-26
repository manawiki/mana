import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { SiteSwitcher } from "~/components/SiteSwitcher";
import { useState } from "react";
// import { characters } from "./characters";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { Filter, Search, SortDesc } from "lucide-react";
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
   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/characters?limit=100`;
   const characterRaw = await (await fetch(url)).json();
   const characters = characterRaw.docs;

   return json({ characters });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Characters - Honkai: Star Rail",
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
         {/* Filter Options */}
         <H2 text="Characters" />
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

         {/* List of Characters with applied sorting */}
         <div className="grid grid-cols-2 gap-3 pb-16 text-center laptop:grid-cols-5">
            {cfiltered?.map((char: any) => {
               const elemurl = char?.element?.icon?.url;
               const pathsmall = char?.path?.icon?.url;
               const rarityurl = char?.rarity?.icon?.url;
               const raritynum = char?.rarity?.display_number;
               const cid = char?.id;

               return (
                  <>
                     <Link
                        to={`/starrail/collections/characters/${cid}/c`}
                        className="bg-2 border-color shadow-1 rounded-md border shadow-sm"
                     >
                        {/* Character Icon */}
                        <div className="relative">
                           {/* Element Symbol */}
                           <div className="absolute left-2 top-2 z-20 h-7 w-7 rounded-full bg-zinc-800">
                              <Image
                                 alt="Name"
                                 url={elemurl}
                                 className="object-contain"
                              />
                              {/* layout="fill" objectFit="contain" /> */}
                           </div>

                           {/* Path + Path Name ? */}
                           <div className="absolute right-2 top-2 z-20 h-7 w-7 rounded-full bg-zinc-800">
                              <Image
                                 alt="Path"
                                 className="relative inline-block object-contain"
                                 url={pathsmall}
                              />
                           </div>

                           {/* Rarity */}
                           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform">
                              <Image
                                 alt="Rarity"
                                 className={`z-20 h-4 rounded-full object-contain px-1 color-rarity-${
                                    raritynum ?? "1"
                                 } bg-opacity-10`}
                                 url={rarityurl}
                              />
                           </div>
                           <Image
                              className="mx-auto object-contain"
                              url={char.icon?.url}
                              alt={char?.name}
                           />
                        </div>
                        {/* Character Name */}
                        <div className="pb-1.5 pt-2.5 text-center text-xs font-bold">
                           {char.name}
                        </div>
                     </Link>
                  </>
               );
            })}
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

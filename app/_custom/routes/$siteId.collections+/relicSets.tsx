import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Image } from "~/components";
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
   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/relicSets?limit=200&sort=relicset_id`;
   const relicSetsRaw = await (await fetch(url)).json();
   const relicSets = relicSetsRaw.docs;

   return json({ relicSets });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Relic Sets - Honkai: Star Rail",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { relicSets } = useLoaderData<typeof loader>();

   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
         <RelicSetList chars={relicSets} />
      </div>
   );
}

const RelicSetList = ({ chars }: any) => {
   const [filters, setFilters] = useState([]);
   const [sort, setSort] = useState("relicset_id");
   const [search, setSearch] = useState("");
   const [showDesc, setShowDesc] = useState(false);

   const sortOptions = [
      { name: "ID", field: "relicset_id" },
      { name: "Name", field: "name" },
   ];

   const relics = chars.map((c: any) => {
      return {
         ...c,
         settype: c.set_effect?.length > 1 ? "Relic Set" : "Planetary Ornament",
      };
   });

   chars = relics;

   console.log(chars);

   // All Filter Options listed individually atm to control order filter options appear in
   const settypes = [
      {
         id: "Relic Set",
         name: "Relic Set",
      },
      {
         id: "Planetary Ornament",
         name: "Planetary Ornament",
      },
   ];

   // const camps = chars.map((c) => {
   //    return c?.camp;
   // }).filter((v,i,a) => a.indexOf(v) === i);

   // sort((a,b) => {
   // return campsort.findIndex((x) => x.id == a) - campsort.findIndex((x) => x.id == b)})

   const filterOptions = [
      {
         name: "Type",
         field: "settype",
         options: settypes,
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

            {/* List with applied sorting */}
            <div className="text-center">
               {cfiltered?.map((char: any) => {
                  return (
                     <>
                        <EntryWithDescription char={char} />
                     </>
                  );
               })}
            </div>
         </div>
      </>
   );
};

const EntryWithDescription = ({ char }: any) => {
   const cid = char?.id;
   const effect = char?.set_effect;

   return (
      <>
         <a href={`/starrail/collections/relicSets/${cid}`}>
            <div className="relative my-1 inline-block w-full rounded-md bg-slate-800 bg-opacity-10 p-2 align-middle dark:bg-slate-700 dark:bg-opacity-50">
               <div className="relative inline-block w-28 rounded-md text-center align-middle">
                  {/* Icon */}
                  <div className="relative inline-block h-20 w-20">
                     <Image
                        className="object-contain"
                        url={char.icon?.url}
                        alt={char?.name}
                     />
                  </div>
                  {/* Name */}
                  <div className="text-center text-xs">{char.name}</div>
               </div>
               <div className="relative inline-block w-2/3 p-3 align-middle text-sm">
                  {effect?.map((eff: any) => {
                     return (
                        <>
                           <div className="my-1 rounded-md border border-gray-300 bg-neutral-300 p-1 px-3 text-left dark:border-gray-700 dark:bg-neutral-800">
                              <div className="mr-2 inline-block w-1/6 align-top font-bold text-green-900 dark:text-green-200">
                                 {eff.req_no}-Pc:
                              </div>
                              <div
                                 className="inline-block w-3/4 align-top"
                                 dangerouslySetInnerHTML={{
                                    __html: eff.description,
                                 }}
                              ></div>
                           </div>
                        </>
                     );
                  })}
               </div>
            </div>
         </a>
      </>
   );
};

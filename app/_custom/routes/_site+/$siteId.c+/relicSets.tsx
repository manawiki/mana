import { useState } from "react";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Search, SortDesc } from "lucide-react";

import { settings } from "mana-config";
import { Image } from "~/components";
import { CollectionHeader } from "~/routes/_site+/$siteId.c_+/src/components";
import { fetchWithCache } from "~/utils/cache.server";

export async function loader({
   context: { payload, user },
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
            query: QUERY_RELIC_SETS,
         }),
      },
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   return json({ relicSets: data.relicSets.docs });
}

export const meta: MetaFunction = () => {
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
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <RelicSetList chars={relicSets} />
      </div>
   );
}

type FilterTypes = {
   id: string;
   name: string;
   field: string;
};

const RelicSetList = ({ chars }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("relicset_id");
   const [search, setSearch] = useState("");

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
   let csorted = [...chars];
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
      <div className="max-desktop:pt-14">
         <div className="pb-3 laptop:pb-20">
            {/* Filter Options */}
            <CollectionHeader />
            <div className="divide-color-sub bg-2-sub border-color-sub divide-y shadow-sm shadow-1 rounded-md border">
               {filterOptions.map((cat) => (
                  <div
                     key={cat.name}
                     className="cursor-pointer items-center justify-between gap-3 p-3 laptop:flex"
                  >
                     <div className="text-1 flex items-center gap-2.5 text-sm font-bold max-laptop:pb-3">
                        {cat.name}
                     </div>
                     <div className="items-center justify-between gap-3 max-laptop:grid max-laptop:grid-cols-4 laptop:flex">
                        {cat.options.map((opt) => (
                           <div
                              key={opt.id}
                              className={`bg-3 shadow-1 border-color rounded-lg border px-2.5 py-1 shadow-sm ${
                                 filters.find((a) => a.id == opt.id)
                                    ? `bg-zinc-50 dark:bg-zinc-500/10`
                                    : ``
                              }`}
                              onClick={(event) => {
                                 if (filters.find((a: any) => a.id == opt.id)) {
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
               className="border-color-sub bg-2-sub shadow-1 mb-2 mt-3 flex h-12 items-center
                      justify-between gap-3 rounded-lg border px-3 shadow-sm"
            >
               <Search className="text-zinc-500" size={20} />
               <input
                  className="h-10 w-full border-0 focus:border-0 flex-grow bg-transparent focus:outline-none"
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
                  {sortOptions.map((opt: any) => (
                     <div
                        key={opt.field}
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
            <div className="space-y-2.5 text-center">
               {cfiltered?.map((char: any) => (
                  <EntryWithDescription char={char} key={char.id} />
               ))}
            </div>
         </div>
      </div>
   );
};

const EntryWithDescription = ({ char }: any) => {
   const cid = char?.id;
   const effect = char?.set_effect;

   return (
      <>
         <Link
            prefetch="intent"
            className="bg-2-sub border-color-sub shadow-1 flex items-start gap-3 rounded-lg border shadow-sm"
            to={`/starrail/c/relicSets/${cid}`}
         >
            <div className="w-20 flex-none p-3 laptop:w-40">
               {/* Icon */}
               <Image
                  options="aspect_ratio=1:1&height=80&width=80"
                  className="mx-auto"
                  url={char.icon?.url}
                  alt={char?.name}
               />
               {/* Name */}
               <div className="pt-1 text-center text-xs">{char.name}</div>
            </div>
            <div className="divide-color-sub flex-grow divide-y pr-3">
               {effect?.map((eff: any) => (
                  <div
                     key={eff.req_no}
                     className="flex items-start gap-3 py-3 text-sm"
                  >
                     <div className="flex-none font-bold text-zinc-600 dark:text-zinc-200">
                        {eff.req_no}-pc
                     </div>
                     <div
                        className="text-1 flex-grow text-left"
                        dangerouslySetInnerHTML={{
                           __html: eff.description,
                        }}
                     ></div>
                  </div>
               ))}
            </div>
         </Link>
      </>
   );
};

const QUERY_RELIC_SETS = `
query {
   relicSets: RelicSets(limit: 0) {
     docs {
       relicset_id
       name
       id
       icon {
         url
       }
       set_effect {
         req_no
         description
       }
     }
   }
 }
`;

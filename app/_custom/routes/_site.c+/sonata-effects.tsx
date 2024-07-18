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
   const list = await fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: QUERY_SONATA_EFFECTS,
      },
   });

   return json({
      sonatas: list?.listData?.docs,
   });
}

export default function HomePage() {
   const { sonatas } = useLoaderData<typeof loader>();

   return <EchoList chars={sonatas} />;
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

const EchoList = ({ chars }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("id");
   const [search, setSearch] = useState("");
   const [showDesc, setShowDesc] = useState(false);

   const sortOptions = [
      { name: "ID", field: "id" },
      { name: "Name", field: "name" },
   ];

   // All Filter Options listed individually atm to control order filter options appear in
   // const rarities = [
   //   {
   //     id: "0",
   //     name: "Common (1)",
   //   },
   //   {
   //     id: "1",
   //     name: "Elite (3)",
   //   },
   //   {
   //     id: "2",
   //     name: "Overlord (4)",
   //   },
   //   {
   //     id: "3",
   //     name: "Calamity (4)",
   //   },
   // ] as FilterOptionType[];
   // const elements = elemfilter?.map((elem: any) => {
   //   return {
   //     id: elem.id,
   //     name: elem.name,
   //     icon: elem.icon?.url,
   //   };
   // }) as FilterOptionType[];

   // const camps = chars.map((c) => {
   //    return c?.camp;
   // }).filter((v,i,a) => a.indexOf(v) === i);

   // sort((a,b) => {
   // return campsort.findIndex((x) => x.id == a) - campsort.findIndex((x) => x.id == b)})

   const filterOptions = [];

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
   // cfiltered = cfiltered.filter((char) => {
   //   return char.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
   // });

   // Filter search by name OR by full set descriptions
   cfiltered = cfiltered.filter((char) => {
      const searchdata =
         char.name +
         " " +
         char.effects?.map((eff: any) => eff.effect).toString();

      return searchdata.toLowerCase().indexOf(search.toLowerCase()) > -1;
   });

   return (
      <List>
         {/* <div className="divide-color-sub bg-2-sub border-color-sub divide-y rounded-md border">
        {filterOptions.map((cat) => (
          <div
            className="cursor-pointer items-center justify-between gap-3 p-3 laptop:flex"
            key={cat.name}
          >
            <div className="text-1 flex items-center gap-2.5 text-sm font-bold max-laptop:pb-3">
              {cat.name}
            </div>
            <div className="items-center justify-between gap-3 grid max-laptop:grid-cols-4 grid-cols-7 flex">
              {cat.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`flex flex-col items-center bg-3 shadow-1 border-color rounded-lg border px-2.5 py-1 shadow-sm ${
                    filters.find((a) => a.id == opt.id && a.field == cat.field)
                      ? `bg-zinc-100 dark:bg-zinc-500/10`
                      : ``
                  }`}
                  onClick={(event) => {
                    if (
                      filters.find(
                        (a) => a.id == opt.id && a.field == cat.field
                      )
                    ) {
                      setFilters(
                        filters.filter(
                          (a) => a.id != opt.id && a.field != cat.field
                        )
                      );
                    } else {
                      setFilters([
                        // Allows only one filter per category
                        ...filters.filter((a) => a.field != cat.field),
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
                              "borderColor": `#${opt?.color}`,
                              "backgroundColor": `#${opt?.color}44`,
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
      </div> */}

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

         {/* Special for only Sonata Effects - Note */}
         <div className="divide-color-sub bg-2-sub border-color-sub divide-y rounded-md border p-2 italic text-center">
            Note search terms can include both sonata effect name and set effect
            descriptions.
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
         <div className="grid gap-2 text-center laptop:grid-cols-2">
            {cfiltered?.map((char) => (
               <EntryWithDescription char={char} key={char.id} />
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

const EntryWithDescription = ({ char }: any) => {
   const cid = char?.id;
   const sonata_icon = char?.icon?.url;
   const sonata_name = char?.name;
   const sonata_effects = char?.effects;
   const sonata_color = char?.color;
   return (
      <>
         <Link
            className="w-full h-full"
            prefetch="intent"
            to={`/c/sonata-effects/${cid}`}
         >
            <div className="border-color-sub bg-2-sub shadow-1 overflow-hidden rounded-lg border shadow-sm w-full h-full">
               {/* Header with Sonata Icon and Name */}
               <div className="bg-3-sub relative flex items-center justify-center gap-3 p-3 border-b border-color-sub">
                  <div className="bg-zinc-800 dark:bg-transparent rounded-full">
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
                           alt={sonata_name}
                           loading="lazy"
                        />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <div className="font-bold text-blue-500">
                        {sonata_name}
                     </div>
                  </div>
                  {/* <div className="">
              <Icon name="external-link" className="text-zinc-500" size={16} />
            </div> */}
               </div>

               {/* Set Effects */}
               <div className="border-color-sub border-t p-3 text-sm">
                  {sonata_effects.map((effect: any) => {
                     let dispdesc = effect.effect;
                     effect.params.forEach((par: any, i: any) => {
                        dispdesc = dispdesc?.replace("{" + i + "}", par);
                     });

                     return (
                        <div className="my-1" key={dispdesc}>
                           <div className="font-bold text-base">
                              {effect.pieces}-Set:{" "}
                           </div>
                           <div
                              className=""
                              dangerouslySetInnerHTML={{
                                 __html: dispdesc ?? "",
                              }}
                           ></div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </Link>
      </>
   );
};

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
        effects {
          pieces
          effect
          params
        }
      }
   }
 }
`;

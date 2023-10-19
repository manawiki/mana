import { useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
// import { characters } from "./characters";
import { Search, SortDesc } from "lucide-react";

import { settings } from "mana-config";
import type { Material } from "payload/generated-custom-types";
import { Image } from "~/components";
import { List } from "~/routes/_site+/$siteId.c_+/src/components";
import { customListMeta } from "~/routes/_site+/$siteId.c_+/src/functions";
import { fetchWithCache } from "~/utils/cache.server";

export { customListMeta as meta };

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
            query: QUERY_RECIPES,
         }),
      },
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   return json({ recipes: data.recipes.docs });
}

export default function HomePage() {
   const { recipes } = useLoaderData<typeof loader>();

   return <RecipeList chars={recipes} />;
}

type FilterTypes = {
   id: string;
   name: string;
   field: string;
};

const RecipeList = ({ chars }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("data_key");
   const [search, setSearch] = useState("");

   const sortOptions = [
      { name: "ID", field: "data_key" },
      { name: "Name", field: "name" },
   ];

   const collectionName = "recipes";

   // All Filter Options listed individually atm to control order filter options appear in
   const types = [
      {
         id: "2",
         name: "Consumables",
         icon: chars.find((c: any) => c.recipe_type?.id == "2")?.recipe_type
            .icon?.url,
      },
      {
         id: "12",
         name: "Traces Activation Materials",
         icon: chars.find((c: any) => c.recipe_type?.id == "12")?.recipe_type
            .icon?.url,
      },
      {
         id: "21",
         name: "Cavern Relic Synthesis",
         icon: chars.find((c: any) => c.recipe_type?.id == "21")?.recipe_type
            .icon?.url,
      },
      {
         id: "22",
         name: "Planar Ornament Synthesis",
         icon: chars.find((c: any) => c.recipe_type?.id == "22")?.recipe_type
            .icon?.url,
      },
      {
         id: "31",
         name: "Material Exchange",
         icon: chars.find((c: any) => c.recipe_type?.id == "31")?.recipe_type
            .icon?.url,
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
         field: "recipe_type",
         options: types,
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
      <List>
         <div className="divide-color-sub bg-2-sub shadow-sm shadow-1 border-color-sub divide-y rounded-md border">
            {filterOptions.map((cat) => (
               <div
                  key={cat.name}
                  className="cursor-pointer items-center justify-between gap-3 p-3 laptop:flex"
               >
                  <div className="w-40 text-sm font-bold max-laptop:pb-2">
                     {cat.name}
                  </div>
                  <div className="grid flex-grow grid-cols-2 items-center justify-between gap-2 laptop:grid-cols-3">
                     {cat.options.map((opt) => (
                        <div
                           key={opt.id}
                           className={`bg-3 shadow-sm shadow-1 border-color-sub flex h-10 items-center gap-2 rounded-lg border p-1 ${
                              filters.find((a) => a.id == opt.id)
                                 ? `bg-yellow-50 dark:bg-yellow-500/10`
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
                                 <div className="border-color h-7 w-7 rounded-full border bg-zinc-800 bg-opacity-50">
                                    <Image
                                       options="aspect_ratio=1:1&height=40&width=40"
                                       alt="Icon"
                                       className="object-contain"
                                       url={opt.icon}
                                    />
                                 </div>
                              </>
                           ) : null}
                           <div className="text-1 text-xs">{opt.name}</div>
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
         <div className="bg-2-sub border-color-sub shadow-1 divide-color divide-y rounded-lg border shadow-sm laptop:mb-16">
            {cfiltered?.map((char) => {
               // const rarityurl = char?.result_item?.rarity?.icon?.url;
               const rarnum = char?.result_item?.rarity?.display_number;
               const cid = char.slug ?? char?.id;
               const curl = char.icon?.url;
               const cname = char.name;

               const ingredients = char?.material_cost;
               const spec = char?.special_material_cost;
               const specnum = char?.special_material_cost_num;

               return (
                  <div key={cid} className="overflow-auto">
                     <div className="flex items-center justify-between gap-3 p-2">
                        {/* Result Item */}
                        <Link
                           prefetch="intent"
                           className="flex min-w-[200px] items-center gap-3"
                           to={`/starrail/c/${collectionName}/${cid}`}
                        >
                           <div className="h-12 w-12 flex-none rounded-md laptop:h-16 laptop:w-16">
                              <Image
                                 options="aspect_ratio=1:1&height=100&width=100"
                                 url={curl ?? "no_image_42df124128"}
                                 className={`object-contain color-rarity-${
                                    rarnum ?? "1"
                                 } rounded-md`}
                                 alt={cname}
                              />
                           </div>
                           <div className="max-laptop:text-sm">{cname}</div>
                        </Link>

                        {/* Recipe Items */}
                        {ingredients?.length > 0 || spec?.length > 0 ? (
                           <>
                              <div className="flex items-center gap-1">
                                 {/* Main Fixed Ingredients */}
                                 {ingredients?.map((mat: any, key: number) => (
                                    <ItemQtyFrame mat={mat} key={key} />
                                 ))}

                                 {/* Special Ingredients */}
                                 {spec?.length > 0 ? (
                                    <>
                                       <div className="inline-block">
                                          <div className="flex w-full items-center gap-1">
                                             {spec?.map((mat: any) => (
                                                <ItemFrameSmall
                                                   key={mat.id}
                                                   mat={mat}
                                                />
                                             ))}
                                          </div>
                                          <div
                                             className="mt-0.5 w-full rounded-sm bg-dark500
                                                text-center align-middle text-xs font-bold text-white"
                                          >
                                             {specnum}
                                          </div>
                                       </div>
                                    </>
                                 ) : null}
                              </div>
                           </>
                        ) : null}
                     </div>
                  </div>
               );
            })}
         </div>
      </List>
   );
};

const ItemFrameSmall = ({ mat }: { mat: Material }) => {
   return (
      <>
         <Link prefetch="intent" to={`/starrail/c/materials/${mat?.id}`}>
            <div className="relative h-8 w-8 align-middle text-xs">
               <Image
                  options="aspect_ratio=1:1&height=80&width=80"
                  url={mat?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat?.rarity?.display_number ?? "1"
                  } rounded-md`}
                  alt={mat?.name}
               />
            </div>
         </Link>
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon and Quantity Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
type ItemQtyFrameProps = {
   materials?: Material;
   qty?: number;
   id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <Link
            prefetch="intent"
            to={`/starrail/c/materials/${mat.materials?.id}`}
         >
            <div className="relative inline-block h-10 w-10 align-middle text-xs laptop:h-12 laptop:w-12">
               <Image
                  options="aspect_ratio=1:1&height=80&width=80"
                  url={mat.materials?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat.materials?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat.materials?.name}
               />
            </div>
            <div className="relative w-10 rounded-b-sm bg-dark500 align-middle text-xs text-white laptop:w-12">
               {mat?.qty}
            </div>
         </Link>
      </div>
   );
};

// function removeTags(str: String) {
//    if (str === null || str === "") return false;
//    else str = str.toString();

//    // Regular expression to identify HTML tags in
//    // the input string. Replacing the identified
//    // HTML tag with a null string.
//    return str.replace(/(<([^>]+)>)/gi, "");
// }

const QUERY_RECIPES = `
query {
   recipes: Recipes(limit: 100) {
     docs {
       recipe_type {
         id
         name
         icon {
            url
         }
       }
       result_item {
         rarity {
           icon {
             url
           }
           display_number
         }
       }
       id
       slug
       icon {
         url
       }
       name
       material_cost {
         materials {
            id
           icon {
             url
           }
           rarity {
             display_number
           }
           name
         }
         qty
       }
       special_material_cost {
         id
         icon {
           url
         }
         rarity {
           display_number
         }
         name
       }
       special_material_cost_num
     }
   }
 }
`;

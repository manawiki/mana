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
   const { data, errors } = await fetch(
      `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query: QUERY_RECIPES
         }),
      }
   ).then((res) => res.json());

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   return json({ recipes: data.recipes.docs });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Recipes - Honkai: Star Rail",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { recipes } = useLoaderData<typeof loader>();

   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
         <RecipeList chars={recipes} />
      </div>
   );
}

const RecipeList = ({ chars }: any) => {
   const [filters, setFilters] = useState([]);
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
         icon: "https://static.mana.wiki/starrail/InventoryConsumablesIcon.png",
      },
      {
         id: "12",
         name: "Traces Activation Materials",
         icon: "https://static.mana.wiki/starrail/InventoryFosterIcon.png",
      },
      {
         id: "21",
         name: "Cavern Relic Synthesis",
         icon: "https://static.mana.wiki/starrail/IconAvatarRelic.png",
      },
      {
         id: "22",
         name: "Planar Ornament Synthesis",
         icon: "https://static.mana.wiki/starrail/IconAvatarRelic.png",
      },
      {
         id: "31",
         name: "Material Exchange",
         icon: "https://static.mana.wiki/starrail/ReplacementIcon.png",
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
         <H2 text="Recipes" />
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
                                       className={`bg-3 border-color h-24 w-24 rounded-lg border px-2.5 py-1 ${
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
                                       <div className="text-1  pt-0.5 text-center text-xs">
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
         <div className="grid grid-cols-1 gap-3 text-center laptop:grid-cols-1">
            {cfiltered?.map((char: any) => {
               const rarityurl = char?.result_item?.rarity?.icon?.url;
               const rarnum = char?.result_item?.rarity?.display_number;
               const cid = char?.id;
               const curl = char.icon?.url;
               const cname = char.name;

               const ingredients = char?.material_cost;
               const spec = char?.special_material_cost;
               const specnum = char?.special_material_cost_num;

               return (
                  <>
                     <div className="bg-2 border-color shadow-1 rounded-sm border shadow-sm">
                        <div className="align-center flex justify-between p-2">
                           {/* Result Item */}
                           <Link
                              to={`/starrail/collections/${collectionName}/${cid}`}
                              className="inline-flex"
                           >
                              <div className="inline-flex items-center">
                                 <div className="inline-flex h-16 w-16 rounded-md">
                                    <Image
                                       url={curl ?? "no_image_42df124128"}
                                       className={`object-contain color-rarity-${
                                          rarnum ?? "1"
                                       } rounded-md`}
                                       alt={cname}
                                    />
                                 </div>
                                 <div className="ml-2 inline-flex">{cname}</div>
                              </div>
                           </Link>

                           {/* Recipe Items */}
                           {ingredients?.length > 0 || spec?.length > 0 ? (
                              <>
                                 <div className="inline-flex items-center">
                                    {/* Main Fixed Ingredients */}
                                    {ingredients?.map((mat: any) => {
                                       return (
                                          <>
                                             <ItemQtyFrame mat={mat} />
                                          </>
                                       );
                                    })}

                                    {/* Special Ingredients */}
                                    {spec?.length > 0 ? (
                                       <>
                                          <div className="mx-1 inline-block">
                                             <div className="w-full">
                                                {spec?.map((mat: any) => (
                                                   <ItemFrameSmall mat={mat} />
                                                ))}
                                             </div>
                                             <div className="w-full border-b border-gray-700 bg-bg1Dark align-middle text-xs text-white">
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
                  </>
               );
            })}
         </div>
      </>
   );
};

const ItemFrameSmall = ({ mat }: any) => {
   return (
      <>
         <Link to={`/starrail/collections/materials/${mat?.id}`}>
            <div className="relative m-0.5 inline-block h-8 w-8 align-middle text-xs">
               <Image
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
const ItemQtyFrame = ({ mat }: any) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <Link to={`/starrail/collections/materials/${mat.materials?.id}`}>
            <div className="relative mr-1 mt-0.5 inline-block h-12 w-12 align-middle text-xs">
               <Image
                  url={mat.materials?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat.materials?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat.materials?.name}
               />
            </div>
            <div className="relative mr-1 w-12 rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-xs text-white">
               {mat?.qty}
            </div>
         </Link>
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

const QUERY_RECIPES = `
query {
   recipes: Recipes(limit: 0) {
     docs {
       recipe_type {
         id
         name
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
       icon {
         url
       }
       name
       material_cost {
         materials {
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
`
import type { Item } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function Cooking({ data: full }: { data: any }) {
   const char = full.CookRecipes;
   const ingredient_recipes = full.CookIngredient;

   return (
      <>
         <div
            dangerouslySetInnerHTML={{
               __html: `<style>
                    div.wuwa-rarity-1 {
                        border-top: 2px solid #efece1;
                    }
                    div.wuwa-rarity-2 {
                        border-top: 2px solid #efece1;
                    }
                    div.wuwa-rarity-3 {
                        border-top: 2px solid #efece1;
                    }
                    div.wuwa-rarity-4 {
                        border-top: 2px solid #ca6dff;
                    }
                    div.wuwa-rarity-5 {
                        border-top: 2px solid #ffe65a;
                    }
                  </style>`,
            }}
         ></div>
         {char.length > 0 ? <ResultRecipes char={char} /> : null}

         {ingredient_recipes.length > 0 ? (
            <IngredientRecipes reclist={ingredient_recipes} />
         ) : null}
      </>
   );
}

const ResultRecipes = ({ char }: any) => {
   return (
      <>
         <H2 text="Created from Cooking Recipes" />
         {/* Recipes show Name, Ingredients (with quantity) and Result in a flex container? */}
         <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
         >
            <div className="flex justify-between gap-2 w-full items-center text-lg font-bold p-1">
               <div className="text-center w-full">Ingredients</div>
               <div className="text-center w-full">Result</div>
            </div>
            {char.map((recipe: any) => {
               const cookres = { item: recipe?.result_item };
               const resid = recipe?.result_item?.id;
               const ingredients = recipe?.cooking_items;
               const special = recipe?.special_dishes;

               return (
                  <>
                     {/* Normal Recipe */}
                     <div className="flex justify-between gap-2 w-full items-center p-1">
                        <div className="text-center w-full">
                           {ingredients?.map((ing: any, i: any) => (
                              <ItemQtyFrame
                                 mat={ing}
                                 key={`${resid}-ing-${i}`}
                              />
                           ))}
                        </div>
                        <div className="text-center w-full">
                           <ItemQtyFrameLarge mat={cookres} key={resid} />
                           <div>{cookres?.item?.name}</div>
                        </div>
                     </div>

                     {/* Specialty Recipe if Exists */}
                     {special ? (
                        <>
                           {special?.map((specialty: any) => {
                              const specialresult = { item: specialty.item };
                              const resonator = specialty.resonator;
                              return (
                                 <>
                                    <div className="flex justify-between gap-2 w-full items-center p-1">
                                       <div className="flex items-center justify-center text-center w-full">
                                          <ResonatorFrame
                                             resonator={resonator}
                                          />
                                          {ingredients?.map(
                                             (ing: any, i: any) => (
                                                <ItemQtyFrame
                                                   mat={ing}
                                                   key={`${resid}-ing-${i}`}
                                                />
                                             ),
                                          )}
                                       </div>
                                       <div className="text-center w-full">
                                          <ItemQtyFrameLarge
                                             mat={specialresult}
                                             key={resid}
                                          />
                                          <div>{specialresult?.item?.name}</div>
                                       </div>
                                    </div>
                                 </>
                              );
                           })}
                        </>
                     ) : null}
                  </>
               );
            })}
         </div>
      </>
   );
};

const IngredientRecipes = ({ reclist }: any) => {
   return (
      <>
         <H2 text="Used in Cooking Recipes" />
         {/* Recipes show Name, Ingredients (with quantity) and Result in a flex container? */}
         <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
         >
            <div className="flex justify-between gap-2 w-full items-center text-lg font-bold p-1">
               <div className="text-center w-full">Ingredients</div>
               <div className="text-center w-full">Result</div>
            </div>
            {reclist.map((recipe: any) => {
               const cookres = { item: recipe?.result_item };
               const resid = recipe?.result_item?.id;
               const ingredients = recipe?.cooking_items;
               const special = recipe?.special_dishes;

               return (
                  <>
                     {/* Normal Recipe */}
                     <div className="flex justify-between gap-2 w-full items-center p-1">
                        <div className="text-center w-full">
                           {ingredients?.map((ing: any, i: any) => (
                              <ItemQtyFrame
                                 mat={ing}
                                 key={`${resid}-ing-${i}`}
                              />
                           ))}
                        </div>
                        <div className="text-center w-full">
                           <ItemQtyFrameLarge mat={cookres} key={resid} />
                           <div>{cookres?.item?.name}</div>
                        </div>
                     </div>
                  </>
               );
            })}
         </div>
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
   item?: Item;
   cnt?: number;
   id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/c/items/${mat.item?.id}`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs bg-zinc-700 text-white leading-none">
               <Image
                  height={44}
                  width={44}
                  className="object-contain"
                  url={mat.item?.icon?.url ?? "/favicon.ico"}
                  alt={mat.item?.name ?? undefined}
               />
            </div>
            {mat?.cnt ? (
               <>
                  <div
                     className={`relative mr-0.5 w-11 bg-black align-middle text-xs text-white wuwa-rarity-${mat.item?.rarity?.id}`}
                  >
                     {mat?.cnt}
                  </div>
               </>
            ) : null}
         </a>
      </div>
   );
};
const ItemQtyFrameLarge = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/c/items/${mat.item?.id}`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-14 w-14 align-middle text-xs bg-zinc-700 text-white leading-none">
               <Image
                  className="object-contain"
                  url={mat.item?.icon?.url ?? "/favicon.ico"}
                  height={120}
                  width={120}
                  alt={mat.item?.name ?? undefined}
               />
            </div>
            {mat?.cnt ? (
               <>
                  {" "}
                  <div
                     className={`relative mr-0.5 w-14 bg-black align-middle text-xs text-white wuwa-rarity-${mat.item?.rarity?.id}`}
                  >
                     {mat?.cnt}
                  </div>
               </>
            ) : null}
         </a>
      </div>
   );
};

const ResonatorFrame = ({ resonator }: any) => {
   const id = resonator?.id;
   const name = resonator?.name;
   const icon = resonator?.icon?.url;

   return (
      <div className="relative inline-block text-center mx-2" key={id}>
         <a href={`/c/resonator/${id}`}>
            <div className="relative mt-0.5 inline-block h-16 w-16 align-middle text-xs bg-zinc-700 text-white  leading-none  rounded-t-sm ">
               <Image
                  height={120}
                  width={120}
                  className="object-contain"
                  url={icon ?? "/favicon.ico"}
                  alt={name}
               />
            </div>
            {name ? (
               <>
                  <div
                     className={`relative w-16 bg-black align-middle text-xs text-white rounded-b-sm `}
                  >
                     {name}
                  </div>
               </>
            ) : null}
         </a>
      </div>
   );
};

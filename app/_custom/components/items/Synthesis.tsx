import type { Item } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";

export function Synthesis({ data: full }: { data: any }) {
   const synthesis = full.Synthesis;
   const ingredient_synthesis = full.SynthesisIngredient;

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
         {synthesis.length > 0 ? <ResultRecipes char={synthesis} /> : null}

         {ingredient_synthesis.length > 0 ? (
            <IngredientRecipes reclist={ingredient_synthesis} />
         ) : null}
      </>
   );
}

const ResultRecipes = ({ char }: any) => {
   return (
      <>
         <H2 text="Created from Synthesis Recipes" />
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
               const ingredients = recipe?.synthesis_items;

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

const IngredientRecipes = ({ reclist }: any) => {
   return (
      <>
         <H2 text="Used in Synthesis Recipes" />
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
               const ingredients = recipe?.synthesis_items;

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
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs bg-zinc-700 text-white text-xs leading-none">
               <Image
                  height={44}
                  className="object-contain"
                  url={mat.item?.icon?.url ?? "/favicon.ico"}
                  options="height=44"
                  alt={mat.item?.name}
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
            <div className="relative mr-0.5 mt-0.5 inline-block h-14 w-14 align-middle text-xs bg-zinc-700 text-white text-xs leading-none">
               <Image
                  className="object-contain"
                  url={mat.item?.icon?.url ?? "/favicon.ico"}
                  options="height=120"
                  alt={mat.item?.name}
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
            <div className="relative mt-0.5 inline-block h-16 w-16 align-middle text-xs bg-zinc-700 text-white text-xs leading-none rounded-t-sm rounded-t-sm ">
               <Image
                  className="object-contain"
                  url={icon ?? "/favicon.ico"}
                  options="height=120"
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

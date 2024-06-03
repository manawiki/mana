import { Image } from "~/components/Image";

export function ResonatorPassiveNodes({ data: full }: { data: any }) {
   const char = full.Resonator;

   const passive_nodes = char?.skill_tree?.filter(
      (a: any) => a.node_type == "PASSIVE_NODE",
   );

   return (
      <>
         {passive_nodes.map((snode: any) => (
            <PassiveNode node={snode} />
         ))}
      </>
   );
}

const PassiveNode = ({ node }: any) => {
   const name = node?.resonator_skill?.name;
   let desc = node?.resonator_skill?.desc;
   desc = desc.replace(/(<br\s*\/?>){2,}/gi, "<br/>");
   const type = node?.resonator_skill?.type?.name;
   const upgrade_costs = node?.resonator_skill?.upgrade_costs;
   const params = node?.resonator_skill?.params;
   const icon = node?.resonator_skill?.icon?.url;

   let dispdesc = desc;
   params?.map((par: any, i: any) => {
      dispdesc = dispdesc?.replace("{" + i + "}", par);
   });

   return (
      <>
         {/* Name */}
         <div className="mt-2 flex items-center justify-between gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-t-lg shadow-sm shadow-1 border border-color-sub py-2 ">
            <div className="flex gap-2 items-center">
               {icon ? (
                  <>
                     <div className="flex h-8 w-8 rounded-full bg-zinc-700 dark:bg-zinc-800">
                        <Image
                           options="aspect_ratio=1:1&height=80&width=80"
                           className="object-contain"
                           url={icon}
                           alt={name}
                           loading="lazy"
                        />
                     </div>
                  </>
               ) : null}

               <div className="font-semibold text-lg">{name}</div>
            </div>

            <div className="text-gray-600 dark:text-gray-400">{type}</div>
         </div>
         <div className="mb-2 items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-b-lg shadow-sm shadow-1 border border-color-sub py-2 wuwa-skill-description leading-7 ">
            <div
               className="dark:brightness-100 brightness-75"
               dangerouslySetInnerHTML={{ __html: dispdesc }}
            ></div>
            <div className="text-center">
               {upgrade_costs[0]?.items?.map((mat: any, key: string) => (
                  <ItemQtyFrame mat={mat} key={key} />
               ))}
            </div>
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
   item?: any;
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
                  className="object-contain"
                  url={mat.item?.icon?.url ?? "no_image_42df124128"}
                  options="height=44"
                  alt={mat.item?.name}
               />
            </div>
            <div
               className={`relative mr-0.5 w-11 bg-black align-middle text-xs text-white wuwa-rarity-${mat.item?.rarity?.id}`}
            >
               {mat?.cnt}
            </div>
         </a>
      </div>
   );
};

// =====================================
// For rendering Down Icon
// =====================================
export const CaretDownIcon = (props: any) => (
   <svg
      className={props.class}
      width={props.w}
      height={props.h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path fill="currentColor" d="M20 8H4L12 16L20 8Z"></path>
   </svg>
);

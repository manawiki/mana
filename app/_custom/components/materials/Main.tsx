import type { Material as MaterialType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

export function Main({ data: mat }: { data: MaterialType }) {
   const mainImage = mat?.icon?.url;
   const mainName = mat?.name;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: mat.rarity?.name ? mat.rarity?.name + "★" : "-",
      },
      {
         label: "Backpack Max Count",
         value: mat?.max_backpack_stack_count
            ? mat?.max_backpack_stack_count > 0
               ? mat.max_backpack_stack_count
               : "-"
            : "-",
      },
      {
         label: "Max Count",
         value: mat?.max_stack_count
            ? mat?.max_stack_count > 0
               ? mat.max_stack_count
               : "-"
            : "-",
      },
      {
         label: "Can Be Discarded?",
         value: mat?.backpack_can_discard ? "Yes" : "No",
      },
   ];

   return (
      <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4 mb-3">
         <section>
            <div className="flex items-center justify-center shadow-sm shadow-1 rounded-lg dark:bg-dark350 bg-zinc-50 border border-color-sub h-full">
               <Image
                  height={128}
                  className="object-contain"
                  url={
                     mainImage ??
                     "https://static.mana.wiki/endfield/common_charhead_blank.png"
                  }
                  options="height=128"
                  alt={mainName ?? "Icon"}
               />
            </div>
         </section>
         <section>
            <div
               className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
            >
               {mainStatDisplay?.map((row) => (
                  <div className="p-3 justify-between flex items-center gap-2">
                     <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                           {row.label}
                        </span>
                     </div>
                     <div className="text-sm font-semibold">{row.value}</div>
                  </div>
               ))}
            </div>
         </section>
      </div>
   );
}

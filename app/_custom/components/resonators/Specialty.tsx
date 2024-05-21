import { useState } from "react";

import type { Item } from "payload/generated-custom-types";

import { Disclosure } from "@headlessui/react";

import type { Resonator as ResonatorType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";

export function Specialty({ data: full }: { data: any }) {
  const recipes = full?.Recipes;

  return (
    <>
      <H2 text="Cooking Specialty" />
      <div className="mb-3 w-full">
        {recipes.map((g, i) => {
          const specialty = g.special_dishes;
          return (
            <>
              <div
                className="shadow-1 border-color-sub relative inline-block overflow-hidden rounded-lg border text-center shadow-sm w-full"
                key={i}
              >
                <a href={g.url}>
                  <div className="bg-2-sub relative flex w-full items-center justify-center p-3">
                    <div className="relative w-full text-center text-xl">
                      {specialty?.map((spec: any) => (
                        <>
                          <ItemFrame mat={spec} />
                          <div className="inline-block ml-2">
                            {spec.item?.name}
                          </div>
                        </>
                      ))}
                      {/* <Image
                          options="aspect_ratio=1:1&height=120&width=120"
                          alt="Gallery Item"
                          url={g.url}
                          className="h-24 w-24 object-contain"
                        /> */}
                    </div>
                  </div>
                </a>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

// ====================================
// 0a) GENERIC: Item Icon and Quantity Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
type ItemFrameProps = {
  item?: Item;
  cnt: number;
  id?: string;
};
const ItemFrame = ({ mat }: { mat: ItemFrameProps }) => {
  return (
    <div className="relative inline-block text-center" key={mat?.id}>
      <a href={`/c/items/${mat.item?.id}`}>
        <div className="relative mr-0.5 mt-0.5 inline-block h-14 w-14 align-middle text-xs bg-zinc-700 text-white text-xs leading-none">
          <Image
            height={44}
            className="object-contain"
            url={mat.item?.icon?.url ?? "no_image_42df124128"}
            options="aspect_ratio=1:1&height=120&width=120"
            alt={mat.item?.name}
          />
        </div>
        <div
          className={`relative mr-0.5 w-14 bg-black align-middle text-xs text-white wuwa-rarity-${mat.item?.rarity?.id}`}
        ></div>
      </a>
    </div>
  );
};

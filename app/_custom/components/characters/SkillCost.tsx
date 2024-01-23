import type { Material, Character } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

// Note the break cost in gold is currently flat across all characters per promotion:
// Max30: 127 Gold
// Max40: 305 Gold
// Max50: 614 Gold
// Max60: 1601 Gold
// Max70: 1781 Gold

export const SkillCost = ({ data: char }: { data: CharacterType }) => {
  return (
    <>
      <H2 text="Skill Cost" />
      <div
        dangerouslySetInnerHTML={{
          __html: `<style>
                    div.endfield-rarity-1 {
                        border-top: 1px solid #A8A8A8;
                    }
                    div.endfield-rarity-2 {
                        border-top: 1px solid #A8A8A8;
                    }
                    div.endfield-rarity-3 {
                        border-top: 1px solid #AAEB35;
                    }
                    div.endfield-rarity-4 {
                        border-top: 1px solid #00B3FE;
                    }
                    div.endfield-rarity-5 {
                        border-top: 1px solid #DEACFA;
                    }
                    div.endfield-rarity-6 {
                        border-top: 1px solid #FBC813;
                    }
                  </style>`,
        }}
      ></div>

      <table className="talent-table w-full overflow-auto text-sm">
        <thead>
          <tr className="text-sm">
            <th>Skill Lv</th>
            <th>Materials</th>
          </tr>
        </thead>
        <tbody>
          {char.skill_level_up?.map((promo, index) => {
            return (
              <>
                {promo.item_cost?.length > 0 ? (
                  <tr key={index}>
                    <th className="px-3 py-0 text-center text-xs font-bold">
                      <div>
                        {promo.skill?.name} Lv{promo.level}
                      </div>
                      <div>
                        <div className="inline-block align-top">
                          {promo.gold_cost}
                        </div>
                        <div className="inline-block align-top bg-gray-600 mx-1">
                          <Image
                            height={15}
                            className="object-contain"
                            url="https://static.mana.wiki/endfield/item_gold_icon.png"
                            options="height=15"
                            alt={"GoldIcon"}
                          />
                        </div>
                      </div>
                    </th>
                    <td className="px-1 py-1 pl-3">
                      {promo.item_cost?.map((mat, key) => (
                        <ItemQtyFrame mat={mat} key={key} />
                      ))}
                    </td>
                  </tr>
                ) : null}
              </>
            );
          })}
        </tbody>
      </table>
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
  item?: Material;
  count?: number;
  id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
  // Matqty holds material and quantity information

  return (
    <div className="relative inline-block text-center" key={mat?.id}>
      <a href={`/c/materials/${mat.item?.id}`}>
        <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs">
          <img
            src={mat.item?.icon?.url ?? "no_image_42df124128"}
            className={`object-contain`}
            alt={mat.item?.name}
            loading="lazy"
            width="44"
            height="44"
          />
        </div>
        <div
          className={`relative mr-0.5 w-11 bg-black align-middle text-xs text-white endfield-rarity-${mat.item?.rarity?.id}`}
        >
          {mat?.count}
        </div>
      </a>
    </div>
  );
};

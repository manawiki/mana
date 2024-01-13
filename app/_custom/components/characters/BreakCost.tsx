import type { Material, Character } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";

export const BreakCost = ({ data: char }: { data: CharacterType }) => {
  return (
    <>
      <H2 text="Break Cost" />
      <table className="talent-table w-full overflow-auto text-sm">
        <thead>
          <tr className="text-sm">
            <th>Level</th>
            <th>Materials</th>
          </tr>
        </thead>
        <tbody>
          {char.break_data?.map((promo, index) => {
            return (
              <>
                {promo.required_item?.length > 0 ? (
                  <tr key={index}>
                    <th className="px-3 py-0 text-center text-xs font-bold">
                      <div>Lv {promo.max_level}</div>
                    </th>
                    <td className="px-1 py-1 pl-3">
                      {promo.required_item?.map((mat, key) => (
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
            className={`object-contain color-rarity-${
              mat.item?.rarity?.display_number ?? "1"
            } material-frame`}
            alt={mat.item?.name}
            loading="lazy"
            width="44"
            height="44"
          />
        </div>
        <div className="relative mr-0.5 w-11 rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-xs text-white">
          {mat?.count}
        </div>
      </a>
    </div>
  );
};

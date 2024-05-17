import { useState } from "react";

import { Disclosure } from "@headlessui/react";

import type { Item } from "payload/generated-custom-types";
import type { Resonator as ResonatorType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";

export function Skill({ data: full }: { data: any }) {
  const char = full.Resonator;

  // Separate SKILL nodes, PASSIVE nodes, and BONUS nodes!
  // Will list Skill, then passive, then bonus nodes.

  const skill_nodes = char?.skill_tree?.filter(
    (a: any) => a.node_type == "SKILL_NODE"
  );
  const passive_nodes = char?.skill_tree?.filter(
    (a: any) => a.node_type == "PASSIVE_NODE"
  );
  const bonus_nodes = char?.skill_tree?.filter(
    (a: any) => a.node_type == "BONUS_NODE"
  );

  return (
    <>
      <H2 text="Skill Nodes" />
      {skill_nodes.map((snode: any) => (
        <SkillNode node={snode} />
      ))}

      <H2 text="Passive Nodes" />
      {passive_nodes.map((snode: any) => (
        <PassiveNode node={snode} />
      ))}

      <H2 text="Bonus Nodes" />
      {bonus_nodes.map((snode: any) => (
        <BonusNode node={snode} />
      ))}
    </>
  );
}

const BonusNode = ({ node }: any) => {
  const name = node?.bonus_name;
  var desc = node?.bonus_desc;
  desc = desc.replace(/(<br\s*\/?>){2,}/gi, "<br/>");
  const icon = node?.bonus_icon?.url;
  const upgrade_costs = node?.unlock_costs;

  return (
    <>
      {/* Header with Skill Icon and Name */}
      <div className="mt-2 flex items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-t-lg shadow-sm shadow-1 border border-color-sub py-2 ">
        <div className="">
          {" "}
          <div className="flex h-8 w-8 rounded-full bg-zinc-700 dark:bg-zinc-800">
            <Image
              options="aspect_ratio=1:1&height=80&width=80"
              className="object-contain"
              url={icon}
              alt={name}
              loading="lazy"
            />
          </div>
        </div>
        <div className="font-bold text-xl">{name}</div>
      </div>
      {/* Description */}
      <div className="mb-2 items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-b-lg shadow-sm shadow-1 border border-color-sub py-2 wuwa-skill-description leading-7">
        <div className="" dangerouslySetInnerHTML={{ __html: desc }}></div>
        <div className="text-center">
          {upgrade_costs?.map((mat, key) => (
            <ItemQtyFrame mat={mat} key={key} />
          ))}
        </div>
      </div>
    </>
  );
};

const PassiveNode = ({ node }: any) => {
  const name = node?.resonator_skill?.name;
  var desc = node?.resonator_skill?.desc;
  desc = desc.replace(/(<br\s*\/?>){2,}/gi, "<br/>");
  const type = node?.resonator_skill?.type?.name;
  const upgrade_costs = node?.unlock_costs;

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<style>
                                div.wuwa-skill-description > span {
                                   background-color: rgba(0,0,0,.8);
                                   padding-top: 2px;
                                   padding-right: 4px;
                                   padding-left: 4px;
                                   padding-bottom: 1px;
                                   margin-right: 2px;
                                   margin-left: 2px;
                                   border-radius: 3px;
                                }
                             </style>`,
        }}
      ></div>
      {/* Name */}
      <div className="mt-2 flex items-center justify-between gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-t-lg shadow-sm shadow-1 border border-color-sub py-2 ">
        <div className="font-bold text-2xl">{name}</div>
        <div className="text-gray-600 dark:text-gray-400">{type}</div>
      </div>
      <div className="mb-2 items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-b-lg shadow-sm shadow-1 border border-color-sub py-2 wuwa-skill-description leading-7">
        <div className="" dangerouslySetInnerHTML={{ __html: desc }}></div>
        <div className="text-center">
          {upgrade_costs?.map((mat, key) => (
            <ItemQtyFrame mat={mat} key={key} />
          ))}
        </div>
      </div>
    </>
  );
};

const SkillNode = ({ node }: any) => {
  const [level, setLevel] = useState(0);
  const [disp, setDisp] = useState(false);

  const name = node?.resonator_skill?.name;
  var desc = node?.resonator_skill?.desc;
  desc = desc.replace(/(<br\s*\/?>){2,}/gi, "<br/>");
  const type = node?.resonator_skill?.type?.name;
  const details = node?.resonator_skill?.details;
  const maxlv = node?.resonator_skill?.max_lv;
  const upgrade_costs = node?.resonator_skill?.upgrade_costs;

  const tableformat = "border border-color-sub";

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<style>
                                div.wuwa-skill-description > span {
                                   background-color: rgba(0,0,0,.8);
                                   padding-top: 2px;
                                   padding-right: 4px;
                                   padding-left: 4px;
                                   padding-bottom: 1px;
                                   margin-right: 2px;
                                   margin-left: 2px;
                                   border-radius: 3px;
                                }
                             </style>`,
        }}
      ></div>
      {/* Name */}
      <div className="mt-2 flex items-center justify-between gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-t-lg shadow-sm shadow-1 border border-color-sub py-2 ">
        <div className="font-bold text-2xl">{name}</div>
        <div className="text-gray-600 dark:text-gray-400">{type}</div>
      </div>
      {/* Description or Stats/Materials Tab Selector */}
      <div className="flex items-center gap-2 px-3  shadow-sm shadow-1 border-l border-r text-center border-color-sub py-1">
        <div
          className={`border-color-sub border-r w-full cursor-pointer ${
            disp
              ? "bg-zinc-50 dark:bg-zinc-800"
              : "font-bold bg-zinc-200 dark:bg-zinc-900"
          }`}
          onClick={() => setDisp(!disp)}
        >
          Description
        </div>
        <div
          className={`border-color-sub  w-full cursor-pointer ${
            disp
              ? "font-bold bg-zinc-200 dark:bg-zinc-900"
              : "bg-zinc-50 dark:bg-zinc-800"
          }`}
          onClick={() => setDisp(!disp)}
        >
          Stats/Materials
        </div>
      </div>

      {/* Description - Show only on disp false*/}
      {!disp ? (
        <>
          <div
            className="mb-2 items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-b-lg shadow-sm shadow-1 border border-color-sub py-2 wuwa-skill-description leading-7"
            dangerouslySetInnerHTML={{ __html: desc }}
          ></div>
        </>
      ) : (
        <>
          {/* Slider - Show only on disp true*/}
          <div className="flex items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border-l border-r border-color-sub py-1">
            <div className="mr-2 inline-flex align-middle text-zinc-200">
              <div className="text-xs mr-1 text-gray-500 self-center">Lv</div>
              <input
                className="text-lg font-bold mr-2 w-6 text-gray-600 dark:text-gray-400 self-center bg-transparent border-0 p-0"
                value={level + 1}
                onChange={(event) => {
                  const numonly = /^[0-9\b]+$/;
                  const maxval = maxlv;

                  // Only set the level slider value if the entered value is not blank or a Number. Parseint as well so leading 0s are removed.
                  if (numonly.test(event.target.value)) {
                    let input = parseInt(event.target.value);
                    if (input > maxval) {
                      input = maxval;
                    } else if (input < 1) {
                      input = 1;
                    }
                    setLevel(input - 1);
                  }
                }}
              ></input>
            </div>
            <input
              aria-label="Level Slider"
              className="h-1 flex-grow appearance-none justify-end
                              rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
              type="range"
              min="1"
              max={maxlv}
              value={level + 1}
              onChange={(event) => setLevel(parseInt(event.target.value) - 1)}
            ></input>
          </div>
          <div className="mb-2 items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-b-lg shadow-sm shadow-1 border border-color-sub py-2 wuwa-skill-description leading-7">
            {/* Stats per level */}
            <table className="talent-table w-full overflow-auto text-sm border-collapse">
              <thead>
                <tr className="text-base">
                  <th className={`${tableformat}`}>Name</th>
                  {/* <th className={`${tableformat}`}>Gold</th> */}
                  <th className={`${tableformat}`}>Value</th>
                </tr>
              </thead>
              <tbody>
                {details?.map((det, index) => {
                  return (
                    <>
                      <tr key={index}>
                        <th
                          className={`px-3 py-0 text-center text-sm font-bold ${tableformat}`}
                        >
                          <div>{det.name}</div>
                        </th>
                        {/* <th
                      className={`px-3 py-0 text-center text-xs font-bold ${tableformat}`}
                    >
                      <div>{promo.gold}</div>
                    </th> */}
                        <td
                          className={`px-1 py-1 pl-3 text-center text-sm ${tableformat}`}
                        >
                          <div>{det.values?.[level]?.value}</div>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>

            {/* Materials */}
            {level > 0 ? (
              <div className="text-center">
                {upgrade_costs[level - 1].items?.map((mat, key) => (
                  <ItemQtyFrame mat={mat} key={key} />
                ))}
              </div>
            ) : null}
          </div>
        </>
      )}
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

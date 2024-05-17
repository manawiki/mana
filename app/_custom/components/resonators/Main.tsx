import { useState } from "react";

import { Disclosure } from "@headlessui/react";

import type { Resonator as ResonatorType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

export function Main({ data: full }: { data: any }) {
  const char = full.Resonator;
  const curves = full.Curves.sort(
    (a, b) => a.level - b.level || a.lb_lv - b.lb_lv
  );

  console.log(char);

  const [level, setLevel] = useState(0);

  const displevel = curves[level].level;
  const dispasc = curves[level].lb_lv;

  const mainImage = char?.splash?.url;
  const mainName = char?.name;
  const mainDesc = char?.intro;
  const mainStatDisplay = [
    {
      label: "Rarity",
      value: char.rarity?.id ? char.rarity?.id + "★" : "-",
    },
    {
      label: "Element",
      value: char?.element?.name,
      icon: char?.element?.icon?.url,
    },
    {
      label: "Weapon",
      value: char?.weapon_type?.name,
    },
  ];

  const mainAttributes = char.stats;

  return (
    <>
      <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4 mb-3">
        <section>
          <div className="flex items-center justify-center shadow-sm shadow-1 border border-color-sub rounded-lg dark:bg-dark350 bg-zinc-50 h-full">
            <Image
              height={320}
              className="object-contain"
              url={
                mainImage ??
                "https://static.mana.wiki/endfield/common_charhead_blank.png"
              }
              options="height=320"
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
              <div className="px-3 py-2 justify-between flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{row.label}</span>
                </div>
                <div className="text-sm font-semibold">
                  <span className="inline-block align-middle">{row.value}</span>
                  {row.icon ? (
                    <>
                      <div className="items-center inline-block align-middle justify-center dark:bg-dark350 bg-zinc-600 h-full ml-2">
                        <Image
                          height={30}
                          className="object-contain"
                          url={row?.icon}
                          options="height=30"
                          alt={mainName ?? "Icon"}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ))}

            {mainAttributes?.map((attr: any, aindex: any) => {
              const attr_icon = attr?.attribute?.icon?.url;
              const attr_name = attr?.attribute?.name;
              var attr_index = null;
              switch (attr_name) {
                case "HP":
                  attr_index = 0;
                  break;
                case "ATK":
                  attr_index = 1;
                  break;
                case "DEF":
                  attr_index = 2;
                  break;
                default:
              }

              const attr_val =
                attr_index !== null
                  ? (attr?.value * curves[level]?.ratios[attr_index]?.value) /
                    10000
                  : attr?.value;

              const attr_perc = attr?.attribute?.percent;

              return (
                <>
                  <div className="py-2 px-3 justify-between flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {attr_icon ? (
                        <>
                          <div className="items-center inline-block align-middle justify-center h-full mr-1 invert-[0.3]">
                            <Image
                              height={30}
                              className="object-contain"
                              url={attr_icon}
                              options="height=30"
                              alt={attr_name ?? "Icon"}
                            />
                          </div>
                        </>
                      ) : null}
                      <span className="font-semibold text-sm inline-block align-middle">
                        {attr_name}
                      </span>
                    </div>
                    <div className="text-sm font-semibold">
                      <span className="inline-block align-middle">
                        {attr_perc == "yes"
                          ? Math.floor(attr_val) / 100 + "%"
                          : Math.floor(attr_val)}
                      </span>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </section>
      </div>
      {/* Slider */}
      <div className="my-2 flex items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-lg shadow-sm shadow-1 border border-color-sub py-1">
        <div className="mr-2 inline-flex align-middle text-zinc-200">
          <div className="text-xs mr-1 text-gray-500 self-center">Lv</div>
          <input
            className="text-lg font-bold mr-2 w-6 text-gray-600 dark:text-gray-400 self-center bg-transparent border-0 p-0"
            value={displevel}
            onChange={(event) => {
              const numonly = /^[0-9\b]+$/;
              const maxval = 90;

              // Only set the level slider value if the entered value is not blank or a Number. Parseint as well so leading 0s are removed.
              if (numonly.test(event.target.value)) {
                let input = parseInt(event.target.value);
                if (input > maxval) {
                  input = maxval;
                } else if (input < 1) {
                  input = 1;
                }
                let input_entry = curves?.findIndex(
                  (l: any) => l.level == input
                );
                setLevel(input_entry);
              }
            }}
          ></input>

          {/* ◇ ◆  Symbols */}
          <div className="flex text-md font-bold mr-2 items-center self-center rounded-full bg-zinc-500 h-3">
            {[1, 2, 3, 4, 5, 6].map((stg: any) => (
              <div
                className={`inline-block align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] ${
                  dispasc >= stg ? "text-white" : "text-black"
                }`}
              >
                ◆
              </div>
              // <Image
              //   height={15}
              //   className={`object-contain inline-block align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] ${
              //     dispasc >= stg ? "invert-[0.10]" : "invert-[0.90]"
              //   }`}
              //   url={"https://static.mana.wiki/endfield/icon_breakmark_01.png"}
              //   options="height=15"
              //   alt={">"}
              // />
            ))}
          </div>
        </div>
        <input
          aria-label="Level Slider"
          className="h-1 flex-grow appearance-none justify-end
                              rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
          type="range"
          min="0"
          max={curves.length - 1}
          value={level}
          onChange={(event) => setLevel(parseInt(event.target.value))}
        ></input>
      </div>

      {/* Description */}
      <div
        className="my-2 flex items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-lg shadow-sm shadow-1 border border-color-sub py-1 italic"
        dangerouslySetInnerHTML={{ __html: mainDesc }}
      ></div>
    </>
  );
}

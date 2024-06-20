import { useState } from "react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

const thformat =
  "p-2 leading-none text-left border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800";
const tdformat =
  "p-2 leading-none text-center border border-zinc-200 dark:border-zinc-700";

export function Stats({ data: servant }: { data: ServantType }) {
  return (
    <>
      <Table_HP_ATK data={servant} />
      <Table_NPGain_Star data={servant} />
    </>
  );
}

function Table_HP_ATK({ data: servant }: { data: ServantType }) {
  const baseatk = servant?.atk_base;
  const basehp = servant?.hp_base;
  const maxatk = servant?.atk_max;
  const maxhp = servant?.hp_max;
  const lv100atk = servant?.atk_grail;
  const lv100hp = servant?.hp_grail;
  const lv120atk = servant?.atk_lv120;
  const lv120hp = servant?.hp_lv120;

  return (
    <>
      <div className="my-1">
        <table className="text-sm w-full ">
          <tbody>
            <tr>
              <th className={thformat}>Base ATK</th>
              <td className={tdformat}>{baseatk}</td>
              <th className={thformat}>Base HP</th>
              <td className={tdformat}>{basehp}</td>
            </tr>
            <tr>
              <th className={thformat}>
                <FaArrowUp
                  className={`text-green-500 h-3 w-3 inline-block relative`}
                />{" "}
                Max ATK
              </th>
              <td className={tdformat}>{maxatk}</td>
              <th className={thformat}>
                <FaArrowUp
                  className={`text-green-500 h-3.5 w-3.5 inline-block align-middle relative`}
                />{" "}
                Max HP
              </th>
              <td className={tdformat}>{maxhp}</td>
            </tr>
            <tr>
              <th className={thformat}>
                <FaTrophy
                  className={`text-yellow-600 h-4 w-4 inline-block relative`}
                />{" "}
                Lv 100 ATK
              </th>
              <td className={tdformat}>{lv100atk}</td>
              <th className={thformat}>
                <FaTrophy
                  className={`text-yellow-600 h-4 w-4 inline-block relative`}
                />{" "}
                Lv 100 HP
              </th>
              <td className={tdformat}>{lv100hp}</td>
            </tr>
            <tr>
              <th className={thformat}>
                <FaTrophy
                  className={`text-yellow-500 h-4 w-4 inline-block relative`}
                />{" "}
                Lv 120 ATK
              </th>
              <td className={tdformat}>{lv120atk}</td>
              <th className={thformat}>
                <FaTrophy
                  className={`text-yellow-500 h-4 w-4 inline-block relative`}
                />{" "}
                Lv 120 HP
              </th>
              <td className={tdformat}>{lv120hp}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function Table_NPGain_Star({ data: servant }: { data: ServantType }) {
  // NP Gain is handled separately.
  const np_gain = servant.np_charge_per_hit; // FGObufficon_303_NPGainUp.png
  const card_np_gain = [
    {
      img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Quick.png",
      val: servant.np_per_hit_quick,
    },
    {
      img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Arts.png",
      val: servant.np_per_hit_arts,
    },
    {
      img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Buster.png",
      val: servant.np_per_hit_buster,
    },
    {
      img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Extra.png",
      val: servant.np_per_hit_extra,
    },
    {
      img: "https://static.mana.wiki/grandorder/FGOInterludeReward_NPUpgrade.png",
      val: servant.np_per_hit_np,
    },
  ];

  // Checks if at least one of the card_np_gain entries has a value
  const initStat = card_np_gain.map((a) => a.val).filter((a) => a).length > 0;

  const [showNPGainInfo, setShowNPGainInfo] = useState(false);

  // Remaining stats can tile simply.
  const others = [
    {
      icon: "https://static.mana.wiki/grandorder/FGObufficon_335_NPDamageGainUp.png",
      label: "NP when Attacked (%)",
      value: servant.np_charge_when_attacked,
    },
    {
      icon: "https://static.mana.wiki/grandorder/FGObufficon_325_StarGatherRateUp.png",
      label: "Star Absorption",
      value: servant.star_absorption,
    },
    {
      icon: "https://static.mana.wiki/grandorder/FGObufficon_321_StarDropRateUp.png",
      label: "Star Generation per Hit",
      value: servant.star_generation_rate,
    },
    {
      icon: "https://static.mana.wiki/grandorder/FGObufficon_337_DeathRateUp.png",
      label: "Instant Death Chance",
      value: servant.instant_death_chance,
    },
  ];

  return (
    <>
      <div className="mt-3 mb-1">
        <table className="text-sm w-full">
          <tbody>
            <tr>
              <th className={`w-3/4 ${thformat}`}>
                <div className="flex items-center block relative">
                  {/* Icon and label */}
                  <div className="flex-grow font-bold">
                    <div className="h-5 w-5 inline-block relative align-middle">
                      <Image
                        height={20}
                        url={
                          "https://static.mana.wiki/grandorder/FGObufficon_303_NPGainUp.png"
                        }
                        className="object-contain"
                        options="height=20"
                        alt="NPGain"
                      />
                    </div>
                    NP Gain
                  </div>

                  {/* Conditionally hidden "Show Info" button */}
                  {initStat ? (
                    <div className="flex-none">
                      <div
                        className={`${
                          showNPGainInfo
                            ? "bg-opacity-100 dark:bg-opacity-100"
                            : "bg-opacity-80 dark:bg-opacity-40"
                        } bg-blue-800 dark:border-zinc-600 dark:bg-zinc-800 rounded-sm text-white text-xs align-middle inline-block relative px-2 py-0.5 cursor-pointer`}
                        onClick={() => setShowNPGainInfo(!showNPGainInfo)}
                      >
                        Show Info
                      </div>
                    </div>
                  ) : null}
                </div>
                {showNPGainInfo ? (
                  <div className="mt-2">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          {card_np_gain.map((col: any, ind) => {
                            return (
                              <>
                                <th
                                  className={`text-center ${thformat}`}
                                  key={"stat_np_gain_" + ind}
                                >
                                  <Image
                                    height={20}
                                    url={col.img}
                                    className="inline-block object-contain"
                                    options="height=20"
                                    alt="CardType"
                                  />
                                </th>
                              </>
                            );
                          })}
                        </tr>
                        <tr>
                          {card_np_gain.map((col: any, ind) => {
                            return (
                              <>
                                <td
                                  className={`text-center ${tdformat}`}
                                  key={"stat_np_gain_value_" + ind}
                                >
                                  {col.val}%
                                </td>
                              </>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </th>
              <td className={tdformat}>{np_gain}%</td>
            </tr>

            {others?.map((row: any, ind) => {
              return (
                <>
                  <tr key={"stat_others_" + ind}>
                    <th className={thformat}>
                      <div className="h-5 w-5 inline-block relative align-middle">
                        <Image
                          height={20}
                          url={row.icon}
                          className="object-contain"
                          options="height=20"
                          alt="NPGain"
                        />
                      </div>{" "}
                      {row.label}
                    </th>
                    <td className={tdformat}>{row.value}%</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// =====================================
// For rendering Icons
// =====================================

const FaArrowUp = (props: any) => (
  <svg
    className={props.className}
    width={props.w}
    height={props.h}
    viewBox="0 0 384 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
    ></path>
  </svg>
);

const FaTrophy = (props: any) => (
  <svg
    className={props.className}
    width={props.w}
    height={props.h}
    viewBox="0 0 576 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"
    ></path>
  </svg>
);

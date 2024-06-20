import { Disclosure } from "@headlessui/react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

const thformat =
  "p-1.5 leading-none text-center border border-zinc-200 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800";
const tdformat =
  "p-1.5 leading-none text-center border border-zinc-200 dark:border-zinc-600";

export function NoblePhantasm({ data: servant }: { data: ServantType }) {
  const np = servant?.noble_phantasm_base;

  return (
    <>
      <div>
        <H2 text="Noble Phantasm" />
        <NoblePhantasmDisplay np={np} />
      </div>
    </>
  );
}

const NoblePhantasmDisplay = ({ np }: any) => {
  const np_name = np.name;
  const np_description = np.description;
  const np_overcharge = np.description_overcharge;
  const np_card_icon = np.card_type?.icon?.url;
  const np_rank = np.rank;
  const video_link =
    np.video_link?.split("=")?.[1]?.replace(/\?.*/g, "") +
    (np.video_link?.split("=")?.[2]
      ? "?start=" + np.video_link?.split("=")?.[2]
      : "");
  const np_sub = np.sub_name;
  const np_classification = np.np_classification?.name;
  const np_hit_count = np.hit_count;
  const np_effect_list = np.effect_list;
  const np_effect_list_overcharge = np.effect_list_overcharge;
  const unlock = np.unlock_condition;

  return (
    <>
      <div className="border my-3 dark:border-slate-800 border-slate-300 p-2 rounded-md bg-blue-200 bg-opacity-10">
        {/* Main Noble Phantasm Information */}
        <section>
          <div className="h-10 w-10 inline-block relative mr-2">
            <Image
              height={40}
              url={np_card_icon}
              className="object-contain"
              options="height=40"
              alt="SkillIcon"
            />
          </div>

          <div className="w-5/6 inline-block relative align-top">
            <div className="">
              <span className="font-bold mr-2">{np_name}</span>
              <span className="text-sm">{np_rank}</span>
            </div>
            {unlock ? (
              <div
                className="text-xs mb-2"
                dangerouslySetInnerHTML={{ __html: unlock }}
              ></div>
            ) : null}
            <div
              className="text-xs whitespace-pre-wrap leading-tight"
              dangerouslySetInnerHTML={{
                __html: np_description
                  .replace(/\<br\>/g, "")
                  .replace(/\<p\>\r\n/g, "<p>"),
              }}
            ></div>
            <div className="my-2 font-bold text-xs">{"<Overcharge>"}</div>
            <div
              className="text-xs whitespace-pre-wrap leading-tight"
              dangerouslySetInnerHTML={{
                __html: np_overcharge
                  .replace(/\<br\>/g, "")
                  .replace(/\<p\>\r\n/g, "<p>"),
              }}
            ></div>
          </div>
        </section>

        {/* Additional Info Accordion + Video - Show/Hide */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`font-bold text-white bg-blue-800 dark:border-zinc-600 dark:bg-zinc-800
                  mb-1 w-full border px-2 py-0.5 mt-1 rounded-md text-xs text-center ${
                    open
                      ? "bg-opacity-100 dark:bg-opacity-100"
                      : "bg-opacity-80 dark:bg-opacity-40"
                  }`}
              >
                {video_link ? "Show Info/Video Link" : "Show Info"}
                <div
                  className={`${
                    open
                      ? "transform rotate-180 text-gray-600 font-bold "
                      : "text-gray-400 "
                  } inline-block ml-auto `}
                >
                  <TiArrowSortedDown className="inline-block align-top h-4 w-4" />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="mb-1">
                <section>
                  <h3>{np_name}</h3>
                  {np_sub}

                  {/* NP Main info table */}
                  <table className="w-full">
                    <tr>
                      <td rowSpan={2} className={tdformat}>
                        <div className="h-10 w-10 inline-block relative">
                          <Image
                            height={40}
                            url={np_card_icon}
                            className="object-contain"
                            options="height=40"
                            alt="NPCardType"
                          />
                        </div>
                      </td>
                      <th className={thformat}>Rank</th>
                      <th className={thformat}>Classification</th>
                      <th className={thformat}>Hit Count</th>
                    </tr>
                    <td className={tdformat}>{np_rank}</td>
                    <td className={tdformat}>{np_classification}</td>
                    <td className={tdformat}>{np_hit_count ?? "-"}</td>
                  </table>

                  {/* Effect Table */}
                  <section>
                    <table className="w-full my-2">
                      <tr>
                        <th className={thformat}>Effect</th>
                        <td colSpan={5} className={tdformat}>
                          <div
                            className="text-sm whitespace-pre-wrap leading-tight"
                            dangerouslySetInnerHTML={{
                              __html: np_description
                                .replace(/\<br\>/g, "")
                                .replace(/\<p\>\r\n/g, "<p>"),
                            }}
                          ></div>
                        </td>
                      </tr>
                      <tr>
                        <th className={thformat}>
                          <div className="text-sm">Level</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">1</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">2</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">3</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">4</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">5</div>
                        </th>
                      </tr>

                      {np_effect_list?.map((eff: any, ei) => {
                        return (
                          <>
                            <tr key={"np_effect_list_" + ei}>
                              <th className={`text-sm ${thformat}`}>
                                {eff?.effect_display}
                              </th>

                              {[0, 1, 2, 3, 4]?.map((i: any) => {
                                return (
                                  <>
                                    <td
                                      className={`w-[15%] text-sm ${tdformat}`}
                                    >
                                      {eff.values_per_level?.[i] ?? ""}
                                    </td>
                                  </>
                                );
                              })}
                            </tr>
                          </>
                        );
                      })}
                    </table>
                  </section>

                  {/* Overcharge Effect Table */}
                  <section>
                    <table className="w-full my-2">
                      <tr>
                        <th className={thformat}>Overcharge Effect</th>
                        <td colSpan={5} className={tdformat}>
                          <div
                            className="text-sm whitespace-pre-wrap leading-tight"
                            dangerouslySetInnerHTML={{
                              __html: np_overcharge
                                .replace(/\<br\>/g, "")
                                .replace(/\<p\>\r\n/g, "<p>"),
                            }}
                          ></div>
                        </td>
                      </tr>
                      <tr>
                        <th className={thformat}>
                          <div className="text-sm">Level</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">1</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">2</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">3</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">4</div>
                        </th>
                        <th className={thformat}>
                          <div className="text-sm">5</div>
                        </th>
                      </tr>

                      {np_effect_list_overcharge?.map((eff: any, ei) => {
                        return (
                          <>
                            <tr>
                              <th
                                className={`text-sm ${thformat}`}
                                key={"np_effect_list_overcharge_" + ei}
                              >
                                {eff?.effect_display}
                              </th>

                              {[0, 1, 2, 3, 4]?.map((i: any) => {
                                return (
                                  <>
                                    <td
                                      className={`w-[15%] text-sm ${tdformat}`}
                                    >
                                      {eff.values_per_level?.[i] ?? ""}
                                    </td>
                                  </>
                                );
                              })}
                            </tr>
                          </>
                        );
                      })}
                    </table>
                  </section>

                  {video_link ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${video_link}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    ></iframe>
                  ) : null}
                </section>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>

      {np.np_upgrades?.map((npupg: any) => {
        return <NoblePhantasmDisplay np={npupg} />;
      })}
    </>
  );
};

// =====================================
// For rendering Icons
// =====================================

const TiArrowSortedDown = (props: any) => (
  <svg
    className={props.className}
    height={props.h}
    width={props.w}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
  >
    <path
      fill="currentColor"
      d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
    />
  </svg>
);

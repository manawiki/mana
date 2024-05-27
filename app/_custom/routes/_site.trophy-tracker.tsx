// Track Achievements using Local Storage on this page!
// Note all achievements and subcategories / total roll currency rewards will be included if possible.

import { useRef, useEffect, useState } from "react";
import { Disclosure, Combobox } from "@headlessui/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Icon } from "~/components/Icon";

import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
import { fetchWithCache } from "~/utils/cache.server";

export async function loader({
  context: { payload },
  params,
  request,
}: LoaderFunctionArgs) {
  let url = `http://localhost:4000/api/trophies?limit=5000&sort=id`;
  const trophyRaw = await fetchWithCache(url);
  const trophies = trophyRaw.docs;

  url = `http://localhost:4000/api/trophy-groups?limit=500`;
  const trophyGroupRaw = await fetchWithCache(url);
  const trophyGroups = trophyGroupRaw.docs;

  url = `http://localhost:4000/api/trophy-categories?limit=200`;
  const trophyCategoryRaw = await fetchWithCache(url);
  const trophyCategories = trophyCategoryRaw.docs;

  // Get the image URL reference for the Stellar Jade icon lol.
  //   url = `http://localhost:4000/api/images/ItemIcon_900001`;
  //   const sjRaw = await fetchWithCache(url);
  //   const stellarJadeURL = sjRaw?.url;

  return json({ trophies, trophyGroups, trophyCategories });
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "Trophy Tracker - Wuthering Waves",
    },
    {
      name: "description",
      content: "A new kind of wiki",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

const AchievementTracker = (data: any) => {
  const { trophies, trophyGroups, trophyCategories } =
    useLoaderData<typeof loader>();

  const fulldata = {
    Trophies: trophies,
    TrophyGroups: trophyGroups,
    TrophyCategories: trophyCategories,
  };

  const trophyById = trophies.reduce((acc: any, cur: any) => {
    acc[cur.id] = cur;
    return acc;
  }, {});

  const [localTrophies, setLocalTrophies] = useState(() => {
    if (typeof window !== "undefined") { // correct?
      const localData = localStorage.getItem("trophies");
      return localData ? JSON.parse(localData) :
        { ...trophies.reduce((acc: any, cur: any) => {
          acc[cur.id] = false;
          return acc;
      }, {}) };
    }
  });

  useEffect(() => {
    localStorage.setItem("trophies", JSON.stringify(localTrophies));
  }, [localTrophies]);

  const getTrophy = (id: string) => {
    return localTrophies[id];
  }

  const updateTrophy = (id: string) => {
    setLocalTrophies({ ...localTrophies, [id]: !localTrophies[id] });
  }

  const [currgid, setCurrgid] = useState("0");
  const [refresh, setRefresh] = useState(false);

  const [toggleView, setToggleView] = useState(false);

  const [width, setWidth] = useState(760);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    setWidth(window.innerWidth);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [currgid]);
  const isMobile = width <= 768;
  // const isMobile = false;

  return (
    <>
      <div className="laptop:mt-1 mt-14"></div>
      <H2 text="Trophy Tracker" />

      <div className="grid laptop:grid-cols-3 gap-2 grid-cols-1">
        {!isMobile || !toggleView ? (
          <div
            style={{ height: "calc(100vh - 160px)" }}
            className="overflow-y-scroll w-full "
          >
            <GroupList
              data={fulldata}
              currgid={currgid}
              setCurrgid={setCurrgid}
              refresh={refresh}
              toggleView={toggleView}
              setToggleView={setToggleView}
            />
          </div>
        ) : null}

        {!isMobile || toggleView ? (
          <div
            style={{ height: "calc(100vh - 160px)" }}
            className="laptop:col-span-2 overflow-y-scroll w-full "
          >
            <Achievements
              data={fulldata}
              getTrophy={getTrophy}
              updateTrophy={updateTrophy}
              currgid={currgid}
              refresh={refresh}
              setRefresh={setRefresh}
              toggleView={toggleView}
              setToggleView={setToggleView}
              isMobile={isMobile}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

function GroupList({
  data,
  currgid,
  setCurrgid,
  refresh,
  toggleView,
  setToggleView,
}: any) {
  const groups = data.TrophyGroups;
  const trophies = data.Trophies;

  return (
    <div className="mb-3 grid w-full gap-3">
      {groups?.map((g, i) => {
        // Counts total number of completed achievements per group
        const [groupCompleted, setGroupCompleted] = useState(0);

        useEffect(() => {
          //We're saving achievement to local stage, so read initial value from local state
          setGroupCompleted(
            localStorage.getItem("WuWa_manawiki_group-" + g?.id) ?? "0"
          );
        }, [refresh]);

        // Count total number of achievements in this group
        const trophylist = trophies.filter((a: any) => a.group?.id == g?.id);
        const trophynum = trophylist.length;

        return (
          <>
            <div
              key={i}
              //   prefetch="intent"
              //   to={`/c/trophy-groups/${g.id}`}
              onClick={() => {
                setCurrgid(g?.id);
                setToggleView(!toggleView);
              }}
              className="shadow-1 border-color-sub relative inline-block overflow-hidden rounded-lg border text-center shadow-sm cursor-pointer"
            >
              <div
                className={`${g.id == currgid
                    ? "bg-slate-600 dark:bg-slate-500"
                    : "bg-zinc-500 dark:bg-zinc-600"
                  } hover:bg-opacity-50 dark:hover:bg-opacity-50 relative flex w-full h-full items-center justify-between px-2 py-1 `}
              >
                <div className="relative flex-none h-8 w-8 text-center">
                  <Image
                    options="aspect_ratio=1:1&height=120&width=120"
                    alt="Gallery Item"
                    url={g.icon?.url}
                    className="object-contain"
                  />
                </div>
                <div className="text-white relative px-2 text-center text-base w-full">
                  {g.name}
                </div>
                <div className="text-right text-white">
                  {groupCompleted}/{trophynum}
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

function Achievements({
  data,
  getTrophy,
  updateTrophy,
  currgid,
  refresh,
  setRefresh,
  toggleView,
  setToggleView,
  isMobile,
}: any) {
  const trophies = data.Trophies;
  return (
    <>
      {isMobile ? (
        <>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-color-sub cursor-pointer mb-2"
            onClick={() => setToggleView(!toggleView)}
          >
            <Icon name="arrow-left" className="text-zinc-500" size={20} />
          </div>
        </>
      ) : null}
      {trophies?.map((ac: any) => {
        const [checked, setChecked] = useState(false);

        useEffect(() => {
          setChecked(getTrophy(ac?.id));
        }, [ac?.id]);

        return (
          <>
            {ac?.group?.id == currgid ? (
              <>
                <div className="shadow-1 border-color-sub relative flex overflow-hidden rounded-lg border text-left shadow-sm mb-2 px-3 py-2 items-center">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex w-full items-center">
                      {/* Checkbox section */}
                      <div
                        className={`shadow-1 flex h-8 w-8 flex-none cursor-pointer items-center
                    justify-center rounded-lg border shadow shadow-1 bg-white dark:bg-dark500 hover:bg-green-50 dark:hover:bg-dark400 ${checked
                            ? "border-green-300 dark:border-green-800"
                            : "border-zinc-200 dark:border-zinc-500"
                          }`}
                        onClick={() => {
                          updateTrophy(ac?.id);

                          const cgroupnum = parseInt(
                            localStorage.getItem(
                              "WuWa_manawiki_group-" + currgid
                            )
                          )
                            ? parseInt(
                              localStorage.getItem(
                                "WuWa_manawiki_group-" + currgid
                              )
                            )
                            : 0;
                          !checked
                            ? localStorage.setItem(
                              "WuWa_manawiki_group-" + currgid,
                              (cgroupnum + 1).toString()
                            )
                            : localStorage.setItem(
                              "WuWa_manawiki_group-" + currgid,
                              (cgroupnum - 1).toString()
                            );

                          setRefresh(!refresh);
                          setChecked(!checked);
                        }}
                      >
                        {checked ? <div>✔</div> : <></>}
                      </div>

                      {/* Achievement Name and Description */}
                      <div className="items-center ml-3">
                        <div className="text-sm font-bold dark:text-yellow-50 text-yellow-900 mb-1">
                          {ac?.name}
                        </div>
                        <div className="text-sm dark:text-zinc-400 text-zinc-600">
                          {ac?.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex ">
                      {ac?.rewards?.map((rew: any) => {
                        return (
                          <>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-color-sub mx-1">
                              <Image
                                options="aspect_ratio=1:1&height=80&width=80"
                                className="object-contain"
                                url={rew.item?.icon?.url}
                                alt={rew.item?.name}
                                loading="lazy"
                              />
                            </div>
                            <div className="flex items-center text-xl">
                              x{rew.cnt}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </>
        );
      })}
    </>
  );
}

export default AchievementTracker;

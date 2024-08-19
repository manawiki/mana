import { Fragment } from "react";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Link, useLoaderData } from "@remix-run/react";
//@ts-ignore
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import clsx from "clsx";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { LogoText } from "~/components/Logo";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import type { Site } from "~/db/payload-types";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { useTheme } from "~/utils/client-hints";

import { Contributors } from "./Contributors";
import { AdUnit } from "./RampUnit";
import { DarkModeToggle } from "../action+/theme-toggle";

function AboutSection({
   site,
   hasTrending,
}: {
   site: Site;
   hasTrending: boolean;
}) {
   return (
      <div
         className={clsx(
            hasTrending ? "mx-4 py-4" : "laptop:px-4",
            "relative max-tablet:px-4 z-20 space-y-3 w-auto tablet:w-[728px] laptop:w-auto max-laptop:mx-auto",
         )}
      >
         {site?.banner && (
            <section
               className="flex items-center rounded-lg
      justify-center overflow-hidden shadow dark:shadow-zinc-800 relative z-20"
            >
               <Image
                  height={600}
                  url={site?.banner?.url}
                  options="aspect_ratio=1.9:1"
                  alt="Site Banner"
                  loading="lazy"
               />
            </section>
         )}
         <div
            className={clsx(
               hasTrending ? "" : "border-b pt-2 pb-5 border-color",
               "space-y-1",
            )}
         >
            <div
               className="font-header
             font-bold relative flex items-center gap-1.5 z-20"
            >
               {site.status === "verified" && (
                  <Tooltip placement="top">
                     <TooltipTrigger>
                        <Icon
                           name="badge-check"
                           size={16}
                           className="text-teal-500"
                        />
                     </TooltipTrigger>
                     <TooltipContent>Verified</TooltipContent>
                  </Tooltip>
               )}
               {site.name}
            </div>
            {site.about && <div className="text-xs text-1">{site.about}</div>}
         </div>
      </div>
   );
}

export function ColumnFour() {
   const { site } = useLoaderData<typeof siteLoaderType>() || {};
   const theme = useTheme();

   //@ts-ignore
   const trendingPages = (site?.trendingPages || []).slice(0, 50);
   const groupedTrendingPages = [];

   //@ts-ignore
   for (let i = 0; i < trendingPages.length; i += 10) {
      //@ts-ignore
      groupedTrendingPages.push(trendingPages.slice(i, i + 10));
   }

   return (
      <section className="relative laptop:z-50 laptop:block">
         {site.enableAds && (
            <div className="laptop:hidden border-t border-color-sub bg-zinc-50 dark:bg-dark350 px-4 py-6">
               <AdUnit
                  className="h-[250px] w-[300px] tablet:h-[90px] tablet:w-[728px] laptop:h-[250px] laptop:w-[300px] 
                  flex-none mx-auto rounded-lg relative"
                  enableAds={site.enableAds}
                  adType={{
                     mobile: "med_rect_btf",
                     tablet: "leaderboard_btf",
                  }}
                  selectorId="mobile-tablet-btf"
               />
            </div>
         )}
         <div
            className="flex flex-col laptop:fixed laptop:border-l laptop:shadow-sm laptop:shadow-1 
            h-full bg-2-sub laptop:bg-2 border-color laptop:w-[334px] justify-between relative
             max-laptop:bg-2-sub max-laptop:border-t max-laptop:border-color-sub"
         >
            <div>
               <section className="grid grid-cols-3 gap-4 py-4 relative z-20 max-laptop:max-w-[728px] max-tablet:px-4 max-laptop:mx-auto mx-4 max-laptop:w-full">
                  <div className="dark:bg-bg3Dark bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                     <div className="text-xs font-bold text-center">
                        {site.followers ? site.followers : "-"}
                     </div>
                     <div className="text-xs text-1 text-center">Followers</div>
                  </div>
                  <div className="dark:bg-bg3Dark bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                     <div className="text-xs font-bold text-center">
                        {site.totalPosts ? site.totalPosts : "-"}
                     </div>
                     <div className="text-xs text-1 text-center">Posts</div>
                  </div>
                  <div className="dark:bg-bg3Dark bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                     <div className="text-xs text-center font-bold">
                        {site.totalEntries ? site.totalEntries : "-"}
                     </div>
                     <div className="text-xs text-center text-1">Entries</div>
                  </div>
               </section>
               {groupedTrendingPages.length == 0 ? (
                  <AboutSection site={site} hasTrending={false} />
               ) : undefined}
               <Contributors site={site} />
               <span
                  className="bg-gradient-to-t dark:from-bg3Dark dark:laptop:from-bg2Dark dark:to-transparent 
                           from-white laptop:from-zinc-50 to-transparent w-full h-full absolute top-0 left-0 z-10"
               />
               <div
                  className="pattern-dots absolute left-0 top-0 z-0 h-full
                           w-full pattern-bg-white pattern-zinc-500 pattern-opacity-10 
                           pattern-size-2 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
               />
            </div>
            {/* Desktop Right Sidebar 300x250 */}
            <AdUnit
               className={clsx(
                  groupedTrendingPages.length == 0
                     ? "laptop:mb-[72px] my-6"
                     : "mb-6 max-laptop:mt-3 laptop:mb-4",
                  "max-laptop:hidden laptop:h-[250px] laptop:w-[300px] flex-none mx-auto laptop:mt-2 rounded-lg z-20 laptop:z-40 relative",
               )}
               enableAds={site.enableAds}
               adType={{
                  desktop: "med_rect_atf",
               }}
               selectorId="sidebar-med-rect-atf"
            />
            {groupedTrendingPages.length > 0 ? (
               <>
                  <TabGroup className="flex-grow overflow-auto max-h-[652px] z-20">
                     <TabList
                        className="grid grid-cols-2 py-2 bg-white dark:bg-dark400 dark:laptop:bg-bg3Dark/80 sticky top-0 
                  border-y dark:border-zinc-600/50 dark:laptop:border-zinc-700/30 dark:divide-zinc-600/50 dark:laptop:divide-zinc-700 laptop:border-color divide-x laptop:divide-color z-10"
                     >
                        <Tab as={Fragment}>
                           {({ selected }) => (
                              <button className="dark:data-[selected]:text-white hover:text-light dark:hover:text-dark text-1 focus:outline-none flex items-center justify-center gap-1.5 px-2 py-1 relative">
                                 <Icon
                                    name="flame"
                                    className="dark:text-zinc-400 text-zinc-500"
                                    size={14}
                                 />
                                 <span className="text-sm font-bold">
                                    Trending
                                 </span>
                                 {selected && (
                                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-zinc-200 dark:bg-dark500 rounded-t ml-1 w-24 h-1"></span>
                                 )}
                              </button>
                           )}
                        </Tab>
                        <Tab as={Fragment}>
                           {({ selected }) => (
                              <button className="dark:data-[selected]:text-white hover:text-light dark:hover:text-dark text-1 focus:outline-none flex items-center justify-center gap-1.5 px-2 py-1 relative">
                                 <Icon
                                    name="info"
                                    className="dark:text-zinc-400 text-zinc-500"
                                    size={14}
                                 />
                                 <span className="text-sm font-bold">
                                    About
                                 </span>
                                 {selected && (
                                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-zinc-200 dark:bg-dark500 rounded-t ml-1 w-24 h-1"></span>
                                 )}
                              </button>
                           )}
                        </Tab>
                     </TabList>
                     <TabPanels>
                        <TabPanel>
                           {groupedTrendingPages && (
                              <Splide
                                 hasTrack={false}
                                 options={{
                                    perPage: 1,
                                    rewind: true,
                                    classes: {
                                       page: "splide__pagination__page [&.is-active]:bg-zinc-500 [&.is-active]:dark:bg-zinc-300 bg-zinc-300 dark:bg-zinc-500 size-2.5 rounded-lg",
                                    },
                                 }}
                                 className="relative overflow-auto pt-1.5 laptop:pt-2.5 laptop:pb-[100px]"
                                 aria-label="Trending Pages"
                              >
                                 <SplideTrack>
                                    {groupedTrendingPages.map((row) => (
                                       <SplideSlide
                                          className="space-y-1.5"
                                          key={row.path}
                                       >
                                          {row.map((nestedRow: any) => (
                                             <Link
                                                key={nestedRow.path}
                                                to={nestedRow.path}
                                                className="flex items-center tablet:rounded-lg dark:laptop:hover:bg-dark350 max-laptop:mx-auto
                                          gap-2.5 p-1.5 group bg-white hover:bg-zinc-200/50 dark:bg-dark400 shadow-sm shadow-zinc-100
                                          dark:laptop:shadow-zinc-800 dark:shadow-zinc-700/80 dark:laptop:bg-bg3Dark max-laptop:w-[728px] laptop:w-[310px] laptop:ml-3 dark:hover:bg-dark450"
                                             >
                                                <div className="size-8 flex items-center justify-center flex-none">
                                                   {nestedRow.data?.icon
                                                      ?.url ? (
                                                      <Image
                                                         width={80}
                                                         height={80}
                                                         url={
                                                            nestedRow.data?.icon
                                                               ?.url
                                                         }
                                                         options="aspect_ratio=1:1"
                                                         alt=""
                                                         loading="lazy"
                                                      />
                                                   ) : (
                                                      <Icon
                                                         name="component"
                                                         className="dark:text-zinc-500 text-zinc-400 mx-auto"
                                                         size={16}
                                                      />
                                                   )}
                                                </div>
                                                <div className="text-sm font-semibold">
                                                   {nestedRow.data.name}
                                                </div>
                                             </Link>
                                          ))}
                                       </SplideSlide>
                                    ))}
                                 </SplideTrack>
                                 <div
                                    className="splide__arrows bg-gradient-to-t dark:laptop:from-bg2Dark laptop:to-bg2Dark/20 flex items-center justify-between 
                           w-full laptop:w-[333px] gap-1.5 px-3 laptop:fixed laptop:bottom-[54px] right-0 z-30"
                                 >
                                    <Button
                                       plain
                                       className="splide__arrow splide__arrow--prev !p-1"
                                    >
                                       <Icon name="chevron-left" size={18} />
                                    </Button>
                                    <ul className="splide__pagination flex items-center gap-2.5 py-4"></ul>
                                    <Button
                                       plain
                                       className="splide__arrow splide__arrow--next !p-1"
                                    >
                                       <Icon name="chevron-right" size={18} />
                                    </Button>
                                 </div>
                              </Splide>
                           )}
                        </TabPanel>
                        <TabPanel>
                           <AboutSection site={site} hasTrending={true} />
                        </TabPanel>
                     </TabPanels>
                  </TabGroup>
               </>
            ) : undefined}
            <div className="max-laptop:py-5 border-t border-color h-[54px] bg-2 flex items-center px-3.5 laptop:w-[333px] z-40 laptop:fixed bottom-0 right-0">
               <div className="justify-between w-full flex items-center max-laptop:max-w-[728px] mx-auto gap-3">
                  {!site.isWhiteLabel && (
                     <Link
                        to="https://mana.wiki"
                        className="flex items-center gap-1.5 justify-start laptop:justify-end group"
                     >
                        <span className="dark:text-zinc-500 text-zinc-400 text-xs font-semibold">
                           Powered by
                        </span>
                        <LogoText className="w-12 text-1 group-hover:dark:text-zinc-300 group-hover:text-zinc-600" />
                     </Link>
                  )}
                  {site.isWhiteLabel &&
                     site?.logoDarkImage?.url &&
                     site?.logoLightImage?.url &&
                     site?.logoURL && (
                        <Link
                           to={site?.logoURL}
                           className="flex-grow flex items-center justify-start"
                        >
                           <Image
                              className="object-contain flex-grow text-left h-6 max-w-[140px]"
                              width={280}
                              height={48}
                              url={
                                 theme === "light"
                                    ? site?.logoLightImage?.url
                                    : site?.logoDarkImage?.url
                              }
                           />
                        </Link>
                     )}
                  <div className="flex items-center gap-4 text-xs text-1">
                     <DarkModeToggle className="!size-3.5" />
                     <LoggedOut>
                        <Link
                           to="/join"
                           className="group relative inline-flex h-7 items-center justify-center overflow-hidden flex-none
                           rounded-lg laptop:rounded-md px-2.5 font-medium text-indigo-600 transition duration-300 ease-out shadow-sm shadow-1"
                        >
                           <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                           <span
                              className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                              rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                           ></span>
                           <span className="relative text-xs laptop:text-[10px] font-bold text-white uppercase">
                              Sign up
                           </span>
                        </Link>
                     </LoggedOut>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { Logo } from "~/components/Logo";
import { LoggedOut } from "~/modules/auth";
import { NewSiteModal } from "./action+/new-site-modal";
import { MobileUserMenu } from "~/components/MobileUserMenu";
import { ChevronRight, Search } from "lucide-react";
import {
   ChatBubbleLeftIcon,
   CircleStackIcon,
   PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { Image } from "~/components/Image";

export async function loader({
   context: { user, payload },
   request,
}: LoaderArgs) {
   if (user) {
      return redirect("/home");
   }
   const featuredSites = await payload.find({
      collection: "sites",
      where: {
         featured: {
            equals: true,
         },
      },
   });
   return json({ featuredSites });
}

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

export default function HomeRoot() {
   const { t } = useTranslation(handle?.i18n);
   const location = useLocation();
   const { featuredSites } = useLoaderData<typeof loader>();

   return (
      <>
         <div className="auto-cols-[86px_1fr_334px] laptop:grid laptop:min-h-screen laptop:grid-flow-col">
            <section
               className="bg-1 border-color relative z-40 max-laptop:fixed
               max-laptop:top-0 max-laptop:w-full max-laptop:border-b
               max-laptop:py-3 laptop:border-r"
            >
               <div
                  className="justify-between max-laptop:flex max-laptop:items-center max-laptop:gap-3 max-laptop:px-3 laptop:fixed 
                  laptop:left-0 laptop:top-0 laptop:h-full laptop:w-[86px] laptop:overflow-y-auto laptop:py-3"
               >
                  <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3.5">
                     <Link
                        to="/"
                        className="bg-3 shadow-1 mx-auto flex h-12 w-12
                        items-center justify-center rounded-full font-logo shadow-sm
                        transition duration-300 active:translate-y-0.5
                       laptop:h-14 laptop:w-14"
                     >
                        <Logo className="h-6 w-6 laptop:h-7 laptop:w-7" />
                     </Link>
                     <div className="h-8 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 laptop:hidden"></div>
                     <div className="mx-auto mt-4 h-0.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 max-laptop:hidden"></div>
                     <NewSiteModal />
                  </div>
                  <MobileUserMenu />
               </div>
            </section>
            <section className="bg-3 max-laptop:min-h-screen">
               <div className="relative">
                  <div
                     className="pattern-dots absolute left-0
                   top-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 pattern-size-4 dark:pattern-bg-black dark:pattern-zinc-500"
                  ></div>
                  <div className="relative mx-auto max-w-[940px] px-4">
                     <section
                        className="bg-2 border-color shadow-1 rounded-b-2xl border border-t-0 px-6
                    pb-5 pt-3 shadow-sm max-laptop:mt-[73px]"
                     >
                        <div className="flex items-center justify-between">
                           <Link to="/" className="font-logo text-3xl">
                              mana
                           </Link>
                           <div className="flex items-center gap-2 pt-1">
                              <a
                                 href="https://discord.gg/manawiki"
                                 target="_blank"
                                 rel="noreferrer"
                                 className="flex h-8 w-8 items-center justify-center text-zinc-400/60 dark:text-zinc-500"
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                 >
                                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                                 </svg>
                              </a>
                              <a
                                 href="https://github.com/manawiki"
                                 target="_blank"
                                 rel="noreferrer"
                                 className="flex h-8 w-8 items-center justify-center text-zinc-400/60 dark:text-zinc-500"
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                 >
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                 </svg>
                              </a>
                           </div>
                        </div>
                     </section>
                     <section className="pb-12 pt-16">
                        <div className="pb-5 text-center font-header text-3xl font-bold laptop:text-4xl">
                           The{" "}
                           <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                              all-in-one
                           </span>{" "}
                           wiki platform
                        </div>
                        <div className="text-1 text-center text-lg">
                           Mana gives you the power to{" "}
                           <span
                              className="font-semibold text-gray-500 underline
                           decoration-blue-400 underline-offset-4 dark:text-gray-300"
                           >
                              build a better wiki
                           </span>{" "}
                           for your community
                        </div>
                     </section>
                     <div className="grid gap-6 pb-24 tablet:grid-cols-2 laptop:grid-cols-3">
                        <section
                           className="bg-3 border-color shadow-1 h-36 rounded-lg border bg-gradient-to-t
                         from-white to-emerald-50/60 p-6 shadow-sm
                           dark:from-emerald-900/5 dark:to-emerald-900/10"
                        >
                           <div className="flex items-center gap-3 pb-3 font-bold">
                              <PencilSquareIcon className="h-6 w-6 text-emerald-500" />
                              <span>Posts</span>
                           </div>
                           <div className="text-1">
                              Lorem ipsum dolor sit amet, consectetur
                           </div>
                        </section>
                        <section
                           className="bg-3 border-color shadow-1 h-36 rounded-lg border bg-gradient-to-t
                           from-white to-yellow-50/60 p-6 shadow-sm
                             dark:from-yellow-900/5 dark:to-yellow-900/10"
                        >
                           <div className="flex items-center gap-3 pb-3 font-bold">
                              <CircleStackIcon className="h-6 w-6 text-yellow-500" />
                              <span>Collections</span>
                           </div>
                           <div className="text-1">
                              Lorem ipsum dolor sit amet, consectetur{" "}
                           </div>
                        </section>
                        <section
                           className="bg-3 border-color shadow-1 h-36 rounded-lg border bg-gradient-to-t
                           from-white to-purple-50/60 p-6 shadow-sm
                             dark:from-purple-900/5 dark:to-purple-900/10"
                        >
                           <div className="flex items-center gap-3 pb-3 font-bold">
                              <ChatBubbleLeftIcon className="h-6 w-6 text-purple-500" />
                              <span>Discussions</span>
                           </div>
                           <div className="text-1">
                              Lorem ipsum dolor sit amet, consectetur{" "}
                           </div>
                        </section>
                     </div>
                  </div>
               </div>
               <div className="-mt-8 flex items-center justify-between">
                  <span className="border-color flex-grow border-t" />
                  <div
                     className="shadow-1 bg-2 border-color relative flex h-16 w-[92%]
                     max-w-[740px] items-center justify-between rounded-xl border px-5 shadow-sm laptop:w-full"
                  >
                     <input
                        className="h-16 w-full bg-transparent focus:outline-none"
                        placeholder="Find a community..."
                     />
                     <Search className="text-1" size={24} />
                  </div>
                  <span className="border-color flex-grow border-t" />
               </div>
            </section>
            <section
               className="bg-2 border-color relative max-laptop:mx-auto max-laptop:max-w-[728px]
               max-laptop:pb-20 tablet:border-x laptop:border-l laptop:border-r-0"
            >
               <div className="flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto">
                  <LoggedOut>
                     <div className="grid grid-cols-2 gap-4 p-4 max-laptop:hidden">
                        <Link
                           to="/join"
                           className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-5 
                           py-2 font-medium text-indigo-600 transition duration-300 ease-out"
                        >
                           <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                           <span
                              className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                           rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                           ></span>
                           <span className="relative text-sm font-bold text-white">
                              {t("login.signUp", { ns: "auth" })}
                           </span>
                        </Link>
                        <Link
                           className="border-color bg-3 shadow-1 flex h-10 items-center
                           justify-center rounded-full border text-center text-sm
                           font-bold shadow-sm"
                           to={`/login?redirectTo=${location.pathname}`}
                        >
                           {t("login.action", { ns: "auth" })}
                        </Link>
                     </div>
                  </LoggedOut>
                  <div className="flex-grow">
                     {featuredSites?.docs.length === 0 ? null : (
                        <>
                           <section className="border-color border-t">
                              <div
                                 className="text-1
                                 p-3 pt-6 text-xs font-bold uppercase"
                              >
                                 Featured sites
                              </div>
                              <div className="bg-2 border-color divide-color divide-y border-y">
                                 {featuredSites?.docs.map((site) => (
                                    <Link
                                       key={site.id}
                                       to={`${
                                          site.type == "custom"
                                             ? `https://mana.wiki/${site.slug}`
                                             : `/${site.slug}`
                                       }`}
                                       className="group flex items-center justify-between gap-3 p-3"
                                    >
                                       <div className="text-1 flex items-center gap-2.5">
                                          <span
                                             className="shadow-1 bg-3 h-8 w-8 
                                             overflow-hidden rounded-full shadow-sm"
                                          >
                                             <Image
                                                options="fit=crop,width=60,height=60 ,gravity=auto"
                                                alt="Site Icon"
                                                //@ts-expect-error
                                                url={site?.icon?.url}
                                             />
                                          </span>
                                          <span className="text-sm font-bold group-hover:underline">
                                             {site.name}
                                          </span>
                                       </div>
                                       <ChevronRight size={18} />
                                    </Link>
                                 ))}
                              </div>
                           </section>
                        </>
                     )}
                  </div>
                  <div
                     className="border-color max-laptop:bg-2 flex h-14 items-center justify-between 
                     border-y pl-5 pr-3 laptop:border-b-0"
                  >
                     <Link className="pb-1 font-logo text-2xl" to="/">
                        mana
                     </Link>
                     <div className="flex-none">
                        <DarkModeToggle />
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
}

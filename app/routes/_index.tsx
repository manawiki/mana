import { LoaderArgs, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { Logo } from "~/components/Logo";
import { LoggedOut } from "~/modules/auth";
import { NewSiteModal } from "./action.new-site-modal";
import { MobileUserMenu } from "~/components/MobileUserMenu";
import { ChevronRight, Github, Home, Search } from "lucide-react";
import {
   ChatBubbleLeftIcon,
   CircleStackIcon,
   HomeIcon,
   PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { Image } from "~/components/Image";

export async function loader({
   context: { user, payload },
   request,
}: LoaderArgs) {
   //If subdomain, we want to make /siteId the root
   const host = new URL(request.url).hostname;
   const isSubdomain = host.split(".").length > 2;
   if (
      process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT != "local" &&
      isSubdomain
   ) {
      const subDomain = host.split(".")[0];
      const result = await payload.find({
         collection: "sites",
         where: {
            subdomain: {
               equals: subDomain,
            },
         },
      });
      const siteId = result.docs[0].id;
      return redirect(`/${siteId}`, 301);
   }
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
         <div className="laptop:grid laptop:min-h-screen auto-cols-[86px_1fr_334px] laptop:grid-flow-col">
            <section
               className="bg-1 relative z-40 border-r border-color-1
               max-laptop:fixed max-laptop:top-0 max-laptop:w-full
               max-laptop:py-3 max-laptop:border-b"
            >
               <div
                  className="max-laptop:flex max-laptop:items-center laptop:fixed laptop:top-0 laptop:left-0 laptop:py-3 
                  laptop:h-full laptop:w-[86px] justify-between laptop:overflow-y-auto max-laptop:px-3 max-laptop:gap-3"
               >
                  <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3.5">
                     <Link
                        to="/"
                        className="flex h-12 w-12 items-center justify-center rounded-full
                        transition duration-300 font-logo bg-4 mx-auto
                        active:translate-y-0.5 shadow-1 shadow-sm
                       laptop:h-14 laptop:w-14"
                     >
                        <Logo className="w-6 h-6 laptop:h-7 laptop:w-7" />
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
                     className="pattern-dots pattern-zinc-400 dark:pattern-zinc-500
                   pattern-bg-white dark:pattern-bg-black
                     pattern-size-4 pattern-opacity-10 absolute top-0 left-0 w-full h-full"
                  ></div>
                  <div className="max-w-[940px] px-4 mx-auto relative">
                     <section
                        className="pt-3 px-6 pb-5 shadow-sm rounded-b-2xl border-t-0 bg-2
                    border border-color shadow-1 max-laptop:mt-[73px]"
                     >
                        <div className="flex items-center justify-between">
                           <Link to="/" className="text-3xl font-logo">
                              mana
                           </Link>
                           <div className="flex items-center gap-2 pt-1">
                              <a
                                 href="https://discord.gg/manawiki"
                                 target="_blank"
                                 rel="noreferrer"
                                 className="dark:text-zinc-500 text-zinc-400/60 w-8 h-8 flex items-center justify-center"
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
                                 className="dark:text-zinc-500 text-zinc-400/60 w-8 h-8 flex items-center justify-center"
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
                        <div className="text-3xl laptop:text-4xl font-header text-center pb-5 font-bold">
                           The{" "}
                           <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                              all-in-one
                           </span>{" "}
                           wiki platform
                        </div>
                        <div className="text-lg text-center text-1">
                           Mana gives you the power to{" "}
                           <span
                              className="underline text-gray-500 dark:text-gray-300
                           underline-offset-4 decoration-blue-400 font-semibold"
                           >
                              build a better wiki
                           </span>{" "}
                           for your community
                        </div>
                     </section>
                     <div className="gap-6 grid tablet:grid-cols-2 pb-24 laptop:grid-cols-3">
                        <section
                           className="h-36 rounded-lg bg-3 border border-color shadow-sm bg-gradient-to-t
                         from-white to-emerald-50/60 dark:from-emerald-900/5 dark:to-emerald-900/10
                           shadow-1 p-6"
                        >
                           <div className="flex items-center gap-3 font-bold pb-3">
                              <PencilSquareIcon className="w-6 h-6 text-emerald-500" />
                              <span>Posts</span>
                           </div>
                           <div className="text-1">
                              Lorem ipsum dolor sit amet, consectetur
                           </div>
                        </section>
                        <section
                           className="h-36 rounded-lg bg-3 border border-color shadow-sm bg-gradient-to-t
                           from-white to-yellow-50/60 dark:from-yellow-900/5 dark:to-yellow-900/10
                             shadow-1 p-6"
                        >
                           <div className="flex items-center gap-3 font-bold pb-3">
                              <CircleStackIcon className="w-6 h-6 text-yellow-500" />
                              <span>Collections</span>
                           </div>
                           <div className="text-1">
                              Lorem ipsum dolor sit amet, consectetur{" "}
                           </div>
                        </section>
                        <section
                           className="h-36 rounded-lg bg-3 border border-color shadow-sm bg-gradient-to-t
                           from-white to-purple-50/60 dark:from-purple-900/5 dark:to-purple-900/10
                             shadow-1 p-6"
                        >
                           <div className="flex items-center gap-3 font-bold pb-3">
                              <ChatBubbleLeftIcon className="w-6 h-6 text-purple-500" />
                              <span>Discussions</span>
                           </div>
                           <div className="text-1">
                              Lorem ipsum dolor sit amet, consectetur{" "}
                           </div>
                        </section>
                     </div>
                  </div>
               </div>
               <div className="flex items-center justify-between -mt-8">
                  <span className="border-t border-color-1 flex-grow" />
                  <div
                     className="px-5 h-16 flex items-center justify-between relative shadow-1
                     border w-[92%] laptop:w-full max-w-[740px] bg-2 border-color shadow-sm rounded-xl"
                  >
                     <input
                        className="bg-transparent h-16 w-full focus:outline-none"
                        placeholder="Find a community..."
                     />
                     <Search className="text-1" size={24} />
                  </div>
                  <span className="border-t border-color-1 flex-grow" />
               </div>
            </section>
            <section
               className="bg-2 border-color-1 relative max-laptop:mx-auto laptop:border-l
               max-laptop:max-w-[728px] max-laptop:pb-20 tablet:border-x laptop:border-r-0"
            >
               <div className="flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto">
                  <LoggedOut>
                     <div className="max-laptop:hidden grid grid-cols-2 gap-4 p-4">
                        <Link
                           to="/join"
                           className="relative inline-flex items-center justify-center p-4 px-5 py-2 overflow-hidden font-medium 
                           text-indigo-600 transition duration-300 ease-out rounded-full group"
                        >
                           <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                           <span
                              className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left 
                           transform rotate-45 translate-x-24 bg-teal-500 rounded-full opacity-30 group-hover:rotate-90 ease"
                           ></span>
                           <span className="relative text-white font-bold text-sm">
                              {t("login.signUp", { ns: "auth" })}
                           </span>
                        </Link>
                        <Link
                           className="flex h-10 items-center border justify-center border-zinc-300
                            rounded-full bg-zinc-200 dark:bg-zinc-700 dark:border-zinc-600 text-center 
                            text-sm font-bold"
                           to={`/login?redirectTo=${location.pathname}`}
                        >
                           {t("login.action", { ns: "auth" })}
                        </Link>
                     </div>
                  </LoggedOut>
                  <div className="flex-grow">
                     {featuredSites?.docs.length === 0 ? null : (
                        <>
                           <section className="border-t border-color-1">
                              <div
                                 className="uppercase
                                 text-xs text-1 font-bold pt-6 p-3"
                              >
                                 Featured sites
                              </div>
                              <div className="bg-2 border-y border-color-1 divide-y divide-color">
                                 {featuredSites?.docs.map((site) => (
                                    <Link
                                       to={`/${site.id}`}
                                       key={site.id}
                                       className="flex p-3 group items-center justify-between gap-3"
                                    >
                                       <div className="flex items-center gap-2.5 text-1">
                                          <span
                                             className="w-8 h-8 shadow-sm shadow-1 
                                                rounded-full overflow-hidden bg-3"
                                          >
                                             <Image
                                                options="fit=crop,width=60,height=60 ,gravity=auto"
                                                alt="Site Icon"
                                                //@ts-expect-error
                                                url={site?.icon?.url}
                                             />
                                          </span>
                                          <span className="font-bold group-hover:underline text-sm">
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
                     className="items-center justify-between pr-3 h-14 pl-5 border-color-1 
                     border-y max-laptop:bg-2 flex laptop:border-b-0"
                  >
                     <Link className="font-logo text-2xl pb-1" to="/">
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

import { Icon } from "~/components/Icon";
import { Text } from "~/components/Text";
import { Link } from "@remix-run/react";

export function GetStartedOptions() {
   return (
      <div className="dark:bg-zinc-800/10 bg-zinc-50/50 dark:border-zinc-700 w-full z-10 relative max-laptop:px-6 border-t-2 border-b border-zinc-100 pt-16 pb-20">
         <div className="max-w-5xl mx-auto px-5">
            <div className="font-header text-2xl pb-1.5 text-center">
               A wiki for every{" "}
               <span className="underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600">
                  community
               </span>
            </div>
            <div className="text-1 text-center">
               Thriving wikis made easy. Choose the best way to get started.
            </div>
         </div>
         <div className="max-w-5xl mx-auto w-full pt-[70px]">
            <div className="grid tablet:grid-cols-3 gap-16 tablet:gap-10 justify-center">
               <div className="bg-white dark:bg-dark350 rounded-2xl p-3.5 pt-8 pb-5 text-center relative space-y-0.5 group">
                  <div
                     className="shadow-sm shadow-zinc-300 dark:shadow-zinc-800 absolute -inset-2 bg-zinc-300/20 dark:bg-dark400 rounded-lg -z-10 before:absolute before:inset-y-0 before:left-0 before:w-[16px] before:bg-[length:16px_16px] 
                     before:[background-position:top_center,bottom_center] before:bg-no-repeat 
                     before:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px)] 
                     dark:before:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px)] 
                     after:absolute after:inset-y-0 after:right-0 after:w-[16px] 
                     after:bg-[length:16px_16px] after:[background-position:top_center,bottom_center] 
                     after:bg-no-repeat after:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px)] 
                     dark:after:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px)]"
                     aria-hidden="true"
                  />
                  <div
                     className="rounded-full bg-white dark:bg-dark450 border border-zinc-200 size-14 
                     group-hover:border-zinc-300/80 dark:group-hover:border-zinc-600 absolute -top-9 left-1/2 transform -translate-x-1/2
                     inline-flex items-center justify-center shadow shadow-zinc-100 dark:shadow-zinc-800/80 dark:border-zinc-600"
                  >
                     <Icon
                        name="github"
                        size={20}
                        className="text-zinc-500/70 dark:text-zinc-400"
                     />
                  </div>
                  <div className="font-semibold pb-1 text-center">
                     Open-source, self-host
                  </div>
                  <Text className="pb-4 text-center">
                     For developers and self-starters. Install and maintain on
                     your own server.
                  </Text>
                  <Link
                     className="bg-zinc-600 hover:bg-zinc-700 dark:hover:bg-zinc-500 inline-flex
                     text-white rounded-full px-3.5 py-1.5 text-xs mt-2 font-semibold"
                     to="https://github.com/manawiki"
                  >
                     Github Repo
                  </Link>
               </div>
               <div className="bg-white dark:bg-dark350 rounded-2xl p-3.5 pt-8 pb-5 text-center relative space-y-0.5 group">
                  <div
                     className="shadow-sm shadow-zinc-300 dark:shadow-zinc-800 absolute -inset-2 bg-zinc-300/20 dark:bg-dark400 rounded-lg -z-10 before:absolute before:inset-y-0 before:left-0 before:w-[16px] before:bg-[length:16px_16px] 
                     before:[background-position:top_center,bottom_center] before:bg-no-repeat 
                     before:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px)] 
                     dark:before:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px)] 
                     after:absolute after:inset-y-0 after:right-0 after:w-[16px] 
                     after:bg-[length:16px_16px] after:[background-position:top_center,bottom_center] 
                     after:bg-no-repeat after:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px)] 
                     dark:after:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px)]"
                     aria-hidden="true"
                  />
                  <div
                     className="rounded-full bg-white dark:bg-dark450 border border-zinc-200 size-14 
                     group-hover:border-zinc-300/80 dark:group-hover:border-zinc-600 absolute -top-9 left-1/2 transform -translate-x-1/2
                     inline-flex items-center justify-center shadow shadow-zinc-100 dark:shadow-zinc-800/80 dark:border-zinc-600"
                  >
                     <Icon
                        name="server"
                        size={18}
                        className="text-zinc-500/70 dark:text-zinc-400"
                     />
                  </div>
                  <div className="font-semibold pb-1 text-center">
                     One-click hosting
                  </div>
                  <Text className="pb-4 text-center">
                     Get started with a hosted wiki in seconds on our fully
                     managed platform.
                  </Text>
                  <Link
                     className="bg-zinc-600 hover:bg-zinc-700 dark:hover:bg-zinc-500 inline-flex
                     text-white rounded-full px-3.5 py-1.5 text-xs mt-2 font-semibold"
                     to="/login"
                  >
                     Try for Free
                  </Link>
               </div>

               <div className="bg-white dark:bg-dark350 rounded-2xl p-3.5 pt-8 pb-5 text-center relative space-y-0.5 group">
                  <div
                     className="shadow-sm shadow-zinc-300 dark:shadow-zinc-800 absolute -inset-2 bg-zinc-300/20 dark:bg-dark400 rounded-lg -z-10 before:absolute before:inset-y-0 before:left-0 before:w-[16px] before:bg-[length:16px_16px] 
                     before:[background-position:top_center,bottom_center] before:bg-no-repeat 
                     before:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px)] 
                     dark:before:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px)] 
                     after:absolute after:inset-y-0 after:right-0 after:w-[16px] 
                     after:bg-[length:16px_16px] after:[background-position:top_center,bottom_center] 
                     after:bg-no-repeat after:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.500/.56)_1.5px,transparent_1.5px)] 
                     dark:after:[background-image:radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.zinc.600)_1.5px,transparent_1.5px)]"
                     aria-hidden="true"
                  />
                  <div
                     className="rounded-full bg-white dark:bg-dark450 border border-zinc-300/60 size-14 
                     group-hover:border-zinc-300/80 dark:group-hover:border-zinc-600 absolute -top-9 left-1/2 transform -translate-x-1/2
                     inline-flex items-center justify-center shadow shadow-zinc-100 dark:shadow-zinc-800/80 dark:border-zinc-600"
                  >
                     <Icon
                        name="bolt"
                        size={22}
                        className="text-zinc-500/70 dark:text-zinc-400"
                     />
                  </div>
                  <div className="font-semibold pb-1 text-center">
                     Enterprise
                  </div>
                  <Text className="pb-4 text-center">
                     Custom-built solutions for your organization. Integrate
                     with your existing infrastructure.
                  </Text>
                  <Link
                     className="bg-zinc-600 hover:bg-zinc-700 dark:hover:bg-zinc-500 inline-flex
                     text-white rounded-full px-3.5 py-1.5 text-xs mt-2 font-semibold"
                     to="mailto:info@mana.wiki"
                  >
                     Get in Touch
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}

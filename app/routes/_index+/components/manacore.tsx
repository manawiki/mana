import { useEffect, useState } from "react";

import { Transition } from "@headlessui/react";

import { Logo } from "~/components";

import { Particles } from "./particles";

export const ManaCore = () => {
   const [tab, setTab] = useState<number>(1);

   useEffect(() => {
      const intervalId = setInterval(() => {
         setTab(tab + 1);
      }, 1200);
      if (tab == 5) {
         setTab(1);
      }

      return () => clearInterval(intervalId);
   }, [tab]);

   return (
      <div className="relative mx-auto max-w-6xl px-6 laptop:px-4">
         <div>
            {/* Section content */}
            <div className="mx-auto flex max-w-xl flex-col space-y-8 space-y-reverse tablet:space-x-8 laptop:max-w-none laptop:flex-row laptop:space-y-0 desktop:space-x-16">
               {/* Image */}
               <div data-aos="fade-up" data-aos-delay="100">
                  <div className="relative -mt-12 py-24">
                     {/* Particles animation */}
                     <Particles
                        className="absolute inset-0 -z-10"
                        quantity={8}
                        staticity={30}
                     />

                     <div className="flex items-center justify-center">
                        <div className="relative flex h-48 w-48 items-center justify-center">
                           {/* Halo effect */}
                           <svg
                              className="pointer-events-none absolute inset-0 left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform blur-md will-change-transform"
                              width="480"
                              height="480"
                              viewBox="0 0 480 480"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <defs>
                                 <linearGradient
                                    id="pulse-a"
                                    x1="50%"
                                    x2="50%"
                                    y1="100%"
                                    y2="0%"
                                 >
                                    <stop offset="0%" stopColor="#0c4a6e" />
                                    <stop
                                       offset="76.382%"
                                       stopColor="#fef9c3"
                                    />
                                    <stop offset="100%" stopColor="#6366F1" />
                                 </linearGradient>
                              </defs>
                              <g fillRule="evenodd">
                                 <path
                                    className="pulse"
                                    fill="url(#pulse-a)"
                                    fillRule="evenodd"
                                    d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
                                 />
                                 <path
                                    className="pulse pulse-1"
                                    fill="url(#pulse-a)"
                                    fillRule="evenodd"
                                    d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
                                 />
                                 <path
                                    className="pulse pulse-2"
                                    fill="url(#pulse-a)"
                                    fillRule="evenodd"
                                    d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
                                 />
                              </g>
                           </svg>
                           {/* Grid */}
                           <div className="pointer-events-none absolute inset-0 left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full [mask-image:_radial-gradient(black,_transparent_60%)]">
                              <div className="animate-endless h-[200%]">
                                 <div className="absolute inset-0 opacity-20 blur-[2px] [background:_repeating-linear-gradient(transparent,_transparent_48px,_theme(colors.white)_48px,_theme(colors.white)_49px)]" />
                                 <div className="absolute inset-0 [background:_repeating-linear-gradient(transparent,_transparent_48px,_theme(colors.zinc.600)_48px,_theme(colors.zinc.600)_49px)]" />
                                 <div className="absolute inset-0 opacity-20 blur-[2px] [background:_repeating-linear-gradient(90deg,transparent,_transparent_48px,_theme(colors.white)_48px,_theme(colors.white)_49px)]" />
                                 <div className="absolute inset-0 [background:_repeating-linear-gradient(90deg,transparent,_transparent_48px,_theme(colors.zinc.700)_48px,_theme(colors.zinc.600)_49px)]" />
                              </div>
                           </div>
                           {/* Icons */}
                           <Transition
                              show={tab === 1}
                              className="absolute"
                              enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                              enterFrom="opacity-0 -rotate-[60deg]"
                              enterTo="opacity-100 rotate-0"
                              leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                              leaveFrom="opacity-100 rotate-0"
                              leaveTo="opacity-0 rotate-[60deg]"
                           >
                              <div className="relative flex h-16 w-16 -rotate-[14deg] items-center justify-center rounded-2xl border border-transparent shadow-2xl [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] before:absolute before:inset-0 before:rounded-2xl before:bg-slate-800/30">
                                 <Logo className="h-8 w-8" />
                              </div>
                           </Transition>
                           <Transition
                              show={tab === 2}
                              className="absolute"
                              enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                              enterFrom="opacity-0 -rotate-[60deg]"
                              enterTo="opacity-100 rotate-0"
                              leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                              leaveFrom="opacity-100 rotate-0"
                              leaveTo="opacity-0 rotate-[60deg]"
                           >
                              <div className="relative flex h-16 w-16 -rotate-[14deg] items-center justify-center rounded-2xl border border-transparent shadow-2xl [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] before:absolute before:inset-0 before:rounded-2xl before:bg-slate-800/30">
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="relative h-6 w-6 fill-emerald-500"
                                 >
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                 </svg>
                              </div>
                           </Transition>
                           <Transition
                              show={tab === 3}
                              className="absolute"
                              enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                              enterFrom="opacity-0 -rotate-[60deg]"
                              enterTo="opacity-100 rotate-0"
                              leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                              leaveFrom="opacity-100 rotate-0"
                              leaveTo="opacity-0 rotate-[60deg]"
                           >
                              <div className="relative flex h-16 w-16 -rotate-[14deg] items-center justify-center rounded-2xl border border-transparent shadow-2xl [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] before:absolute before:inset-0 before:rounded-2xl before:bg-slate-800/30">
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="relative h-6 w-6 fill-yellow-500"
                                 >
                                    <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
                                    <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
                                    <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
                                    <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
                                 </svg>
                              </div>
                           </Transition>
                           <Transition
                              show={tab === 4}
                              className="absolute"
                              enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                              enterFrom="opacity-0 -rotate-[60deg]"
                              enterTo="opacity-100 rotate-0"
                              leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                              leaveFrom="opacity-100 rotate-0"
                              leaveTo="opacity-0 rotate-[60deg]"
                           >
                              <div className="relative flex h-16 w-16 -rotate-[14deg] items-center justify-center rounded-2xl border border-transparent shadow-2xl [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] before:absolute before:inset-0 before:rounded-2xl before:bg-slate-800/30">
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="relative h-6 w-6 fill-purple-500"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 00-.266.112L8.78 21.53A.75.75 0 017.5 21v-3.955a48.842 48.842 0 01-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                              </div>
                           </Transition>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

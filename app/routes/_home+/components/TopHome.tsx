import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";

import { ManaCore } from "./manacore";
import { Particles } from "./particles";

export function TopHome() {
   return (
      <section className="relative z-10 bg-zinc-900">
         <div className="relative z-10 mx-auto max-w-6xl px-6 laptop:px-4">
            {/* Particles animation */}
            <Particles className="absolute inset-0 -z-10" />

            {/* Illustration */}
            <div
               className="pointer-events-none absolute inset-0 -z-10 laptop:-mx-28 overflow-hidden laptop:rounded-b-[3rem]"
               aria-hidden="true"
            >
               <div className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2">
                  <Image
                     url="/images/glow-bottom.svg"
                     className="max-w-none"
                     width={2146}
                  />
               </div>
            </div>
            <div className="absolute inset-0 -z-10 flex items-center pb-6">
               <ManaCore />
            </div>

            <div className="pb-20 pt-96 laptop:pt-80">
               <div className="mx-auto mt-8 text-center">
                  <h1
                     className="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text 
                    pb-4 font-header text-3xl font-bold text-transparent"
                     data-aos="fade-down"
                  >
                     The all-in-one wiki builder
                  </h1>
                  <p
                     className="mb-8 text-slate-400 max-w-md mx-auto"
                     data-aos="fade-down"
                     data-aos-delay="200"
                  >
                     Open-source, easy to use, and fully customizable. Build
                     better wikis with Mana.
                  </p>
                  <div
                     data-aos="fade-down"
                     data-aos-delay="400"
                     className="flex items-center justify-center gap-3.5"
                  >
                     <a
                        href="https://github.com/manawiki/mana"
                        target="_blank"
                        className="
                         relative inline-flex w-28 items-center justify-center gap-2 rounded-full border border-transparent
                         px-3 py-2.5 text-zinc-100 shadow-sm shadow-black/30 transition duration-150 ease-in-out
                         [background:linear-gradient(theme(colors.zinc.800),_theme(colors.zinc.800))_padding-box,_conic-gradient(theme(colors.zinc.400),_theme(colors.zinc.700)_25%,_theme(colors.zinc.700)_75%,_theme(colors.zinc.400)_100%)_border-box]
                         before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-zinc-800/30 hover:text-white"
                        rel="noreferrer"
                     >
                        <Icon name="github" size={16} />
                        <span className="pt-0.5 text-sm font-bold">Github</span>
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

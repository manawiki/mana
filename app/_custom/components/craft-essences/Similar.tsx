import { Link } from "@remix-run/react";

import type { CraftEssence as CraftEssenceType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function Similar({ data: ce }: { data: CraftEssenceType }) {
   return (
      <>
         <H2 text="Other CEs with Similar Effects" />
         <CEWithSameEffect ce={ce} />
      </>
   );
}

const CEWithSameEffect = ({ ce }: any) => {
   return (
      <>
         {ce.effect_list?.map((eff: any) => {
            console.log(eff);
            const name = eff.effect.name;
            const icon = eff.effect.icon?.url;
            const celist = eff.effect.ce_With_Effect;
            return (
               <>
                  {celist?.length > 0 ? (
                     <>
                        <div className="mt-4 mb-2 pb-2 border-b border-slate-500">
                           {icon ? (
                              <div className="inline-block h-auto w-6 align-middle mr-4 ">
                                 <Image
                                    options="aspect_ratio=1:1&height=80&width=80"
                                    className="object-contain"
                                    url={icon}
                                    alt="skill_icon"
                                    loading="lazy"
                                 />
                              </div>
                           ) : null}

                           <div className="inline-block w-[85%] align-middle font-bold">
                              {/* Description */}
                              {name}
                           </div>
                        </div>
                        <div className="">
                           {celist.map((c: any) => {
                              return (
                                 <>
                                    <div className="w-12 h-12 inline-block align-middle m-0.5">
                                       <Link
                                          prefetch="intent"
                                          to={`/grandorder/c/craft-essences/${c?.id}`}
                                          className=""
                                       >
                                          <Image
                                             options="height=48&width=48"
                                             className="object-contain"
                                             url={c?.icon?.url}
                                             alt={c?.name}
                                             loading="lazy"
                                          />
                                       </Link>
                                    </div>
                                 </>
                              );
                           })}
                        </div>
                     </>
                  ) : null}
               </>
            );
         })}
      </>
   );
};

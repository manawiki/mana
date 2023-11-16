import type { Material as MaterialType } from "payload/generated-custom-types";
import { H3, Image } from "~/components";

export function Obtain({ data: mat }: { data: MaterialType }) {
   const obtain_no_hint = mat?.no_obtain_way_hint;

   return (
      <>
         <H3 text="How to Obtain" />
         <section>
            <div className="block items-center justify-center shadow-sm shadow-1 rounded-lg dark:bg-dark350 bg-zinc-50 border border-color-sub w-full">
               {mat?.obtain_way?.map((way: any) => {
                  return (
                     <>
                        <div className="my-1">
                           <div className="h-auto mx-2 relative inline-block align-middle bg-gray-500 dark:bg-gray-800 rounded-full">
                              <Image
                                 height={32}
                                 className="object-contain"
                                 url={way?.icon?.url}
                                 options="height=32"
                                 alt={"Icon"}
                              />
                           </div>
                           <div className="inline-block align-middle w-5/6">
                              {way?.desc}
                           </div>
                        </div>
                     </>
                  );
               })}
            </div>
         </section>
      </>
   );
}

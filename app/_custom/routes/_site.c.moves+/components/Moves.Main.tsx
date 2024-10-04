import { Move } from "~/db/payload-custom-types";

export function MovesMain({ data }: { data: Move }) {
   const move = data;

   return (
      <div className="laptop:grid laptop:grid-cols-2 pb-4 laptop:gap-4">
         <section>
            <div className="bg-2-sub shadow-sm shadow-1 border rounded-lg border-color-sub mb-3 relative z-20">
               {/* <Image
                  height={240}
                  width={240}
                  url={selectedImage?.imageUrl}
                  options="height=400"
                  alt={selectedImage?.name}
               /> */}
            </div>
         </section>
         <section className="mb-8">
            <div
               className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
               mb-3 [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
            ></div>
         </section>
      </div>
   );
}

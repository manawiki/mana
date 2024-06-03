import { Image } from "~/components/Image";

export function WeaponsGallery({ data: full }: { data: any }) {
   const char = full.Weapon;

   const gallery_items = [
      {
         name: "Icon",
         url: char?.icon?.url,
      },
      {
         name: "Splash",
         url: char?.splash?.url,
      },
   ];

   return (
      <>
         <div className="mb-3 grid w-full grid-cols-3 gap-3">
            {gallery_items.map((g, i) => {
               return (
                  <>
                     <div
                        className="shadow-1 border-color-sub relative inline-block overflow-hidden rounded-lg border text-center shadow-sm"
                        key={i}
                     >
                        <div className="border-color-sub bg-3-sub relative block border-b py-2 text-center text-sm font-bold">
                           {g.name}
                        </div>
                        <a href={g.url}>
                           <div className="bg-2-sub relative flex w-full items-center justify-center p-3">
                              <div className="relative h-24 w-24 text-center">
                                 <Image
                                    options="aspect_ratio=1:1&height=120&width=120"
                                    alt="Gallery Item"
                                    url={g.url}
                                    className="h-24 w-24 object-contain"
                                 />
                              </div>
                           </div>
                        </a>
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
}

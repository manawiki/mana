import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Search } from "lucide-react";
import { H2 } from "~/_custom/components/custom";
import { Image } from "~/components";

// export async function loader({
//    context: { payload },
//    request,
// }: LoaderArgs) {
//    const characters = await payload.find({
//       // @ts-ignore
//       collection: "characters",
//       where: {
//          id: {
//             exists: true,
//          },
//       },
//       depth: 3,
//       limit: 50,
//    });
//    return json({ characters });
// }

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/banners?limit=100&sort=-banner_id`;
   const bannerRaw = await (await fetch(url)).json();
   const banners = bannerRaw.docs;

   return json({ banners });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Home - Mana",
      },
      {
         name: "description",
         content: "Build Better Wikis",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { banners } = useLoaderData<typeof loader>();

   console.log(banners);
   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
         <BannerList banners={banners} />
      </div>
   );
}

const BannerList = ({ banners }: any) => {
   const [filters, setFilters] = useState([]);
   const [sort, setSort] = useState("character_id");
   const [search, setSearch] = useState("");

   return (
      <>
         <div className="">
            {/* List of Characters with applied sorting */}
            <H2 text="Banners" />
            <div className="text-center">
               {banners?.map((b: any) => {
                  return (
                     <>
                        <div className="relative rounded-md p-2 my-1 border dark:border-gray-700">
                           <div className="relative inline-block w-1/4 align-middle text-center px-2">
                              {/* Banner Name */}

                              <div className="text-sm font-bold block">
                                 {b?.name}
                              </div>
                              {/* Banner Image */}
                              <div className="h-28 w-auto">
                                 <Image
                                    alt={b?.name}
                                    className="object-contain h-28"
                                    url={b?.icon?.url}
                                 />
                              </div>
                              {/* Banner Period */}
                              <div className="text-xs">
                                 {new Date(b?.start_date).toLocaleString()} -{" "}
                                 {b?.end_date
                                    ? new Date(b?.end_date).toLocaleString()
                                    : null}
                              </div>
                           </div>
                           <div className="relative inline-block w-3/4 px-2 align-middle">
                              {b.featured_characters?.map((c: any) => {
                                 return (
                                    <>
                                       <div className="relative inline-block align-top my-1">
                                          <CharFrame char={c} />
                                       </div>
                                    </>
                                 );
                              })}

                              {b.featured_light_cones?.map((c: any) => {
                                 return (
                                    <>
                                       <div className="relative inline-block align-top my-1">
                                          <LightConeFrame char={c} />
                                       </div>
                                    </>
                                 );
                              })}
                           </div>
                        </div>
                     </>
                  );
               })}
            </div>
         </div>
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon and Quantity Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
const CharFrame = ({ char }: any) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center mx-1" key={char?.id}>
         <a href={`/starrail/collections/characters/${char?.id}/c`}>
            <div className="relative inline-block h-20 w-20 align-middle text-xs">
               <Image
                  url={char?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     char?.rarity?.display_number ?? "1"
                  } rounded-t-md`}
                  alt={char?.name}
               />
            </div>
            <div className="relative mt-2 rounded-b-md w-20 border-b border-gray-700 bg-black align-middle text-xs text-white">
               {char?.name}
            </div>
         </a>
      </div>
   );
};

const LightConeFrame = ({ char }: any) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center mx-1" key={char?.id}>
         <a href={`/starrail/collections/lightCones/${char?.id}/c`}>
            <div className="relative inline-block h-20 w-20 align-top text-xs">
               <Image
                  url={char?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     char?.rarity?.display_number ?? "1"
                  } rounded-t-md`}
                  alt={char?.name}
               />
            </div>
            <div className="relative rounded-b-md w-20 border-b border-gray-700 bg-black align-middle text-xs text-white">
               {char?.name}
            </div>
         </a>
      </div>
   );
};

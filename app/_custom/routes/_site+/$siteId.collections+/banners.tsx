import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { settings } from "mana-config";
import { H2 } from "~/components/H2";
import { Image } from "~/components";
import { fetchWithCache } from "~/utils/cache.server";
import { Suspense } from "react";

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const BANNERS = `
   query Banners {
      Banners(limit: 100) {
        docs {
          name
          banner_id
          icon {
            url
          }
          start_date
          end_date
          featured_characters {
            id
            name
            icon {
              url
            }
            rarity {
              display_number
            }
          }
          featured_light_cones {
            id
            name
            icon {
              url
            }
            rarity {
              display_number
            }
          }
        }
      }
    }
   `;
   const { data, errors } = await fetchWithCache(
      `https://${settings.siteId}-db.${settings.domain}/api/graphql?banners`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query: BANNERS,
         }),
      }
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   // Sort banners by banner_id
   data.Banners.docs.sort((a: any, b: any) =>
      parseInt(a.banner_id) > parseInt(b.banner_id)
         ? -1
         : parseInt(b.banner_id) > parseInt(a.banner_id)
         ? 1
         : 0
   );

   return json({ banners: data.Banners.docs });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Banners - Honkai: Star Rail",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { banners } = useLoaderData<typeof loader>();

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <BannerList banners={banners} />
      </div>
   );
}

const BannerList = ({ banners }: any) => {
   // const [filters, setFilters] = useState([]);
   // const [sort, setSort] = useState("character_id");
   // const [search, setSearch] = useState("");

   return (
      <>
         <div className="">
            {/* List of Characters with applied sorting */}
            <H2 text="Banners" />
            <div className="space-y-2.5 pb-10">
               {banners?.map((b: any) => (
                  <div
                     key={b?.name}
                     className="border-color shadow-1 bg-1 relative overflow-hidden rounded-lg border bg-zinc-50 shadow-sm"
                  >
                     <div
                        className="border-color items-center justify-between border-b 
                              bg-zinc-100 p-3 dark:bg-bg2Dark max-laptop:space-y-1 laptop:flex"
                     >
                        <div className="font-bold">{b?.name}</div>
                        <div className="text-1 text-xs">
                           <Suspense
                           //time locale may trigger hydration issues
                           >
                              <time
                                 dateTime={b?.start_date}
                                 suppressHydrationWarning
                              >
                                 {new Date(b?.start_date).toLocaleString()}
                              </time>{" "}
                              -{" "}
                              {b?.end_date ? (
                                 <time
                                    dateTime={b?.end_date}
                                    suppressHydrationWarning
                                 >
                                    {new Date(b?.end_date).toLocaleString()}
                                 </time>
                              ) : null}
                           </Suspense>
                        </div>
                     </div>
                     <div className="relative items-center laptop:flex">
                        <div className="flex w-full flex-none items-center justify-center p-3 text-center laptop:w-[240px]">
                           <Image
                              options="width=500"
                              className="shadow-1 rounded-lg shadow"
                              alt={b?.name}
                              url={b?.icon?.url}
                           />
                        </div>
                        <div className="text-1 grid flex-grow grid-cols-2 gap-3 p-3 text-sm font-bold">
                           {b.featured_characters?.map((c: any) => (
                              <CharFrame key={c?.id} char={c} />
                           ))}
                           {b.featured_light_cones?.map((c: any) => (
                              <LightConeFrame key={c?.id} char={c} />
                           ))}
                        </div>
                     </div>
                  </div>
               ))}
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
      <Link
         prefetch="intent"
         className="flex items-center gap-2.5"
         to={`/starrail/collections/characters/${char?.id}`}
      >
         <div className="h-12 w-12 flex-none">
            <Image
               options="aspect_ratio=1:1&height=60&width=60"
               url={char?.icon?.url ?? "no_image_42df124128"}
               className={`color-rarity-${
                  char?.rarity?.display_number ?? "1"
               } rounded-xl`}
               alt={char?.name}
            />
         </div>
         <div>{char?.name}</div>
      </Link>
   );
};

const LightConeFrame = ({ char }: any) => {
   // Matqty holds material and quantity information

   return (
      <Link
         prefetch="intent"
         className="flex items-center gap-2.5"
         to={`/starrail/collections/lightCones/${char?.id}`}
      >
         <div className="h-12 w-12 flex-none">
            <Image
               className={`object-contain color-rarity-${
                  char?.rarity?.display_number ?? "1"
               } rounded-xl`}
               options="aspect_ratio=1:1&height=60&width=60"
               url={char?.icon?.url ?? "no_image_42df124128"}
               alt={char?.name}
            />
         </div>
         <div>{char?.name}</div>
      </Link>
   );
};

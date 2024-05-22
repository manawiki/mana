import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";
import { Link } from "@remix-run/react";

export function Echoes({ data: full }: { data: any }) {
  const echo_list = full.Echoes;

  return (
    <>
      <H2 text="Echoes that can have Sonata Effect" />

      {/* Sonata Effects */}
      <div className="grid grid-cols-3 gap-2 text-center laptop:grid-cols-5">
        {echo_list?.map((echo: any) => (
          <EntryIconOnly char={echo} />
        ))}
      </div>
    </>
  );
}

const EntryIconOnly = ({ char }: any) => {
  const elemicon = char?.element?.icon?.url;
  const rarityurl = char?.rarity?.icon?.url;
  const raritynum = char?.rarity?.display_number;
  const cid = char?.id;
  const sonatas = char?.sonata_effect_pool;
  const cost = char?.class?.cost;

  return (
    <>
      <Link
        prefetch="intent"
        className="shadow-1 bg-2-sub border-color-sub rounded-lg border p-1 shadow-sm"
        to={`/c/echoes/${cid}`}
      >
        {/* Icon */}
        <div className="relative inline-block h-28 w-28">
          {/* Path + Path Name ? */}
          {elemicon ? (
            <>
              <div className="absolute -right-1 bottom-0 z-20 h-6 w-7 rounded-sm bg-gray-800 bg-opacity-90 text-white text-center">
                {cost}
              </div>
            </>
          ) : null}

          {/* Cost ? */}
          {elemicon ? (
            <>
              <div className="absolute -right-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                <Image
                  alt="Icon"
                  className="relative inline-block object-contain"
                  url={elemicon}
                />
              </div>
            </>
          ) : null}

          {/* Sonatas ? */}
          {sonatas?.length > 0 ? (
            <>
              <div className="absolute -left-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                {sonatas?.map((son: any) => {
                  const sonata_color = son?.color;
                  const sonata_icon = son?.icon?.url;

                  return (
                    <>
                      <div className="block bg-zinc-800 dark:bg-transparent rounded-full mb-1">
                        <div
                          style={{
                            "border-color": `#${sonata_color}`,
                            "background-color": `#${sonata_color}44`,
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2"
                        >
                          <Image
                            options="aspect_ratio=1:1&height=80&width=80"
                            className="object-contain"
                            url={sonata_icon}
                            alt={"SonataIcon"}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          ) : null}

          {/* Rarity */}
          {/* <div
                   style={{ "border-color": `#${char.rarity?.color}` }}
                   className="absolute -bottom-2 w-full transform border-b-4"
                ></div> */}

          <Image
            options="height=150"
            className="object-contain"
            url={char.icon?.url}
            alt={char?.name}
          />
        </div>
        {/* Name */}
        <div className="pt-1 text-center text-xs font-bold ">{char.name}</div>
      </Link>
    </>
  );
};

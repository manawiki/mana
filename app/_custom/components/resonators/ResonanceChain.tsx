import type { Resonator } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";

export function ResonanceChain({ data: full }: { data: any }) {
  const char = full.Resonator;

  const rchains = char.resonance_chain;

  return (
    <>
      {rchains?.length > 0 ? (
        <>
          <H2 text="Resonance Chain" />
          <div
            className="bg-2-sub divide-color-sub border-color-sub shadow-1 mb-4 
      divide-y overflow-hidden rounded-lg border shadow"
          >
            {rchains?.map((rc, index) => {
              const r_icon = rc.icon?.url;
              const r_name = rc.name;
              const r_desc = rc.desc;

              return (
                <div className="p-3" key={index}>
                  <div className="inline-block w-[85%] align-middle">
                    {/* Header with Skill Icon and Name */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 rounded-full bg-zinc-700 dark:bg-zinc-800">
                        <Image
                          options="aspect_ratio=1:1&height=80&width=80"
                          className="object-contain"
                          url={r_icon}
                          alt={r_name}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="font-bold">{r_name}</div>
                        <div className="text-1">Lv. {index + 1}</div>
                      </div>
                    </div>
                    {/* Description */}
                    <div
                      className="pt-2 text-sm wuwa-resonance-chain-description dark:brightness-100 brightness-75"
                      dangerouslySetInnerHTML={{
                        __html: r_desc ?? "",
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </>
  );
}

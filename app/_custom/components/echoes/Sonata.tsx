import { useState } from "react";

import { Disclosure } from "@headlessui/react";

import type { Echo as EchoType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";

export function Sonata({ data: full }: { data: any }) {
  const char = full;

  const [level, setLevel] = useState(0);

  const sonata_list = char.sonata_effect_pool;

  return (
    <>
      <H2 text="Sonata Effects Possible" />

      {/* Sonata Effects */}
      {sonata_list?.map((sonata: any) => (
        <SonataEffect data={sonata} />
      ))}
    </>
  );
}

const SonataEffect = ({ data }: any) => {
  const sonata_icon = data?.icon?.url;
  const sonata_name = data?.name;
  const sonata_effects = data?.effects;
  return (
    <>
      <div className="border-color-sub bg-2-sub shadow-1 overflow-hidden rounded-lg border shadow-sm">
        {/* Header with Sonata Icon and Name */}
        <div className="bg-3-sub relative flex items-center gap-3 p-3 border-b border-color-sub">
          <div className="flex h-11 w-11 items-center justify-center p-1 rounded-full bg-zinc-500 dark:bg-zinc-600">
            <Image
              options="aspect_ratio=1:1&height=80&width=80"
              className="object-contain"
              url={sonata_icon}
              alt={sonata_name}
              loading="lazy"
            />
          </div>
          <div className="space-y-1">
            <div className="font-bold">{sonata_name}</div>
          </div>
        </div>

        {/* Set Effects */}
        <div className="border-color-sub border-t p-3 text-sm">
          {sonata_effects.map((effect: any) => {
            return (
              <>
                <div className="font-bold">{effect.pieces}-Set: </div>
                <div
                  className=""
                  dangerouslySetInnerHTML={{
                    __html: effect?.effect ?? "",
                  }}
                ></div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

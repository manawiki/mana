import { useState } from "react";

import { Disclosure } from "@headlessui/react";

import type { Echo as EchoType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";

export function Stats({ data: full }: { data: any }) {
  const stats = full;

  const main = stats?.find((a: any) => a.name == "main-1")?.stats;
  const sub = stats?.find((a: any) => a.name == "sub-1")?.stats;

  return (
    <>
      <H2 text="Possible Main Stats" />
      {main?.map((mstat: any) => (
        <StatDisp stat={mstat} />
      ))}

      <H2 text="Possible Sub Stats" />
      {sub?.map((sstat: any) => (
        <StatDisp stat={sstat} />
      ))}
    </>
  );
}

const StatDisp = ({ stat }: any) => {
  const icon = stat?.icon?.url;
  const name = stat?.name;

  return (
    <>
      <div className="inline-block px-3 bg-zinc-50 dark:bg-dark350 rounded-lg shadow-sm shadow-1 border border-color-sub py-1 m-2 ">
        {icon ? (
          <>
            <div className="items-center inline-block align-middle rounded-md justify-center dark:bg-dark350 bg-zinc-600 h-full mr-2">
              <Image
                width={30}
                className="object-contain"
                url={icon}
                options="width=30"
                alt={name ?? "Icon"}
              />
            </div>
          </>
        ) : null}
        <div className="inline-block">{name}</div>
      </div>
    </>
  );
};

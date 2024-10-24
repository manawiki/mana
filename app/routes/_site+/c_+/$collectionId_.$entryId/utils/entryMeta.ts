import type { MetaFunction } from "@remix-run/react";

import { getMeta } from "~/components/getMeta";

export const entryMeta: MetaFunction = ({
   matches,
   data,
}: {
   matches: any;
   data: any;
}) => {
   const siteName = matches?.[1]?.data?.site?.name;

   const title = `${data?.entry.name} | ${data?.entry?.collectionName} - ${siteName}`;

   let image = "",
      canonicalURL = "",
      description = "";

   try {
      // const icon = data?.entry?.icon?.url;
      const entryData = data?.entry?.data?.[
         Object.keys(data?.entry?.data)[0]!
      ] as Object;

      // description is section names
      const sections = Object.values(data?.entry?.sections)
         ?.slice(1)
         ?.map((section: any) => section?.name);

      description = sections
         ? `${data?.entry?.name} ${sections?.join(", ")}.`
         : data?.entry?.name + "  Wiki, Database, Guides, News, and more!";

      // find the first image object in entryData with the shape { "url": string }
      image = Object.values(entryData)?.find(
         (value) => value?.url && typeof value.url === "string",
      )?.url;

      const siteDomain = matches?.[1]?.data?.site?.domain;
      const siteSlug = matches?.[1]?.data?.site?.slug;

      canonicalURL = `https://${siteDomain ?? `${siteSlug}.mana.wiki`}/c/${data
         ?.entry?.collectionSlug}/${data?.entry?.slug}`;
   } catch (error) {
      console.error("Error in entryMeta: ", title, canonicalURL, error);
   }

   return getMeta({ title, description, image, siteName, canonicalURL });
};

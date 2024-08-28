import type { MetaFunction } from "@remix-run/react";

import { getMeta } from "~/components/getMeta";

export const listMeta: MetaFunction = ({ matches }: { matches: any }) => {
   const site = matches?.[1]?.data?.site;

   const collectionId = matches?.[2]?.pathname?.split("/")[2];

   const collection = site?.collections?.find(
      (collection: any) => collection.slug === collectionId,
   );

   const title = `${collection?.name} | ${site?.name}`;

   const icon = collection?.icon?.url;

   const sections = collection?.sections
      ?.map((section: any) => section?.name)
      ?.slice(1);

   const description =
      `Browse ${collection?.name} ` +
      sections?.join(", ") +
      ` on ${site?.name}. `;

   const siteDomain = matches?.[1]?.data?.site?.domain;
   const siteSlug = matches?.[1]?.data?.site?.slug;

   const canonicalURL = `https://${siteDomain ?? `${siteSlug}.mana.wiki`}/c/${
      collection.slug
   }`;

   return getMeta({
      title,
      description,
      icon,
      siteName: site?.name,
      canonicalURL,
   });
};

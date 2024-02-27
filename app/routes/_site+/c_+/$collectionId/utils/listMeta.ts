import type { MetaDescriptor, MetaFunction } from "@remix-run/react";

export const listMeta: MetaFunction = ({ matches }: { matches: any }) => {
   const site = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site;

   const collectionId = matches[2].pathname.split("/")[2];

   const collection = site?.collections?.find(
      (collection: any) => collection.slug === collectionId,
   );

   const title = `${collection?.name} | ${site?.name}`;

   const image = collection?.icon?.url;

   const sections = collection?.sections
      ?.map((section: any) => section?.name)
      ?.slice(1);

   const description =
      `Browse ${collection?.name} ` +
      sections.join(", ") +
      `on ${site?.name}. `;

   const meta = [{ title }] as MetaDescriptor[];

   if (description) meta.push({ name: "description", content: description });
   // if (sections) meta.push({ name: "keywords", content: sections });

   //insert open graph metadata
   meta.push({
      property: "og:site_name",
      content: site?.name,
   });
   if (title) meta.push({ property: "og:title", content: title });
   if (description)
      meta.push({ property: "og:description", content: description });
   if (image)
      meta.push({
         property: "og:image",
         content: image,
      });
   // if (url) meta.push({ property: "og:url", content: url });

   //insert twitter metadata
   meta.push({ name: "twitter:card", content: "summary_large_image" });
   meta.push({ name: "twitter:site", content: "@mana_wiki" });
   if (title) meta.push({ name: "twitter:title", content: title });
   if (description)
      meta.push({ name: "twitter:description", content: description });
   if (image)
      meta.push({
         name: "twitter:image",
         content: image,
      });
   if (description && image)
      meta.push({ name: "twitter:image:alt", content: description });

   return meta;
};

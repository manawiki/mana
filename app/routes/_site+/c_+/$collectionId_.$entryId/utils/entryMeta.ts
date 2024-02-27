import type { MetaFunction, MetaDescriptor } from "@remix-run/react";

export const entryMeta: MetaFunction = ({
   matches,
   data,
}: {
   matches: any;
   data: any;
}) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site?.name;

   const title = `${data?.entry.name} | ${data?.entry?.collectionName} - ${siteName}`;
   // const icon = data?.entry?.icon?.url;
   const entryData = data?.entry?.data?.[
      Object.keys(data?.entry?.data)[0]!
   ] as Object;

   // description is section names
   const sections = Object.values(data?.entry?.sections)
      ?.slice(1)
      ?.map((section: any) => section?.name);
   const description = sections
      ? `${data?.entry?.name} ${sections?.join(", ")}.`
      : data?.entry?.name + "  Wiki, Database, Guides, News, and more!";

   // find the first image object in entryData with the shape { "url": string }
   const image = Object.values(entryData).find(
      (value) => value?.url && typeof value.url === "string",
   )?.url;

   const meta = [{ title }] as MetaDescriptor[];

   if (description) meta.push({ name: "description", content: description });
   // if (sections) meta.push({ name: "keywords", content: sections });

   //insert open graph metadata
   meta.push({
      property: "og:site_name",
      content: siteName,
   });
   if (title) meta.push({ property: "og:title", content: title });
   if (description)
      meta.push({ property: "og:description", content: description });
   if (image)
      meta.push({
         property: "og:image",
         content: image + "?aspect_ratio=1.91:1&height=440",
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
         content: image + "?aspect_ratio=1.91:1&height=440",
      });
   if (description && image)
      meta.push({ name: "twitter:image:alt", content: description });

   return meta;
};

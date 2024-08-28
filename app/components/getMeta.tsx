import type { MetaDescriptor } from "@remix-run/node";

export type MetaType = {
   title?: string;
   siteName?: string;
   description?: string;
   image?: string;
   icon?: string;
   url?: string;
   canonicalURL?: string;
   keywords?: string;
};

/**
 * A helper function to generate meta data for a page
 * @param props - Meta data for the page, can be wiki data or manually inputed based on type
 */
export function getMeta({
   title,
   siteName,
   description,
   image,
   icon,
   url,
   canonicalURL,
   keywords,
}: MetaType) {
   const meta = [{ title }] as MetaDescriptor[];

   if (description) meta.push({ name: "description", content: description });
   if (keywords) meta.push({ name: "keywords", content: keywords });

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
   else if (icon)
      meta.push({
         property: "og:image",
         content: icon,
      });
   if (url) meta.push({ property: "og:url", content: url });

   //insert canonical link
   if (canonicalURL)
      meta.push({ tagName: "link", rel: "canonical", href: canonicalURL });

   //insert twitter metadata
   meta.push({ name: "twitter:site", content: "@mana_wiki" });
   if (title) meta.push({ name: "twitter:title", content: title });
   if (description)
      meta.push({ name: "twitter:description", content: description });
   if (image) {
      meta.push({
         name: "twitter:image",
         content: image + "?aspect_ratio=1.91:1&height=440",
      });
      meta.push({ name: "twitter:card", content: "summary_large_image" });
   } else if (icon)
      meta.push({
         name: "twitter:image",
         content: icon,
      });
   if (description && (image || icon))
      meta.push({ name: "twitter:image:alt", content: description });

   return meta;
}

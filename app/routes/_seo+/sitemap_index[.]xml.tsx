import type { LoaderArgs } from "@remix-run/node";
import { settings } from "mana-config";

const toXmlSitemap = (urls: string[]) => {
   const urlsAsXml = urls
      .map((url) => `<sitemap><loc>${url}</loc></sitemap>`)
      .join("\n");

   return `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urlsAsXml}
    </sitemapindex>
    `;
};

export async function loader({ context: { payload } }: LoaderArgs) {
   try {
      const { docs } = await payload.find({
         collection: "sites",
         depth: 0,
         limit: 500,
      });
      const sites = docs.map(
         (item) => `${settings.domainFull}/${item.slug}/sitemap.xml`
      );
      const sitemap = toXmlSitemap([...sites]);
      return new Response(sitemap, {
         status: 200,
         headers: {
            "Content-Type": "application/xml",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=3600",
         },
      });
   } catch (e) {
      throw new Response("Internal Server Error", { status: 500 });
   }
}

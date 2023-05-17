export const loader = () => {
   const robotText = `    
        User-agent: *
        Disallow: /admin/
        Sitemap: https://mana.wiki/sitemap_index.xml
        `;
   return new Response(robotText, {
      status: 200,
      headers: {
         "Content-Type": "text/plain",
      },
   });
};

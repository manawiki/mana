export const loader = () => {
   const robotText = `    
        User-agent: *
        Disallow: /admin/
        `;
   return new Response(robotText, {
      status: 200,
      headers: {
         "Content-Type": "text/plain",
      },
   });
};

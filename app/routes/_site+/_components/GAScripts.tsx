import { useIsBot } from "~/utils/isBotProvider";

declare global {
   interface Window {
      dataLayer?: Object[];
   }
}

export function GAScripts({ gaTrackingId }: { gaTrackingId: string }) {
   let isBot = useIsBot();

   return (
      process.env.NODE_ENV === "production" &&
      gaTrackingId &&
      !isBot && (
         <>
            <script
               type="text/partytown"
               suppressHydrationWarning={true} // to get rid of "text/partytown-x" hydration error warning
               dangerouslySetInnerHTML={{
                  __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaTrackingId}');`,
               }}
            />
            <script
               type="text/partytown"
               suppressHydrationWarning={true} // to get rid of "text/partytown-x" hydration error warning
               src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
         </>
      )
   );
}

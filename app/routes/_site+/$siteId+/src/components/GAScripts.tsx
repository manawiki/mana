import type { Site } from "~/db/payload-types";
import { useIsBot } from "~/utils/isBotProvider";

export function GAScripts({ gaTrackingId }: { gaTrackingId: Site["gaTagId"] }) {
   let isBot = useIsBot();
   if (process.env.NODE_ENV === "production" && gaTrackingId && !isBot)
      return (
         <script
            defer
            id="gtag-init"
            dangerouslySetInnerHTML={{
               __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${gaTrackingId}', {
                     page_path: window.location.pathname,
                  });
                  `,
            }}
         />
      );
}

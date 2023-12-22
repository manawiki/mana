import { useIsBot } from "~/utils/isBotProvider";

export function RampScripts({
   enableAds,
}: {
   enableAds: boolean | undefined | null;
}) {
   let isBot = useIsBot();

   if (enableAds && !isBot)
      return (
         <>
            <script
               defer
               data-cfasync="false"
               dangerouslySetInnerHTML={{
                  __html: `
               window.ramp = window.ramp || {};
               window.ramp.que = window.ramp.que || [];
               window.ramp.passiveMode = true;
               `,
               }}
            />
            <script
               defer
               data-cfasync="false"
               dangerouslySetInnerHTML={{
                  __html: `
               window._pwGA4PageviewId = ''.concat(Date.now());
               window.dataLayer = window.dataLayer || [];
               window.gtag = window.gtag || function () {
                  dataLayer.push(arguments);
               };
               gtag('js', new Date());
               gtag('config', 'G-T3DKG2SG5T', { 'send_page_view': false });
               gtag(
                  'event',
                  'ramp_js',
                  {
                     'send_to': 'G-T3DKG2SG5T',
                     'pageview_id': window._pwGA4PageviewId
                  }
               )
               `,
               }}
            />
         </>
      );
}

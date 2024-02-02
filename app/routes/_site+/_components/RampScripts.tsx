import { Script } from "~/utils/third-parties/Script";

export function RampScripts({ enableAds }: { enableAds: boolean }) {
   if (process.env.NODE_ENV === "production" && enableAds)
      return (
         <>
            <Script
               id="_ramp-config_2"
               data-cfasync="false"
               dangerouslySetInnerHTML={{
                  __html: `
               window.ramp = window.ramp || {};
               window.ramp.que = window.ramp.que || [];
               window.ramp.passiveMode = true;
               `,
               }}
            />
            <Script
               id="_ramp-core_2"
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
            <Script
               id="_ramp-config"
               src="/proxy/1025133/74686/ramp_config.js"
            />
            <Script id="_ramp-core" src="/proxy/ramp_core.js" />
         </>
      );
}

import type { MetaFunction } from "@remix-run/node";

import { PolicyTemplate } from "../_site+/privacy";

export const meta: MetaFunction = () => {
   return [
      {
         title: "Privacy Policy - Mana",
      },
   ];
};

export default function PrivacyPolicy() {
   return (
      <div className="laptop:pt-20">
         <PolicyTemplate domain="mana.wiki" />
      </div>
   );
}

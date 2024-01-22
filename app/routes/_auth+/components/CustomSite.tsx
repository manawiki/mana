import { useMatches } from "@remix-run/react";

import type { Site } from "payload/generated-types";

export const CustomSite = ({ children }: { children: React.ReactNode }) => {
   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };
   const isCustom = site?.type === "custom";
   return isCustom ? <>{children}</> : null;
};

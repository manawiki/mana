import { useRouteLoaderData, useMatches } from "@remix-run/react";

import type { Site, User } from "payload/generated-types";

export const FollowingSite = ({ children }: { children: React.ReactNode }) => {
   const { following } = useRouteLoaderData("root") as {
      user: User;
      following: User["sites"];
   };
   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };
   if (site && following?.some((e: any) => e.id === site?.id))
      return <>{children}</>;
   return null;
};

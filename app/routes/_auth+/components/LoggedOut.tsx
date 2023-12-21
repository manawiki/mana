import { useRouteLoaderData } from "@remix-run/react";

import type { User } from "payload/generated-types";

export const LoggedOut = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   return user ? null : <>{children}</>;
};

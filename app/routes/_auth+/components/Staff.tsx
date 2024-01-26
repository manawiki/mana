import { useRouteLoaderData } from "@remix-run/react";

import type { User } from "payload/generated-types";

export const Staff = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   return user?.roles?.includes("staff") ? <>{children}</> : null;
};

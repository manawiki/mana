import { useRootLoaderData } from "~/utils/useSiteLoaderData";

export const LoggedOut = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRootLoaderData();
   return user ? null : <>{children}</>;
};

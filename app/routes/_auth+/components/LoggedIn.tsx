import { useRootLoaderData } from "~/utils/useSiteLoaderData";

export const LoggedIn = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRootLoaderData();
   return user ? <>{children}</> : null;
};

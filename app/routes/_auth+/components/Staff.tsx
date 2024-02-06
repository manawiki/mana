import { useRootLoaderData } from "~/utils/useSiteLoaderData";

export const Staff = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRootLoaderData();
   return user?.roles?.includes("staff") ? <>{children}</> : null;
};

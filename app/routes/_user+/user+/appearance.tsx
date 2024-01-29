import type { MetaFunction } from "@remix-run/react";

import { ThemeToggleDesktop } from "../components/ThemeToggleDesktop";
import { UserContainer } from "../components/UserContainer";

export default function UserAppearance() {
   return (
      <UserContainer title="Appearance">
         <ThemeToggleDesktop />
      </UserContainer>
   );
}

export const meta: MetaFunction = () => {
   return [
      {
         title: `Appearance | User Settings - Mana`,
      },
   ];
};

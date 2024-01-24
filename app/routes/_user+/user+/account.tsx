import type { MetaFunction } from "@remix-run/react";

import { ThemeToggleDesktop } from "../components/ThemeToggleDesktop";
import { UserContainer } from "../components/UserContainer";

export default function UserAccount() {
   return (
      <UserContainer title="Account">
         <ThemeToggleDesktop />
      </UserContainer>
   );
}

export const meta: MetaFunction = () => {
   return [
      {
         title: `Account | User Settings - Mana`,
      },
   ];
};

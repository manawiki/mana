import type { MetaFunction } from "@remix-run/react";

import { UserContainer } from "../components/UserContainer";

export default function UserAccount() {
   return (
      <UserContainer title="Billing">
         <div></div>
      </UserContainer>
   );
}

export const meta: MetaFunction = () => {
   return [
      {
         title: `Billing | User Settings - Mana`,
      },
   ];
};

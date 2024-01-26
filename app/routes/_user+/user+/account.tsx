import type { MetaFunction } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { assertIsDelete } from "~/utils/http.server";

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

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });
   invariant(user);

   switch (intent) {
      case "deleteUserAccount": {
         assertIsDelete(request);
         invariant(user);
         const result = await payload.delete({
            collection: "users",
            id: user.id,
            user,
            overrideAccess: false,
         });
         if (result) return redirect("/");
      }

      default:
         return null;
   }
};

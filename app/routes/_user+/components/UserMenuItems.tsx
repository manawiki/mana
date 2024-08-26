import { UserMenuLink } from "./UserMenuLink";

export function UserMenuItems() {
   return (
      <div className="space-y-1.5 flex-grow">
         <UserMenuLink text="Account" icon="user" to="/user/account" />
         <UserMenuLink text="Appearance" icon="palette" to="/user/appearance" />
         {/* <UserMenuLink text="Billing" icon="credit-card" to="/user/billing" /> */}
      </div>
   );
}

import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Privacy Policy - Mana",
      },
   ];
};

export const handle = {
   i18n: "auth",
};

export default function PrivacyPolicy() {
   return (
      <>
         <div className="mx-auto mt-20 max-w-[680px] text-dark max-laptop:px-4">
            <h1 className="pb-2 font-header text-2xl font-bold">
               Privacy policy
            </h1>
            This is a privacy policy
         </div>
      </>
   );
}

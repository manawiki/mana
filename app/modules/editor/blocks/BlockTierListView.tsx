import type { TierElement } from "../types";

type Props = {
   element: TierElement;
};

export default function BlockTierListView({ element }: Props) {
   const tierItems = element.tierItems;

   return (
      <div className="border-color bg-2 divide-color relative my-3 divide-y rounded-lg border">
         {tierItems?.map((row) => (
            <div key={row.id}>Pongoo {row.id}</div>
         ))}
      </div>
   );
}

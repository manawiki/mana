import { GridCell } from "./GridCell";
import type { TierListData } from "./TierListData";

export function TierThree({ data }: { data: any }) {
   return (
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-3">
         {data.tier3.docs.map((row: TierListData) => (
            <GridCell
               key={row.id}
               href={`/c/pokemon/${row.slug}`}
               icon={row?.icon?.url}
               name={row.name}
               type={row.type}
            />
         ))}
      </div>
   );
}

import { GridCell } from "./GridCell";
import type { TierListData } from "./TierListData";

export function TierTwo({ data }: { data: any }) {
   return (
      <div className="grid grid-cols-4 gap-3">
         {data.tier2.docs.map((row: TierListData) => (
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

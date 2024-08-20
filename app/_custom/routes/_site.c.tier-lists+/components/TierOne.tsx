import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

import { columns, filters, gridView } from "./ListTierList";

export function TierOne({ data }: { data: any }) {
   return (
      <ListTable
         searchPlaceholder="Filter by Pokemon name..."
         defaultViewType="grid"
         gridView={gridView}
         defaultSort={[{ id: "name", desc: true }]}
         data={{ listData: { docs: data.tier1.docs } }}
         columns={columns}
         columnViewability={{ type: false }}
         filters={filters}
      />
   );
}

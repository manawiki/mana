import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

import { columns, filters, gridView } from "./ListTierList";

export function TierTwo({ data }: { data: any }) {
   return (
      <ListTable
         gridView={gridView}
         defaultViewType="grid"
         defaultSort={[{ id: "name", desc: true }]}
         data={{ listData: { docs: data.tier2.docs } }}
         columns={columns}
         columnViewability={{ type: false }}
         filters={filters}
      />
   );
}

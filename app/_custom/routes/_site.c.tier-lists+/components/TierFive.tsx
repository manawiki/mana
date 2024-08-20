import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

import { columns, filters, gridView } from "./ListTierList";

export function TierFive({ data }: { data: any }) {
   return (
      <ListTable
         gridView={gridView}
         defaultViewType="grid"
         defaultSort={[{ id: "name", desc: true }]}
         data={{ listData: { docs: data.tier5.docs } }}
         columns={columns}
         columnViewability={{ type: false }}
         filters={filters}
      />
   );
}

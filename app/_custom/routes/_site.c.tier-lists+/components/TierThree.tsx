import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

import { columns, filters, gridView } from "./ListTierList";

export function TierThree({ data }: { data: any }) {
   return (
      <ListTable
         gridView={gridView}
         defaultViewType="grid"
         defaultSort={[{ id: "name", desc: true }]}
         data={{ listData: { docs: data.tier3.docs } }}
         columns={columns}
         columnViewability={{ type: false }}
         filters={filters}
      />
   );
}

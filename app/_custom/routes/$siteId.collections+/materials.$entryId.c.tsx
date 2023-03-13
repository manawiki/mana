import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import {
   EntryParent,
   EntryHeader,
   getDefaultEntryData,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";
import type { MaterialsLKJ16E5IhH } from "payload/generated-types";
import { Image } from "~/components/Image";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });
   const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as MaterialsLKJ16E5IhH;

   //Feel free to query for more data here

   return json({ entryDefault, defaultData });
}

export default function MaterialsEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();

   console.log(defaultData);

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <Header defaultData={defaultData} />
            <Stats />
         </EntryContent>
      </EntryParent>
   );
}

const Header = ({ defaultData }: any) => {
   const rarityimg = defaultData.term_rarity?.entry?.icon?.url;
   const raritydispnum = defaultData.term_rarity?.display_number;
   return (
      <>
         <div>
            Relationship: Rarity (Test) Image -
            defaultData.term_rarity?.entry?.icon?.url:{" "}
         </div>
         <div className="h-5 w-20 bg-gray-700">
            <img alt="rarity" className="object-contain" src={rarityimg} />
         </div>
         <div className="my-1 w-full h-0.5 border"></div>
         <div>
            Relationship: Rarity (Test) Display Number (Custom Field) -
            defaultData.term_rarity?.display_number:
         </div>
         <div>{raritydispnum ?? "ERROR: Null"}</div>
         <div>{defaultData.story}</div>
      </>
   );
};

const Stats = () => {
   return <div>This is stats</div>;
};

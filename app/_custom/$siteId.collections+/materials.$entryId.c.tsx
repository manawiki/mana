import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { EntryHeader } from "~/routes/$siteId.collections+/$collectionId.$entryId/EntryHeader";
import {
  EntryContent,
  EntryParent,
} from "~/routes/$siteId.collections+/$collectionId.$entryId/EntryWrappers";
import {
  getCustomEntryData,
  getDefaultEntryData,
  meta,
} from "~/routes/$siteId.collections+/$collectionId.$entryId/entryDefaults";
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

  console.log(entryDefault);
  return (
    <EntryParent>
      <EntryHeader entry={entryDefault} />
      <EntryContent>
        <Header />
        <Stats />
      </EntryContent>
    </EntryParent>
  );
}

const Header = () => {
  const { defaultData } = useLoaderData<typeof loader>();

  console.log(defaultData);

  const rarityimg = defaultData.rarity?.entry?.icon?.url;
  const raritydispnum = defaultData.rarity?.display_number;
  return (
    <>
      <div>
        Relationship: Rarity (Test) Image -
        defaultData.rarity?.entry?.icon?.url:{" "}
      </div>
      <div className="h-5 w-5 bg-gray-700">
        <img alt="rarity" className="object-contain" src={rarityimg} />
      </div>
      <div className="my-1 w-full h-0.5 border"></div>
      <div>
        Relationship: Rarity (Test) Display Number (Custom Field) -
        defaultData.rarity?.display_number:
      </div>
      <div>{raritydispnum ?? "ERROR: Null"}</div>
      <div>{defaultData.story}</div>
    </>
  );
};

const Stats = () => {
  return <div>This is stats</div>;
};

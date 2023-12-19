// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { gql } from "graphql-request";
import { Entry } from "~/routes/_site+/$siteId.c_+/components/Entry";
import { H3, Image } from "~/components";
import {
  customEntryMeta,
  fetchEntry,
} from "~/routes/_site+/$siteId.c_+/functions/entry";
export { customEntryMeta as meta };

// Custom Site / Collection Config Imports
import type { DiskDriveSet as DiskDriveSetType } from "~/db/payload-custom-types";
import { DiskDriveSets } from "../../../collections/disk-drive-sets";

// Custom Component Imports
import { Main } from "~/_custom/components/disk-drive-sets/Main";
import { Effects } from "~/_custom/components/disk-drive-sets/Effects";

// Loader definition - loads Entry data!
export async function loader({
  context: { payload, user },
  params,
  request,
}: LoaderFunctionArgs) {
  const { entry } = await fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: QUERY,
    },
  });
  return json({
    entry,
  });
}

const SECTIONS = {
  main: Main,
  effects: Effects,
};

import { ZZZUnderConstruction } from "~/_custom/components/ZZZUnderConstruction";

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const char = entry?.data?.DiskDriveSet as DiskDriveSetType;
  // console.log(char);

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        <Effects data={char} />

        <ZZZUnderConstruction />
      </Entry>
    </>
  );
}

const QUERY = gql`
  query DiskDriveSet($entryId: String!) {
    DiskDriveSet(id: $entryId) {
      id
      name
      desc
      rarity_possible {
        id
        name
        icon_item {
          url
        }
      }
      icon {
        url
      }
      set_effect {
        num
        desc
      }
      slug
    }
  }
`;

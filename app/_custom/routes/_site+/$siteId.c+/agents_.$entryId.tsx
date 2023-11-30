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
import type { Agent as AgentType } from "~/db/payload-custom-types";
import { Agents } from "../../../collections/agents";

// Custom Component Imports
// import { Main } from "~/_custom/components/agents/Main";

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
  //main: Main,
};

import { ZZZLoadingImage } from "~/_custom/components/ZZZLoadingImage";

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const char = entry?.data?.Agent as AgentType;
  // console.log(char);

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <div className="my-4 dark:invert-0 invert h-28 w-full flex items-center justify-center">
          <ZZZLoadingImage />
        </div>
        <div className="text-center w-full text-2xl">Under Construction!</div>
      </Entry>
    </>
  );
}

const QUERY = gql`
  query Agent($entryId: String!) {
    Agent(id: $entryId) {
      id
      name
      name_code
      slug
      icon {
        url
      }
      damage_type {
        id
        name
        icon {
          url
        }
      }
      damage_element {
        id
        name
        icon {
          url
        }
      }
      character_camp {
        id
        name
        icon {
          url
        }
      }
    }
  }
`;

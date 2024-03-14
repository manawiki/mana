// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { gql } from "graphql-request";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { Image } from "~/components/Image";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

// Custom Component Imports
export { entryMeta as meta };

// Custom Site / Collection Config Imports
import type { Item as ItemType } from "~/db/payload-custom-types";
import { Items } from "../../collections/items";

// Custom Component Imports
// import { Main } from "~/_custom/components/items/Main";
//import { ImageGallery } from "~/_custom/components/materials/ImageGallery";

// Loader definition - loads Entry data!
export async function loader({
  context: { payload, user },
  params,
  request,
}: LoaderFunctionArgs) {
  const fetchCategoryData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: AchievementCategoryQuery,
    },
  });

  const fetchGroupData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: AchievementGroupQuery,
    },
  });

  const [{ entry }, data] = await Promise.all([
    fetchCategoryData,
    fetchGroupData,
  ]);

  return json({
    entry,
    GroupData: data.entry?.data?.TrophyGroups?.docs,
  });
}

const SECTIONS = {
  main: Main,
  // gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry, GroupData } = useLoaderData<typeof loader>();
  var char = {
    Category: entry.data.TrophyCategory,
    Group: GroupData,
  };
  console.log(char);

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
      </Entry>
    </>
  );
}

function Main({ data: char }: { data: any }) {
  const groups = char.Group;
  return (
    <>
      <div className="mb-3 grid w-full grid-cols-3 gap-3">
        {groups.map((g, i) => {
          return (
            <>
              <Link
                key={i}
                prefetch="intent"
                to={`/c/trophy-groups/${g.id}`}
                className="shadow-1 border-color-sub relative inline-block overflow-hidden rounded-lg border text-center shadow-sm"
              >
                <div className="bg-slate-600 relative flex w-full items-center justify-center p-3">
                  <div className="relative h-24 w-24 text-center">
                    <Image
                      options="aspect_ratio=1:1&height=120&width=120"
                      alt="Gallery Item"
                      url={g.icon?.url}
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                </div>
                <div className="border-color-sub bg-3-sub relative block border-b py-2 text-center text-sm font-bold">
                  {g.name}
                </div>
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
}

const AchievementCategoryQuery = gql`
  query TrophyCategory($entryId: String!) {
    TrophyCategory(id: $entryId) {
      id
      name
      slug: id
      icon {
        url
      }
    }
  }
`;

const AchievementGroupQuery = gql`
  query TrophyGroups($entryId: JSON) {
    TrophyGroups(where: { category: { equals: $entryId } }) {
      docs {
        id
        name
        icon {
          url
        }
        category {
          name
        }
      }
    }
  }
`;

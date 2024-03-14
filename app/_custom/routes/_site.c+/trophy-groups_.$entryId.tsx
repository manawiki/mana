import { useState, useEffect } from "react";

// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { gql } from "graphql-request";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";
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
      query: AchievementGroupQuery,
    },
  });

  const fetchGroupData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: AchievementGroupListQuery,
    },
  });

  const fetchListData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: AchievementListQuery,
    },
  });

  const [{ entry }, data, list] = await Promise.all([
    fetchCategoryData,
    fetchGroupData,
    fetchListData,
  ]);

  return json({
    entry,
    GroupData: data.entry?.data?.TrophyGroups?.docs,
    ListData: list.entry?.data?.Trophies?.docs,
  });
}

const SECTIONS = {
  main: Main,
  // gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry, GroupData, ListData } = useLoaderData<typeof loader>();
  var char = {
    Entry: entry.data.TrophyGroup,
    Group: GroupData,
    List: ListData,
  };

  const alist = char.List;

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Groups data={char} />
        <Achievements data={alist} />
      </Entry>
    </>
  );
}

function Achievements(alist: any) {
  const list = alist.data;

  return (
    <>
      <div className="space-y-1 pb-3 pl-1">
        <div className="font-bold">
          Track Achievement Progress using the Checkboxes below!
        </div>
        <div className="text-1 text-sm">
          Requires LocalStorage to be enabled
        </div>
      </div>

      {list?.map((ac: any) => {
        const [checked, setChecked] = useState(false);

        useEffect(() => {
          //We're saving achievement to local stage, so read initial value from local state
          setChecked(
            JSON.parse(
              localStorage.getItem("WuWa_manawiki_achievement-" + ac?.id) ??
                "false"
            )
          );
        }, [ac?.id]);

        return (
          <>
            <div className="shadow-1 border-color-sub relative flex overflow-hidden rounded-lg border text-left shadow-sm mb-2 px-3 py-2 items-center">
              {/* Checkbox section */}
              <div
                className={`shadow-1 flex h-8 w-8 flex-none cursor-pointer items-center
                  justify-center rounded-lg border shadow shadow-1 bg-white dark:bg-dark500 hover:bg-green-50 dark:hover:bg-dark400 ${
                    checked
                      ? "border-green-300 dark:border-green-800"
                      : "border-zinc-200 dark:border-zinc-500"
                  }`}
                onClick={() => {
                  localStorage.setItem(
                    "WuWa_manawiki_achievement-" + ac?.id,
                    JSON.stringify(!checked)
                  );

                  setChecked(!checked);
                }}
              >
                {checked ? <div>✔</div> : <></>}
              </div>

              {/* Achievement Name and Description */}
              <div className="items-center ml-3">
                <div className="text-sm font-bold dark:text-yellow-50 text-yellow-900 mb-1">
                  {ac?.name}
                </div>
                <div className="text-sm dark:text-zinc-400 text-zinc-600">
                  {ac?.desc}
                </div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
}

function Groups({ data: char }: { data: any }) {
  return (
    <>
      <GroupHeader data={char} />
      <GroupList data={char} />
    </>
  );
}

function GroupHeader({ data: char }: { data: any }) {
  return (
    <Link
      key="category-link-trophy"
      to={`/c/trophy-categories`}
      prefetch="intent"
    >
      <H2 text={`Achivement Category: ${char.Entry?.category?.name}`} />
    </Link>
  );
}

function GroupList({ data: char }: { data: any }) {
  const currgid = char.Entry?.id;
  const groups = char.Group?.filter(
    (gp: any) => gp.category?.id == char.Entry?.category?.id
  );
  return (
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
              <div
                className={`${
                  g.id == currgid
                    ? "bg-slate-600 dark:bg-slate-500"
                    : "bg-zinc-500 dark:bg-zinc-600"
                } hover:bg-zinc-800 dark:hover:bg-zinc-700 relative flex w-full h-full items-center justify-left p-1`}
              >
                <div className="relative flex-none h-6 w-6 text-center">
                  <Image
                    options="aspect_ratio=1:1&height=120&width=120"
                    alt="Gallery Item"
                    url={g.icon?.url}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div className="text-white relative px-2 text-center text-xs">
                  {g.name}
                </div>
              </div>
            </Link>
          </>
        );
      })}
    </div>
  );
}

function Main({ data: char }: { data: any }) {}

const AchievementGroupQuery = gql`
  query TrophyGroup($entryId: String!) {
    TrophyGroup(id: $entryId) {
      id
      name
      icon {
        url
      }
      category {
        id
        name
      }
    }
  }
`;

const AchievementGroupListQuery = gql`
  query TrophyGroups {
    TrophyGroups(limit: 1000) {
      docs {
        id
        name
        icon {
          url
        }
        category {
          id
        }
      }
    }
  }
`;

const AchievementListQuery = gql`
  query Trophies($entryId: JSON) {
    Trophies(where: { group: { equals: $entryId } }, sort: "id") {
      docs {
        id
        name
        desc
        group {
          id
          name
          category {
            id
            name
          }
        }
      }
    }
  }
`;

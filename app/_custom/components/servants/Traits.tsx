import type { Servant as ServantType } from "payload/generated-custom-types";

export function Traits({ data: servant }: { data: ServantType }) {
  return (
    <>
      <div className="">
        <TraitBlock charData={servant} />

        <TagBlock charData={servant} />
      </div>
    </>
  );
}

// =====================================
// 1) Traits
// =====================================
const TraitBlock = ({ charData }: any) => {
  const traitlist = charData?.traits;

  return (
    <>
      {traitlist.length > 0 ? (
        <>
          <h3>Traits</h3>
          {traitlist.map((trait: any, tkey) => {
            return (
              <>
                <div
                  className="m-1 p-1 px-2 rounded-md border inline-block relative dark:border-zinc-700  text-sm cursor-default"
                  key={"trait_list_" + tkey}
                >
                  {trait.name}
                </div>
              </>
            );
          })}
        </>
      ) : null}
    </>
  );
};

// =====================================
// 2) Tags
// =====================================
const TagBlock = ({ charData }: any) => {
  const taglist = charData?.tags;

  return (
    <>
      {taglist.length > 0 ? (
        <>
          <h3>Tags</h3>
          {taglist.map((tag: any, tkey) => {
            return (
              <>
                <div
                  className="m-1 p-1 px-2 rounded-md border inline-block relative dark:border-zinc-700 text-sm cursor-default"
                  key={"tag_list_" + tkey}
                >
                  {/* Show tag icon if applicable */}
                  {tag.icon ? (
                    <div className="inline-block h-5 w-5 relative align-middle mr-1">
                      <img
                        className="object-contain w-full h-full"
                        src={tag.icon?.url}
                      />
                    </div>
                  ) : null}

                  <span className="align-middle">{tag.name}</span>
                </div>
              </>
            );
          })}
        </>
      ) : null}
    </>
  );
};

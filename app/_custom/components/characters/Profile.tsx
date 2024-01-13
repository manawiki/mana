import type { Character as CharacterType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";

export const Profile = ({ data: char }: { data: CharacterType }) => {
  const adata = char.profile_record?.map((a: any) => {
    return {
      name: a.title,
      value: a.text,
    };
  });

  return (
    <>
      {char.profile_record ? (
        <>
          <H2 text="Profile" />
          <div className="divide-color-sub shadow-1 border-color-sub divide-y overflow-hidden rounded-lg border shadow-sm">
            {adata.map((stat, index) => {
              return (
                <div
                  className={`${
                    index % 2 == 0
                      ? "bg-2-sub relative block"
                      : "bg-3-sub relative block"
                  } items-center p-3`}
                  key={index}
                >
                  {/* 2bi) Stat Icon */}
                  <div className="align-top border-b border-color-sub mb-1 font-bold">
                    <div>{stat.name}</div>
                  </div>
                  {/* 2biii) Stat value */}
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: stat.value }}
                  ></div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </>
  );
};

import { Disclosure } from "@headlessui/react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

const tablestyling = `
   <style>
   table.skill-table tr th {
     text-align:center;
     padding: 0.2rem;
     font-size: 0.7rem;
     border-width: 1px;
     background-color: rgba(50,50,50,0.03);
   }
   .dark table.skill-table tr th {
      border-color: rgba(250,250,250,0.1);
      background-color: rgba(250,250,250,0.03);
   }
   table.skill-table tr td {
     text-align:center;
     padding: 0.2rem;
     font-size: 0.7rem;
     border-width: 1px;
   }
   .dark table.skill-table tr td {
     border-color: rgba(250,250,250,0.1);
   }
   </style>
   `;

export function Skills({ data: servant }: { data: ServantType }) {
  const skilllist = servant?.skills;
  const classlist = servant?.class_skills;
  const appendlist = servant?.append_skills;
  const classunlock = servant?.class_skill_unlock;

  return (
    <>
      <div>
        {skilllist?.length > 0 ? <H2 text="Skills" /> : null}
        {skilllist?.map((skill: any, si) => {
          return <SkillDisplay skill={skill} key={"skill_display_" + si} />;
        })}

        <H2 text="Append Skills" />
        {appendlist?.map((skill: any, ai) => {
          return (
            <AppendSkillDisplay skill={skill} key={"append_display_" + ai} />
          );
        })}

        <H2 text="Class Skills" />
        {classlist?.map((skill: any, ci) => {
          return (
            <ClassSkillDisplay
              skill={skill}
              key={"class_skill_display_" + ci}
            />
          );
        })}

        {classunlock ? (
          <>
            <h3>Class Skill Unlock Conditions</h3>
            <div dangerouslySetInnerHTML={{ __html: classunlock }}></div>
          </>
        ) : null}
      </div>
    </>
  );
}

// =====================================
// 1) Skill Display Component
// =====================================
const SkillDisplay = ({ skill }: any) => {
  const skilldat = skill.skill;
  const unlock = skill.unlock;
  const skill_name = skilldat?.name;
  const skill_icon = skilldat?._skill_Image?.icon?.url;
  const skill_value_table = skilldat?.effect_value_table;
  const skill_description = skilldat?.description;
  const cd = skilldat.cooldown ?? 0;

  const skilltablehtml = `
   ${tablestyling}
   <tr>
   <th>Lvl</th>
   <th>1</th>
   <th>2</th>
   <th>3</th>
   <th>4</th>
   <th>5</th>
   <th>6</th>
   <th>7</th>
   <th>8</th>
   <th>9</th>
   <th>10</th>
   </tr>
   ${skill_value_table}
   <tr>
     <th>CD</th>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 2}</td>
   </tr>`;

  return (
    <>
      <div className="border my-6 dark:border-slate-800 border-slate-300 p-2 rounded-md bg-blue-200 bg-opacity-10">
        <div className="h-10 w-10 inline-block relative mr-2">
          <Image
            height={40}
            url={skill_icon}
            className="object-contain"
            options="height=40"
            alt="SkillIcon"
          />
        </div>

        <div className="w-5/6 inline-block relative align-top">
          <div className="font-bold">{skill_name}</div>
          <div
            className="text-xs whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: skill_description
                .replace(/\<br\>/g, "")
                .replace(/\<p\>\r\n/g, "<p>"),
            }}
          ></div>
        </div>

        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`font-bold text-white bg-blue-800 dark:border-zinc-600 dark:bg-zinc-800
                 flex items-center mb-1 w-full border px-2 py-0.5 mt-1 rounded-md text-xs ${
                   open
                     ? "bg-opacity-100 dark:bg-opacity-100"
                     : "bg-opacity-80 dark:bg-opacity-40"
                 }`}
              >
                Show Info
                <div
                  className={`${
                    open
                      ? "transform rotate-180 text-gray-600 font-bold "
                      : "text-gray-400 "
                  } inline-block ml-auto `}
                >
                  <TiArrowSortedDown className="inline-block h-4 w-4" />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="mb-1">
                <table
                  className="text-xs text-center mb-1 w-full skill-table"
                  dangerouslySetInnerHTML={{ __html: skilltablehtml }}
                ></table>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div
          className="border-t text-xs dark:border-slate-800 pt-1"
          dangerouslySetInnerHTML={{ __html: unlock }}
        ></div>

        {skill.upgrades
          ? skill.upgrades.map((upg: any) => <SkillUpgrade skill={upg} />)
          : null}
      </div>
    </>
  );
};

// =====================================
// 2) Skill Upgrade Components
// =====================================
const SkillUpgrade = ({ skill }: any) => {
  const skilldat = skill.skill;
  const unlock = skill.unlock;
  const skill_name = skilldat?.name;
  const skill_icon = skilldat?._skill_Image?.icon?.url;
  const skill_value_table = skilldat?.effect_value_table;
  const skill_description = skilldat?.description;
  const cd = skilldat.cooldown ?? 0;

  const skilltablehtml = `
  ${tablestyling}
   <tr>
   <th>Lvl</th>
   <th>1</th>
   <th>2</th>
   <th>3</th>
   <th>4</th>
   <th>5</th>
   <th>6</th>
   <th>7</th>
   <th>8</th>
   <th>9</th>
   <th>10</th>
   </tr>
   ${skill_value_table}
   <tr>
      <th>CD</th>
      <td>${cd}</td>
      <td>${cd}</td>
      <td>${cd}</td>
      <td>${cd}</td>
      <td>${cd}</td>
      <td>${cd - 1}</td>
      <td>${cd - 1}</td>
      <td>${cd - 1}</td>
      <td>${cd - 1}</td>
      <td>${cd - 2}</td>
   </tr>`;

  return (
    <>
      <hr className="my-1 mb-3 border-blue-100 dark:border-slate-600 border -mx-2"></hr>
      <div className="">
        <div className="h-10 w-10 inline-block relative mr-2">
          <Image
            height={40}
            url={skill_icon}
            className="object-contain"
            options="height=40"
            alt="SkillIcon"
          />
        </div>

        <div className="w-5/6 inline-block relative align-top">
          <div className="font-bold">{skill_name}</div>
          <div
            className="text-xs whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: skill_description
                .replace(
                  /\<i class=\"fa fa-caret-up\" aria-hidden=\"true\"\>\<\/i\>/g,
                  "▲"
                )
                .replace(/\<br\>/g, "")
                .replace(/\<p\>\r\n/g, "<p>"),
            }}
          ></div>
        </div>

        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`font-bold text-white bg-blue-800 dark:border-zinc-600 dark:bg-zinc-800
                        flex items-center mb-1 w-full border px-2 py-0.5 mt-1 rounded-md text-xs ${
                          open
                            ? "bg-opacity-100 dark:bg-opacity-100"
                            : "bg-opacity-80 dark:bg-opacity-40"
                        }`}
              >
                Show Info
                <div
                  className={`${
                    open
                      ? "transform rotate-180 text-gray-600 font-bold "
                      : "text-gray-400"
                  } inline-block ml-auto `}
                >
                  <TiArrowSortedDown className="inline-block h-4 w-4" />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="mb-1">
                <table
                  className="text-xs text-center mb-1 w-full skill-table"
                  dangerouslySetInnerHTML={{ __html: skilltablehtml }}
                ></table>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div
          className="border-t text-xs dark:border-slate-800 pt-1"
          dangerouslySetInnerHTML={{ __html: unlock }}
        ></div>

        {skill.upgrades
          ? skill.upgrades.map((upg: any) => <SkillUpgrade skill={upg} />)
          : null}
      </div>
    </>
  );
};

// =====================================
// 3) Append Skills
// =====================================
const AppendSkillDisplay = ({ skill }: any) => {
  const skill_name = skill?.name;
  const skill_icon = skill?.skill_image?.icon?.url;
  const skill_value_table = skill?.effect_value_table;
  const skill_description = skill?.description;

  const skilltablehtml = `
  ${tablestyling}
   <tr>
   <th>Lvl</th>
   <th>1</th>
   <th>2</th>
   <th>3</th>
   <th>4</th>
   <th>5</th>
   <th>6</th>
   <th>7</th>
   <th>8</th>
   <th>9</th>
   <th>10</th>
   </tr>
   ${skill_value_table}
   `;

  return (
    <>
      <div className="border my-3 dark:border-slate-800 border-slate-300 p-2 rounded-md bg-blue-200 bg-opacity-10">
        <div className="h-10 w-10 inline-block relative mr-2">
          <Image
            height={40}
            url={skill_icon}
            className="object-contain"
            options="height=40"
            alt="SkillIcon"
          />
        </div>

        <div className="w-5/6 inline-block relative align-top">
          <div className="font-bold">{skill_name}</div>
          <div
            className="text-xs whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: skill_description
                .replace(/\<br\>/g, "")
                .replace(/\<p\>\r\n/g, "<p>"),
            }}
          ></div>
        </div>

        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`font-bold text-white bg-blue-800 dark:border-zinc-600 dark:bg-zinc-800
                 flex items-center mb-1 w-full border px-2 py-0.5 mt-1 rounded-md text-xs ${
                   open
                     ? "bg-opacity-100 dark:bg-opacity-100"
                     : "bg-opacity-80 dark:bg-opacity-40"
                 }`}
              >
                Show Info
                <div
                  className={`${
                    open
                      ? "transform rotate-180 text-gray-600 font-bold "
                      : "text-gray-400 "
                  } inline-block ml-auto `}
                >
                  <TiArrowSortedDown className="inline-block h-4 w-4" />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="mb-1">
                <table
                  className="text-sm text-center mb-1 w-full skill-table"
                  dangerouslySetInnerHTML={{ __html: skilltablehtml }}
                ></table>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
};

// =====================================
// 4) Class Skills
// =====================================
const ClassSkillDisplay = ({ skill }: any) => {
  const skill_name = skill?.name;
  const skill_icon = skill?.skill_image?.icon?.url;
  const skill_description = skill?.description;

  return (
    <>
      <div className="border my-3 dark:border-slate-800 border-slate-300 p-2 rounded-md bg-blue-200 bg-opacity-10">
        <div className="h-10 w-10 inline-block relative mr-2">
          <Image
            height={40}
            url={skill_icon}
            className="object-contain"
            options="height=40"
            alt="SkillIcon"
          />
        </div>

        <div className="w-5/6 inline-block relative align-top leading-0">
          <div className="font-bold">{skill_name}</div>
          <div
            className="mt-1 text-sm whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: skill_description
                ? skill_description
                    .replace(/\<br\>/g, "")
                    .replace(/\<p\>\r\n/g, "<p>")
                : null,
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

// =====================================
// For rendering Icons
// =====================================

const TiArrowSortedDown = (props: any) => (
  <svg
    className={props.className}
    height={props.h}
    width={props.w}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
  >
    <path
      fill="currentColor"
      d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
    />
  </svg>
);

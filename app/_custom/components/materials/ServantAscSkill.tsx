import type { Material as MaterialType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
import { Fragment, useState } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function ServantAscSkill({ data }: { data: any }) {
   const [tab, setTab] = useState(0); // 0 = Individual, 1 = Total Asc, 2 = Total Skill, 3 = Total Asc+Skill, 4 = Total Append, 5 = Total All

   const tab_options = [
      "Individual",
      "Total (Asc.)",
      "Total (Skill)",
      "Total (Asc. + Skill)",
      "Total (Append)",
      "Total (All)",
   ];

   const material = data?.entry?.data?.Material;
   const ascension = data?.ascension;
   const skill = data?.skill;
   const append = data?.append;

   return (
      <>
         {/* Tabs */}
         <H2 text="Servant Ascension/Skill Requirements" />
         <div className="grid grid-cols-3 justify-between gap-y-2 gap-x-3">
            {tab_options.map((tb, ti) => (
               <div
                  className={`border border-blue-400 dark:border-blue-900 text-center py-1 cursor-pointer ${
                     tab == ti ? "font-bold bg-blue-800 bg-opacity-20" : ""
                  }`}
                  onClick={() => setTab(ti)}
               >
                  {tb}
               </div>
            ))}
         </div>

         <div>
            {tab == 0 ? (
               <IndividualTotals data={data} />
            ) : tab == 1 ? (
               <AscensionTotals data={data} />
            ) : tab == 2 ? (
               <SkillTotals data={data} />
            ) : tab == 3 ? (
               <AscSkillTotals data={data} />
            ) : tab == 4 ? (
               <AppendTotals data={data} />
            ) : tab == 5 ? (
               <AllTotals data={data} />
            ) : null}
         </div>
      </>
   );
}

const IndividualTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.ascension;
   const skill = data?.skill;
   const append = data?.append;

   // Calculate Individual Ascension Values
   const asc_text = ["1st", "2nd", "3rd", "Max"];
   var asc_individual = [];
   for (var asclv = 0; asclv < 4; asclv++) {
      var filtered_ascension_lv = ascension
         ?.map((asc) => {
            return {
               ...asc,
               ascension_materials: [asc.ascension_materials[asclv]],
            };
         })
         .filter((a) => JSON.stringify(a).indexOf(material?.id) > -1);
      const asc_level_total = CalculateTotals(
         filtered_ascension_lv,
         material?.id,
         "ascension_materials",
      );
      asc_individual.push(asc_level_total);
   }

   // Loop through each Skill Enhancement Level
   const skill_text = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
   ];
   var skill_individual = [];
   for (var asclv = 0; asclv < 9; asclv++) {
      var filtered_skill_lv = skill
         ?.map((asc) => {
            return {
               ...asc,
               skill_enhancements: [asc.skill_enhancements[asclv]],
            };
         })
         .filter((a) => JSON.stringify(a).indexOf(material?.id) > -1);
      const skill_level_total = CalculateTotals(
         filtered_skill_lv,
         material?.id,
         "skill_enhancements",
      );
      skill_individual.push(skill_level_total);
   }

   //Append Skills
   var append_individual = [];
   for (var asclv = 0; asclv < 9; asclv++) {
      var filtered_append_lv = append
         ?.map((asc) => {
            return {
               ...asc,
               append_skill_enhancements: [
                  asc.append_skill_enhancements[asclv],
               ],
            };
         })
         .filter((a) => JSON.stringify(a).indexOf(material?.id) > -1);
      const append_level_total = CalculateTotals(
         filtered_append_lv,
         material?.id,
         "append_skill_enhancements",
      );
      append_individual.push(append_level_total);
   }

   return (
      <>
         {/* Ascension Individual */}
         {asc_individual?.map((ascindiv, index) => (
            <Fragment key={index}>
               {ascindiv?.length > 0 ? (
                  <>
                     <H2
                        text={`${asc_text[index]} Ascension`}
                        key={index + "asch2"}
                     />
                     <ServantTotalTable
                        tabledata={ascindiv}
                        key={index + "asctable"}
                     />
                  </>
               ) : null}
            </Fragment>
         ))}

         {/* Skill Individual */}
         {skill_individual?.map((ascindiv, index) => (
            <Fragment key={index}>
               {ascindiv?.length > 0 ? (
                  <>
                     <H2
                        text={`${skill_text[index]} Skill Enhancement`}
                        key={index + "skillh2"}
                     />
                     <ServantTotalTable
                        tabledata={ascindiv}
                        key={index + "skilltable"}
                     />
                  </>
               ) : null}
            </Fragment>
         ))}

         {/* Append Individual */}
         {append_individual?.map((ascindiv, index) => (
            <Fragment key={index}>
               {ascindiv?.length > 0 ? (
                  <>
                     <H2
                        text={`${skill_text[index]} Append Skill Enhancement`}
                        key={index + "appendh2"}
                     />
                     <ServantTotalTable
                        tabledata={ascindiv}
                        key={index + "appendtable"}
                     />
                  </>
               ) : null}
            </Fragment>
         ))}
      </>
   );
};

const AscensionTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.ascension;
   const skill = data?.skill;
   const append = data?.append;

   // Calculate Ascension Totals
   const ascension_totals = CalculateTotals(
      ascension, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "ascension_materials", // Field name the contains materials
   );

   // Loop through each Skill Enhancement Level

   return (
      <>
         {ascension?.length > 0 ? (
            <>
               <H2 text="Total (Ascension)" />
               <ServantTotalTable tabledata={ascension_totals} />
            </>
         ) : null}
      </>
   );
};

const SkillTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.ascension;
   const skill = data?.skill;
   const append = data?.append;

   // Calculate Skill Totals
   const skill_totals = CalculateTotals(
      skill, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "skill_enhancements", // Field name the contains materials
   );

   const skill_final = skill_totals.map((a) => {
      return { ...a, total: a.total + " (" + a.total * 3 + ")" };
   });

   // Loop through each Skill Enhancement Level

   return (
      <>
         {skill?.length > 0 ? (
            <>
               <H2 text="Total (Skill)" />
               <ServantTotalTable tabledata={skill_final} />
            </>
         ) : null}
      </>
   );
};

const AscSkillTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.ascension;
   const skill = data?.skill;
   const append = data?.append;

   // Calculate Ascension Totals
   const ascension_totals = CalculateTotals(
      ascension, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "ascension_materials", // Field name the contains materials
   );
   // Calculate Skill Totals
   const skill_totals = CalculateTotals(
      skill, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "skill_enhancements", // Field name the contains materials
   );

   const asc_skill_totals = [
      ...ascension_totals,
      ...skill_totals.map((a) => {
         return { ...a, total: a.total * 3 };
      }),
   ];

   const asc_skill_final = ConsolidateServantTotals(asc_skill_totals);

   // Loop through each Skill Enhancement Level

   return (
      <>
         {ascension?.length > 0 ? (
            <>
               <H2 text="Total (Asc. + Skill)" />
               <ServantTotalTable tabledata={asc_skill_final} />
            </>
         ) : null}
      </>
   );
};

const AppendTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.ascension;
   const skill = data?.skill;
   const append = data?.append;

   // Calculate Append Skill Totals
   const append_totals = CalculateTotals(
      append, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "append_skill_enhancements", // Field name the contains materials
   );

   const append_final = append_totals.map((a) => {
      return { ...a, total: a.total + " (" + a.total * 3 + ")" };
   });

   // Loop through each Skill Enhancement Level

   return (
      <>
         {append?.length > 0 ? (
            <>
               <H2 text="Total (Append)" />
               <ServantTotalTable tabledata={append_final} />
            </>
         ) : null}
      </>
   );
};

const AllTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.ascension;
   const skill = data?.skill;
   const append = data?.append;

   // Calculate Ascension Totals
   const ascension_totals = CalculateTotals(
      ascension, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "ascension_materials", // Field name the contains materials
   );
   // Calculate Skill Totals
   const skill_totals = CalculateTotals(
      skill, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "skill_enhancements", // Field name the contains materials
   );
   // Calculate Append Skill Totals
   const append_totals = CalculateTotals(
      append, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "append_skill_enhancements", // Field name the contains materials
   );

   const asc_skill_append_totals = [
      ...ascension_totals,
      ...skill_totals.map((a) => {
         return { ...a, total: a.total * 3 };
      }),
      ...append_totals.map((a) => {
         return { ...a, total: a.total * 3 };
      }),
   ];

   const all_final = ConsolidateServantTotals(asc_skill_append_totals);

   return (
      <>
         {ascension?.length > 0 ? (
            <>
               <H2 text="Total (All)" />
               <ServantTotalTable tabledata={all_final} />
            </>
         ) : null}
      </>
   );
};

function ConsolidateServantTotals(inputdata) {
   var final_data = [];

   inputdata.map((idat) => {
      const sindex = final_data.findIndex(
         (a) => a.servant?.id == idat.servant?.id,
      );
      if (sindex > -1) {
         final_data[sindex].total += idat.total;
      } else {
         final_data.push({ ...idat });
      }
   });

   return final_data;
}

function CalculateTotals(inputdata, materialid, matfieldname) {
   var total = inputdata?.map((asc) => {
      var final_total = 0;
      const asctext = JSON.stringify(asc[matfieldname]);
      const counted = asctext
         .split('material":{"id":"')
         .filter((t) => t.indexOf(materialid) > -1);
      counted.map((countmat) => {
         final_total += parseInt(
            countmat.replace(/.*qty":/, "").replace(/}.*/g, ""),
         );
      });

      return {
         servant: {
            name: asc.name,
            id: asc.id,
            slug: asc.slug,
            icon: {
               url: asc.icon.url,
            },
         },
         total: final_total,
      };
   });
   return total;
}

const ServantTotalTable = ({ tabledata }: any) => {
   const tdformat = "py-2 px-3 leading-none border border-color-sub";

   return (
      <>
         <Table grid framed>
            <TableHead>
               <TableRow>
                  <TableHeader center>
                     <span className="font-bold text-base cursor-default">
                        Servant
                     </span>
                  </TableHeader>
                  <TableHeader center>
                     <span className="font-bold text-base cursor-default w-1/6">
                        Amount
                     </span>
                  </TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {/* @ts-ignore */}
               {tabledata?.map((row, index) => (
                  <TableRow key={index + "tdata"}>
                     <td className={`text-left ${tdformat}`}>
                        <a href={`/c/servants/${row.servant?.slug}`}>
                           <div className="inline-block align-middle">
                              <Image
                                 options="height=45&width=45"
                                 className="object-contain inline-block"
                                 url={row.servant?.icon?.url}
                                 alt="icon"
                                 loading="lazy"
                              />
                           </div>
                           <div className="inline-block align-middle ml-3 text-base">
                              {row.servant?.name}
                           </div>
                        </a>
                     </td>
                     <td className={`text-center text-base ${tdformat}`}>
                        {row.total}
                     </td>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};

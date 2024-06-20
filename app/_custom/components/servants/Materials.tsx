import type { Servant as ServantType } from "payload/generated-custom-types";
import type { Material as MaterialType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/Table";

const qtyformat = `
<style>
   .grandorder-material-qty {
      text-shadow: 1px 0 0 #000,0 -1px 0 #000,0 1px 0 #000,-1px 0 0 #000;
   }
</style>
`;
const tdformat = "p-2 leading-none border border-color-sub";

export const Materials = ({ data: servant }: { data: ServantType }) => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: `${qtyformat}` }}></div>
      <H2 text="Ascension Materials" />
      <AscensionMaterials character={servant} />

      <H2 text="Skill Enhancement Materials" />
      <SkillMaterials character={servant} />

      <H2 text="Append Skill Materials" />
      <AppendMaterials character={servant} />

      <H2 text="Total Materials Required" />
      <TotalMaterials character={servant} />

      <H2 text="Costume Dress Materials" />
      <CostumeMaterials character={servant} />
    </>
  );
};

const AscensionMaterials = ({ character }: any) => {
  const stages = ["2", "3", "4", "Max"];
  return (
    <>
      <Table grid framed>
        <TableHead>
          <TableRow>
            <TableHeader center>Stage</TableHeader>
            <TableHeader center>Cost</TableHeader>
            <TableHeader>Materials</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {character.ascension_materials?.map((asc, index) => (
            <TableRow key={index}>
              <td className={`text-center ${tdformat}`}>{stages[index]}</td>
              <td className={`text-center ${tdformat}`}>{asc?.qp_cost}</td>
              <td className={`${tdformat}`}>
                {asc.materials?.map((mat, key) => (
                  <MaterialQtyFrame
                    materialqty={mat}
                    key={"ascension_mats_" + key}
                  />
                ))}
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const SkillMaterials = ({ character }: any) => {
  return (
    <>
      <Table grid framed>
        <TableHead>
          <TableRow>
            <TableHeader center>Level</TableHeader>
            <TableHeader center>Cost</TableHeader>
            <TableHeader>Materials</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {character.skill_enhancements?.map((enh, index) => (
            <TableRow key={index}>
              <td className={`text-center ${tdformat}`}>
                {index + 1} → {index + 2}
              </td>
              <td className={`text-center ${tdformat}`}>{enh?.qp_cost}</td>
              <td className={`${tdformat}`}>
                {enh.materials?.map((mat, key) => (
                  <MaterialQtyFrame
                    materialqty={mat}
                    key={"skill_mats_" + key}
                  />
                ))}
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const AppendMaterials = ({ character }: any) => {
  return (
    <>
      <Table grid framed>
        <TableHead>
          <TableRow>
            <TableHeader center>Level</TableHeader>
            <TableHeader center>Cost</TableHeader>
            <TableHeader>Materials</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {character.append_skill_enhancements?.map((enh, index) => (
            <TableRow key={index}>
              <td className={`text-center ${tdformat}`}>
                {index + 1} → {index + 2}
              </td>
              <td className={`text-center ${tdformat}`}>{enh?.qp_cost}</td>
              <td className={`${tdformat}`}>
                {enh.materials?.map((mat, key) => (
                  <MaterialQtyFrame
                    materialqty={mat}
                    key={"append_mats_" + key}
                  />
                ))}
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const TotalMaterials = ({ character }: any) => {
  // Three totals:
  // 1) Ascension total
  // 2) Skill total
  // 3) Append total
  // 4) Ascension + Skill total
  // 5) ALL Total

  // 1) Calculate Ascension total
  // ======================
  const ascData = character.ascension_materials;
  let ascensionTotal = CalculateTotals(ascData);
  let ascensionQP = ascData.map((a) => a.qp_cost).reduce((ps, a) => ps + a, 0);

  // 2) Calculate Skill total
  // ======================
  const skillData = character.skill_enhancements;
  let skillTotal = CalculateTotals(skillData);
  let skillQP = skillData.map((a) => a.qp_cost).reduce((ps, a) => ps + a, 0);

  // 3) Calculate Append total
  // ======================
  const appendData = character.append_skill_enhancements;
  let appendTotal = CalculateTotals(appendData);
  let appendQP = appendData.map((a) => a.qp_cost).reduce((ps, a) => ps + a, 0);

  // 4) Calculate Ascension + Skill total
  // ======================
  const ascSkillData = [...ascData, ...skillData];
  let ascSkillTotal = CalculateTotals(ascSkillData);
  let ascSkillQP = ascSkillData
    .map((a) => a.qp_cost)
    .reduce((ps, a) => ps + a, 0);

  // 5) Calculate All total
  // ======================
  const allData = [...ascData, ...skillData, ...appendData];
  let allTotal = CalculateTotals(allData);
  let allQP = allData.map((a) => a.qp_cost).reduce((ps, a) => ps + a, 0);

  const displayTotals = [
    {
      name: "Ascension",
      qp: ascensionQP,
      data: ascensionTotal,
    },
    {
      name: "Skill",
      qp: skillQP,
      data: skillTotal,
    },
    {
      name: "Append Skill",
      qp: appendQP,
      data: appendTotal,
    },
    {
      name: "Ascension + Skill",
      qp: ascSkillQP,
      data: ascSkillTotal,
    },
    {
      name: "Total",
      qp: allQP,
      data: allTotal,
    },
  ];

  return (
    <>
      <Table grid framed>
        <TableHead></TableHead>
        <TableBody>
          {displayTotals?.map((row, index) => (
            <TableRow key={index}>
              <TableHeader>{row.name}</TableHeader>
              <td className={`${tdformat}`}>
                <div>
                  {row.data?.map((mat, key) => (
                    <MaterialQtyFrame
                      materialqty={mat}
                      key={"total_" + row.name + "_" + key}
                    />
                  ))}
                </div>
                <div>
                  <div className="relative mr-0.5 inline-block h-12 w-12 align-middle text-xs">
                    <img
                      src={"https://static.mana.wiki/grandorder/Qp.png"}
                      className={`object-contain h-12`}
                      alt="QP"
                      loading="lazy"
                    />
                  </div>
                  <div className="inline-block align-middle font-bold text-base">
                    x{row.qp?.toLocaleString("en-US")}
                  </div>
                </div>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const CostumeMaterials = ({ character }: any) => {
  return (
    <>
      <Table grid framed>
        <TableHead>
          <TableRow>
            <TableHeader center>Costume</TableHeader>
            <TableHeader center>Cost</TableHeader>
            <TableHeader>Materials</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {character.costumes?.map((costume, index) => (
            <TableRow key={index}>
              <td className={`text-center ${tdformat}`}>{costume?.name}</td>
              <td className={`text-center ${tdformat}`}>
                {costume?.costume_materials?.[0]?.qp_cost?.toLocaleString(
                  "en-US"
                )}
              </td>
              <td className={`${tdformat}`}>
                {costume?.costume_materials?.[0]?.materials?.map((mat, key) => (
                  <MaterialQtyFrame
                    materialqty={mat}
                    key={"costume_mat_" + key}
                  />
                ))}
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

type ItemQtyFrameProps = {
  material?: MaterialType;
  qty: number;
  id?: string;
};

const MaterialQtyFrame = ({ materialqty }: any) => {
  const mat = materialqty?.material;
  const qty = materialqty?.qty;

  return (
    <>
      <div className="relative inline-block text-center" key={mat?.id}>
        <a href={`/c/materials/${mat?.id}`}>
          <div className="relative mr-0.5 inline-block h-12 w-12 align-middle text-xs">
            <img
              src={mat?.icon?.url ?? "no_image_42df124128"}
              className={`object-contain h-12`}
              alt={mat?.name}
              loading="lazy"
            />
          </div>
          <div className="absolute z-10 -bottom-0.5 right-2 text-sm text-white grandorder-material-qty">
            {qty}
          </div>
        </a>
      </div>
    </>
  );
};

function CalculateTotals(matlist: any) {
  let matTotal = [];

  if (matlist && matlist?.length > 0) {
    for (let i = 0; i < matlist?.length; i++) {
      const material_qty = matlist?.[i]?.materials;
      if (!material_qty) break;
      for (let j = 0; j < material_qty.length; j++) {
        const currMat = { ...material_qty?.[j] };
        const existIndex = matTotal.findIndex(
          (a) => a.material?.id == currMat.material?.id
        );
        if (existIndex == -1) {
          matTotal.push(currMat);
        } else {
          matTotal[existIndex].qty += currMat.qty;
        }
      }
    }
  }

  return matTotal;
}

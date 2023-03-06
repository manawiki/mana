import { useState } from "react";

export const SkillTree = ({ pageData }) => {
  // UseState variable settings
  const [treeNode, setTreeNode] = useState(0);

  var pathkey = pageData.attributes.term_path.data.attributes.data_key;
  var treelist = pageData.attributes.tree;
  var traces = pageData.attributes.traces;

  const connectorcount = {
    Knight: 8,
    Warrior: 8,
    Rogue: 8,
    Priest: 9,
    Mage: 6,
    Shaman: 8,
    Warlock: 7,
  };
  // Initialize an array of form [1, 2, 3, ... n], where n is the number of connectors for the character's Path (from connectorcount)
  const connectorlist = Array.from(
    { length: connectorcount[pathkey] },
    (v, k) => k + 1
  );

  return (
    <>
      <h2>Tree</h2>

      <div className="text-center">
        <div className="canvas inline-block">
          <div className={`canvas-${pathkey}`}></div>

          {connectorlist.map((con: any) => {
            return (
              <>
                <div className={`connector connector-${con}-${pathkey}`}></div>
              </>
            );
          })}

          {treelist.map((node: any, i: any) => {
            return (
              <>
                <div
                  className={`cursor-pointer point point-${i + 1}-${pathkey} ${
                    treeNode == i + 1 ? "invert" : ""
                  }`}
                  style={{ backgroundImage: "url(" + node.icon?.url + ")" }}
                  onClick={() => setTreeNode(i + 1)}
                ></div>
              </>
            );
          })}
        </div>
      </div>
      <div className="text-center">
        {treeNode > 0 ? (
          <div className="inline-block my-0.5 p-3 bg-slate-900 rounded-md border border-dark_50 w-96">
            {/* Node Name */}
            <div className="text-l text-white font-bold">
              {treelist[treeNode - 1].name}
            </div>
            {/* Node Description */}
            <div
              className="text-sm text-white"
              dangerouslySetInnerHTML={{
                __html: treelist[treeNode - 1].description,
              }}
            ></div>

            <div className="text-sm text-gray-500">
              {treelist[treeNode - 1].req_ascension ? (
                <div>Req Asc. {treelist[treeNode - 1].req_ascension}</div>
              ) : null}

              {treelist[treeNode - 1].req_level ? (
                <div>Req Lv. {treelist[treeNode - 1].req_level}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

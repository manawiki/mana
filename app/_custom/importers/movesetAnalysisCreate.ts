import path from "path";

import Payload from "payload";

import { manaSlug } from "../../utils/url-slug";
import { nanoid } from "nanoid";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;

const { JSDOM } = require("jsdom");

import { deserializeSlate } from "./deserializeSlate";

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      //@ts-ignore
      mongoURL: `${process.env.MONGODB_URI}/mana-prod` as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

// const data = require("./pokemon.json");

async function mapper() {
   const requests = Array.from({ length: 1 }, (_, i) =>
      fetch(
         `https://gamepress.gg/pokemongo/pokemongo-export-full?page=${i}&_format=json`,
      ).then((response) => response.json()),
   );

   const getPokemon = await Promise.all(requests);

   const flattenedPokemon = getPokemon.flat();

   const uniquePokemon = flattenedPokemon.reduce((acc, curr) => {
      const existingPokemon = acc.find(
         (pokemon: any) => pokemon.title === curr.title,
      );
      if (!existingPokemon) {
         acc.push(curr);
      }
      return acc;
   }, []);

   try {
      await Promise.all(
         uniquePokemon.map(async (row: any) => {
            try {
               //PVE Analysis
               const existingPVEAnalysisEmbed = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     relationId: { equals: manaSlug(row?.title) },
                     subSectionId: { equals: "pve-analysis" },
                  },
               });

               if (existingPVEAnalysisEmbed.docs.length == 0) {
                  // deserializeSlate() accepts HTML and converts it
                  const pveOffensiveOverview = deserializeSlate(
                     new JSDOM(
                        row?.field_pokemon_overview.replace(/[\n\t]/g, ""),
                     ).window.document.body,
                  );

                  const pveOffensive = deserializeSlate(
                     new JSDOM(
                        row?.field_offensive_moves_explanatio.replace(
                           /[\n\t]/g,
                           "",
                        ),
                     ).window.document.body,
                  );
                  console.log(pveOffensive, "pveOffensive thingyy");
                  const pveDefensive = deserializeSlate(
                     new JSDOM(
                        row?.field_defensive_moves_explanatio.replace(
                           /[\n\t]/g,
                           "",
                        ),
                     ).window.document.body,
                  );

                  await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        subSectionId: "pve-analysis",
                        relationId: manaSlug(row?.title),
                        name: row?.title,
                        site: "npY1abcTr6",
                        collectionEntity: "npY1abcTr6pokemon",
                        author: "643fc4b599231b1364d3ae87",
                        content: [
                           ...pveOffensiveOverview,
                           ...(pveOffensive[0].text !== ""
                              ? [
                                   {
                                      type: "h3",
                                      id: nanoid(),
                                      children: [
                                         {
                                            text: "Best PvE Offensive Moveset",
                                         },
                                      ],
                                   },
                                   {
                                      type: "table",
                                      id: nanoid(),
                                      tableLayout: "auto",
                                      tableStyle: "rounded",
                                      children: [
                                         {
                                            type: "table-body",
                                            children: [
                                               {
                                                  type: "table-row",
                                                  children: [
                                                     {
                                                        type: "header-cell",
                                                        children: [
                                                           {
                                                              id: nanoid(),
                                                              type: "table-content",
                                                              children: [
                                                                 {
                                                                    text: "",
                                                                 },
                                                              ],
                                                           },
                                                        ],
                                                     },
                                                     {
                                                        type: "header-cell",
                                                        children: [
                                                           {
                                                              id: nanoid(),
                                                              type: "table-content",
                                                              children: [
                                                                 {
                                                                    text: "Best",
                                                                    greenBG:
                                                                       true,
                                                                 },
                                                              ],
                                                           },
                                                        ],
                                                        align: "center",
                                                     },
                                                  ],
                                               },
                                            ],
                                         },
                                      ],
                                   },
                                   ...pveOffensive,
                                ]
                              : []),
                           ...(pveDefensive[0].text !== ""
                              ? [
                                   {
                                      type: "h3",
                                      id: nanoid(),
                                      children: [
                                         {
                                            text: "Best PvE Defensive Moveset",
                                         },
                                      ],
                                   },
                                   {
                                      type: "table",
                                      id: nanoid(),
                                      tableLayout: "auto",
                                      children: [
                                         {
                                            type: "table-body",
                                            children: [
                                               {
                                                  type: "table-row",
                                                  children: [
                                                     {
                                                        type: "header-cell",
                                                        children: [
                                                           {
                                                              id: nanoid(),
                                                              type: "table-content",
                                                              children: [
                                                                 {
                                                                    text: "",
                                                                 },
                                                              ],
                                                           },
                                                        ],
                                                     },
                                                     {
                                                        type: "header-cell",
                                                        children: [
                                                           {
                                                              id: nanoid(),
                                                              type: "table-content",
                                                              children: [
                                                                 {
                                                                    text: "Best",
                                                                    greenBG:
                                                                       true,
                                                                 },
                                                              ],
                                                           },
                                                        ],
                                                        align: "center",
                                                     },
                                                  ],
                                               },
                                            ],
                                         },
                                      ],
                                      tableStyle: "rounded",
                                   },
                                   ...pveDefensive,
                                ]
                              : []),
                        ],
                     },
                  });
               }

               //PVP Analysis

               const existingPVPAnalysisEmbed = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     relationId: { equals: manaSlug(row?.title) },
                     subSectionId: { equals: "pvp-analysis" },
                  },
               });

               if (existingPVPAnalysisEmbed.docs.length == 0) {
                  const pvpOffensive = deserializeSlate(
                     new JSDOM(
                        row?.field_pve_rating_explanation.replace(
                           /[\n\t]/g,
                           "",
                        ),
                     ).window.document.body,
                  );

                  const pvpLeagues = deserializeSlate(
                     new JSDOM(
                        row?.field_pvp_rating_explanation.replace(
                           /[\n\t]/g,
                           "",
                        ),
                     ).window.document.body,
                  );

                  await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        subSectionId: "pvp-analysis",
                        relationId: manaSlug(row?.title),
                        name: row?.title,
                        site: "npY1abcTr6",
                        collectionEntity: "npY1abcTr6pokemon",
                        author: "643fc4b599231b1364d3ae87",
                        content: [
                           ...(pvpOffensive[0].text !== ""
                              ? [...pvpOffensive]
                              : []),
                           ...(pvpLeagues[0].text !== ""
                              ? [...pvpLeagues]
                              : []),
                           {
                              type: "table",
                              id: nanoid(),
                              tableLayout: "auto",
                              children: [
                                 {
                                    type: "table-body",
                                    children: [
                                       {
                                          type: "table-row",
                                          children: [
                                             {
                                                type: "header-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            text: "Great League",
                                                            blueBG: true,
                                                         },
                                                      ],
                                                   },
                                                ],
                                             },
                                             {
                                                type: "header-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            text: "4 / 5",
                                                            greenBG: true,
                                                         },
                                                      ],
                                                   },
                                                ],
                                                align: "center",
                                             },
                                          ],
                                       },
                                       {
                                          type: "table-row",
                                          children: [
                                             {
                                                type: "table-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            id: nanoid(),
                                                            type: "paragraph",
                                                            children: [
                                                               {
                                                                  text: "",
                                                               },
                                                            ],
                                                         },
                                                      ],
                                                   },
                                                ],
                                                colSpan: 2,
                                             },
                                          ],
                                       },
                                       {
                                          type: "table-row",
                                          children: [
                                             {
                                                type: "header-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            text: "Ultra League",
                                                            yellowBG: true,
                                                         },
                                                      ],
                                                   },
                                                ],
                                             },
                                             {
                                                type: "header-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            text: " / 5",
                                                            greenBG: true,
                                                         },
                                                      ],
                                                   },
                                                ],
                                                align: "center",
                                             },
                                          ],
                                       },
                                       {
                                          type: "table-row",
                                          children: [
                                             {
                                                type: "table-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            text: "",
                                                         },
                                                      ],
                                                   },
                                                ],
                                                colSpan: 2,
                                             },
                                          ],
                                       },
                                       {
                                          type: "table-row",
                                          children: [
                                             {
                                                type: "header-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            text: "Master League",
                                                            violetBG: true,
                                                         },
                                                      ],
                                                   },
                                                ],
                                             },
                                             {
                                                type: "header-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            text: " / 5",
                                                            greenBG: true,
                                                         },
                                                      ],
                                                   },
                                                ],
                                                align: "center",
                                             },
                                          ],
                                       },
                                       {
                                          type: "table-row",
                                          children: [
                                             {
                                                type: "table-cell",
                                                children: [
                                                   {
                                                      type: "table-content",
                                                      children: [
                                                         {
                                                            text: "",
                                                         },
                                                      ],
                                                   },
                                                ],
                                                colSpan: 2,
                                             },
                                          ],
                                       },
                                    ],
                                 },
                              ],
                              tableStyle: "rounded",
                           },
                        ],
                     },
                  });
               }

               console.log(`Document added successfully`);
            } catch (e) {
               payload.logger.error(`Document failed to update`);

               payload.logger.error(e);
            }
         }),
      );
   } catch (e) {
      payload.logger.error("Something went wrong.");
      payload.logger.error(e);
   }

   console.log("Complete");
   process.exit(0);
}

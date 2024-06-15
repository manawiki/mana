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
                  // Assuming deserializeSlate() now accepts HTML and converts it
                  const pveOffensiveMovesetAnalysisHTMLContent =
                     row?.field_pokemon_overview;

                  // Parse the HTML content
                  const dom = new JSDOM(pveOffensiveMovesetAnalysisHTMLContent);

                  const document = dom.window.document.body;

                  console.log(document, "DOCUMENT Format");

                  const pveOffensiveMovesetAnalysis =
                     deserializeSlate(document);

                  console.log(
                     pveOffensiveMovesetAnalysis,
                     "pveOffensiveMovesetAnalysis Format",
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
                           {
                              type: "h3",
                              id: nanoid(),
                              children: [
                                 {
                                    text: "Best PvE Offensive Moveset",
                                 },
                              ],
                           },
                           ...pveOffensiveMovesetAnalysis,
                           {
                              type: "table",
                              id: nanoid(),
                              tableLayout: "auto",
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
                                                            greenBG: true,
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
                           // {
                           //    type: "paragraph",
                           //    id: nanoid(),
                           //    children: [
                           //       {
                           //          text: row?.field_offensive_moves_explanatio,
                           //       },
                           //    ],
                           // },
                           {
                              id: nanoid(),
                              type: "h3",
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
                                    id: nanoid(),
                                    type: "paragraph",
                                    children: [
                                       {
                                          text: "",
                                       },
                                    ],
                                 },
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
                                                            greenBG: true,
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
                           {
                              id: nanoid(),
                              type: "paragraph",
                              children: [
                                 {
                                    text: "",
                                    // text: row?.field_defensive_moves_explanatio,
                                 },
                              ],
                           },
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
                           {
                              id: nanoid(),
                              type: "paragraph",
                              children: [
                                 {
                                    type: "paragraph",
                                    id: nanoid(),
                                    children: [
                                       {
                                          //This one is weird i know
                                          text: "",
                                          // text: row?.field_pve_rating_explanation,
                                       },
                                    ],
                                 },
                              ],
                           },

                           {
                              id: nanoid(),
                              type: "paragraph",
                              children: [
                                 {
                                    type: "paragraph",
                                    id: nanoid(),
                                    children: [
                                       {
                                          text: "",
                                          // text: row?.field_pvp_rating_explanation,
                                       },
                                    ],
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

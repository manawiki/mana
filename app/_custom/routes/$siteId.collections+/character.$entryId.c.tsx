import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { EntryHeader } from "~/routes/$siteId.collections+/$collectionId.$entryId/EntryHeader";
import {
   EntryContent,
   EntryParent,
} from "~/routes/$siteId.collections+/$collectionId.$entryId/EntryWrappers";
import {
   getCustomEntryData,
   getDefaultEntryData,
   meta,
} from "~/routes/$siteId.collections+/$collectionId.$entryId/entryDefaults";
import type { CharacterLKJ16E5IhH } from "payload/generated-types";
import { Image } from "~/components/Image";

import { CharacterStatBlock } from "~/_custom/components/characters/CharacterStatBlock";
import { ImageGallery } from "~/_custom/components/characters/ImageGallery";
import { SkillTree } from "~/_custom/components/characters/SkillTree";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });
   const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as CharacterLKJ16E5IhH;

   //Feel free to query for more data here

   return json({ entryDefault, defaultData });
}

export default function CharacterEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();

   console.log(entryDefault);
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Character Image with Element / Path */}
            <CharacterStatBlock pageData={pageData} />

            {/* Skill Tree */}
            <SkillTree pageData={pageData} />

            {/* Image Gallery Section showing all relevant images */}
            <ImageGallery pageData={pageData} />
         </EntryContent>
      </EntryParent>
   );
}

const Header = () => {
   const { defaultData } = useLoaderData<typeof loader>();

   return (
      <>
         <div>{defaultData}</div>
      </>
   );
};

const Stats = () => {
   return <div>This is stats</div>;
};

// ========================================
// Lol manually putting stat data in for now since not sure if Strapi ready to go
// --- Will be loaded properly from DB ---
// ========================================
// ========================================
// ========================================
var pageData = {
   attributes: {
      images: {
         icon: {
            data: {
               attributes: {
                  url: "https://i.imgur.com/2i2CRUA.png",
               },
            },
         },
      },
      image_full_bg: {
         data: {
            attributes: {
               url: "https://i.imgur.com/WYwRODJ.png",
            },
         },
      },
      image_full_front: {
         data: {
            attributes: {
               url: "https://i.imgur.com/LR8KBNJ.png",
            },
         },
      },
      image_full: {
         data: {
            attributes: {
               url: "https://i.imgur.com/j2mfXeD.png",
            },
         },
      },
      term_element: {
         data: {
            attributes: {
               icon: {
                  data: {
                     attributes: {
                        url: "https://i.imgur.com/bjdKgXv.png",
                     },
                  },
               },
            },
         },
      },
      term_path: {
         data: {
            attributes: {
               name: "Preservation",
               data_key: "Knight",
               image_tattoo: {
                  data: {
                     attributes: {
                        url: "https://i.imgur.com/l6Nogxc.png",
                     },
                  },
               },
            },
         },
      },
      stats: [
         {
            label: "Lv",
            data: [
               "1",
               "2",
               "3",
               "4",
               "5",
               "6",
               "7",
               "8",
               "9",
               "10",
               "11",
               "12",
               "13",
               "14",
               "15",
               "16",
               "17",
               "18",
               "19",
               "20",
               "20A",
               "21",
               "22",
               "23",
               "24",
               "25",
               "26",
               "27",
               "28",
               "29",
               "30",
               "31",
               "32",
               "33",
               "34",
               "35",
               "36",
               "37",
               "38",
               "39",
               "40",
               "40A",
               "41",
               "42",
               "43",
               "44",
               "45",
               "46",
               "47",
               "48",
               "49",
               "50",
               "50A",
               "51",
               "52",
               "53",
               "54",
               "55",
               "56",
               "57",
               "58",
               "59",
               "60",
               "60A",
               "61",
               "62",
               "63",
               "64",
               "65",
               "66",
               "67",
               "68",
               "69",
               "70",
               "70A",
               "71",
               "72",
               "73",
               "74",
               "75",
               "76",
               "77",
               "78",
               "79",
               "80",
            ],
         },
         {
            label: "HP",
            data: [
               "143.99999774017192",
               "155.51999755986995",
               "167.039997379568",
               "178.55999719926604",
               "190.0799970189641",
               "201.59999683866212",
               "213.11999665836015",
               "224.6399964780582",
               "236.15999629775627",
               "247.6799961174543",
               "259.1999959371523",
               "270.7199957568504",
               "282.2399955765484",
               "293.7599953962465",
               "305.2799952159445",
               "316.79999503564255",
               "328.3199948553406",
               "339.8399946750386",
               "351.35999449473667",
               "362.8799943144347",
               "478.07999250675846",
               "489.5999923264566",
               "501.1199921461546",
               "512.6399919658527",
               "524.1599917855507",
               "535.6799916052487",
               "547.1999914249468",
               "558.7199912446448",
               "570.2399910643428",
               "581.7599908840409",
               "593.2799907037389",
               "604.7999905234369",
               "616.319990343135",
               "627.839990162833",
               "639.359989982531",
               "650.8799898022291",
               "662.3999896219271",
               "673.9199894416251",
               "685.4399892613233",
               "696.9599890810213",
               "708.4799889007193",
               "823.6799870930431",
               "835.1999869127412",
               "846.7199867324391",
               "858.2399865521372",
               "869.7599863718353",
               "881.2799861915333",
               "892.7999860112313",
               "904.3199858309295",
               "915.8399856506275",
               "927.3599854703255",
               "938.8799852900236",
               "1054.0799834823474",
               "1065.5999833020453",
               "1077.1199831217434",
               "1088.6399829414415",
               "1100.1599827611394",
               "1111.6799825808375",
               "1123.1999824005356",
               "1134.7199822202335",
               "1146.2399820399316",
               "1157.7599818596298",
               "1169.2799816793276",
               "1284.4799798716515",
               "1295.9999796913496",
               "1307.5199795110475",
               "1319.0399793307456",
               "1330.5599791504437",
               "1342.0799789701418",
               "1353.5999787898397",
               "1365.1199786095378",
               "1376.6399784292357",
               "1388.1599782489338",
               "1399.679978068632",
               "1514.8799762600245",
               "1526.3999760797224",
               "1537.9199758994205",
               "1549.4399757191186",
               "1560.9599755388167",
               "1572.4799753585148",
               "1583.9999751782127",
               "1595.5199749979106",
               "1607.0399748176087",
               "1618.5599746373068",
               "1630.079974457005",
            ],
         },
         {
            label: "ATK",
            data: [
               "69.59999890830855",
               "75.16799882089873",
               "80.73599873348891",
               "86.30399864607908",
               "91.87199855866926",
               "97.43999847125944",
               "103.00799838384961",
               "108.57599829643979",
               "114.14399820902997",
               "119.71199812162016",
               "125.27999803421034",
               "130.8479979468005",
               "136.4159978593907",
               "141.98399777198085",
               "147.55199768457103",
               "153.11999759716122",
               "158.6879975097514",
               "164.25599742234158",
               "169.82399733493176",
               "175.39199724752194",
               "231.0719963734237",
               "236.6399962860139",
               "242.20799619860406",
               "247.77599611119425",
               "253.34399602378443",
               "258.91199593637464",
               "264.4799958489648",
               "270.04799576155494",
               "275.61599567414515",
               "281.1839955867353",
               "286.7519954993255",
               "292.31999541191567",
               "297.8879953245058",
               "303.45599523709603",
               "309.02399514968624",
               "314.5919950622764",
               "320.15999497486655",
               "325.72799488745676",
               "331.2959948000469",
               "336.8639947126371",
               "342.4319946252273",
               "398.11199375206036",
               "403.67999366465057",
               "409.2479935772408",
               "414.81599348983093",
               "420.3839934024211",
               "425.95199331501124",
               "431.51999322760145",
               "437.08799314019166",
               "442.6559930527818",
               "448.22399296537196",
               "453.7919928779621",
               "509.47199200386393",
               "515.0399919164541",
               "520.6079918290443",
               "526.1759917416346",
               "531.7439916542246",
               "537.3119915668149",
               "542.879991479405",
               "548.4479913919952",
               "554.0159913045854",
               "559.5839912171755",
               "565.1519911297657",
               "620.8319902556675",
               "626.3999901682577",
               "631.9679900808478",
               "637.5359899934381",
               "643.1039899060282",
               "648.6719898186184",
               "654.2399897312085",
               "659.8079896437987",
               "665.375989556389",
               "670.9439894689791",
               "676.5119893815693",
               "732.191988507471",
               "737.7599884200613",
               "743.3279883326514",
               "748.8959882452416",
               "754.4639881578319",
               "760.0319880704219",
               "765.5999879830122",
               "771.1679878956023",
               "776.7359878081925",
               "782.3039877207827",
               "787.8719876333729",
            ],
         },
         {
            label: "DEF",
            data: [
               "77.99999877592646",
               "84.2399986782241",
               "90.47999858052172",
               "96.71999848281936",
               "102.95999838511699",
               "109.19999828741463",
               "115.43999818971227",
               "121.6799980920099",
               "127.91999799430752",
               "134.15999789660515",
               "140.3999977989028",
               "146.63999770120043",
               "152.87999760349805",
               "159.1199975057957",
               "165.35999740809334",
               "171.59999731039096",
               "177.83999721268862",
               "184.07999711498624",
               "190.31999701728387",
               "196.55999691958152",
               "258.9599959406952",
               "265.19999584299285",
               "271.4399957452905",
               "277.6799956475881",
               "283.9199955498857",
               "290.15999545218335",
               "296.399995354481",
               "302.63999525677866",
               "308.8799951590763",
               "315.1199950613739",
               "321.3599949636715",
               "327.59999486596917",
               "333.8399947682668",
               "340.0799946705645",
               "346.3199945728621",
               "352.5599944751597",
               "358.7999943774573",
               "365.039994279755",
               "371.27999418205263",
               "377.5199940843503",
               "383.7599939866479",
               "446.15999300776156",
               "452.39999291005915",
               "458.6399928123568",
               "464.87999271465446",
               "471.1199926169521",
               "477.3599925192497",
               "483.59999242154737",
               "489.83999232384497",
               "496.0799922261426",
               "502.3199921284403",
               "508.5599920307379",
               "570.9599910509203",
               "577.1999909532179",
               "583.4399908555156",
               "589.6799907578131",
               "595.9199906601109",
               "602.1599905624084",
               "608.3999904647061",
               "614.6399903670037",
               "620.8799902693014",
               "627.119990171599",
               "633.3599900738966",
               "695.7599890950103",
               "701.9999889973079",
               "708.2399888996056",
               "714.4799888019032",
               "720.7199887042009",
               "726.9599886064984",
               "733.1999885087962",
               "739.4399884110937",
               "745.6799883133914",
               "751.919988215689",
               "758.1599881179866",
               "820.5599871381689",
               "826.7999870404667",
               "833.0399869427642",
               "839.2799868450619",
               "845.5199867473596",
               "851.7599866496571",
               "857.9999865519549",
               "864.2399864542524",
               "870.4799863565501",
               "876.7199862588477",
               "882.9599861611454",
            ],
         },
         {
            label: "Speed",
            data: [
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
               "100.99999841498169",
            ],
         },
         {
            label: "CritRate",
            data: [
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
               "0.049999999494734236",
            ],
         },
         {
            label: "CritDMG",
            data: [
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
               "0.499999992619036",
            ],
         },
         {
            label: "BaseAggro",
            data: [
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
               "149.99999764601242",
            ],
         },
      ],
      image_team_icon: {
         data: {
            attributes: {
               url: "https://i.imgur.com/bC2QUE4.png",
            },
         },
      },
      image_round_icon: {
         data: {
            attributes: {
               url: "https://i.imgur.com/R8LlUpM.png",
            },
         },
      },
      image_battle_detail: {
         data: {
            attributes: {
               url: "https://i.imgur.com/x4DWzkQ.png",
            },
         },
      },
      term_rarity: {
         data: {
            attributes: {
               rarity_stars: {
                  url: "https://i.imgur.com/9B1sAPC.png",
               },
            },
         },
      },
      traces: [
         {
            trace_id: 100101,
            name: "Frigid Cold Arrow",
            desc_simple: "Deals minor Ice DMG to a single enemy.",
            desc_type: "Basic ATK",
            icon_name: "SkillIcon_1001_Normal",
            icon_ultra_name: "",
            description_per_level: [
               {
                  level: 1,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>100%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
               {
                  level: 2,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>120%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
               {
                  level: 3,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>140%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
               {
                  level: 4,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>160%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
               {
                  level: 5,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>180%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
               {
                  level: 6,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>200%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
               {
                  level: 7,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>220%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
               {
                  level: 8,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>240%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
               {
                  level: 9,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>260%</unbreak></span> of March 7th\'s ATK to a single enemy.',
               },
            ],
            max_level: 9,
            damage_type: "Ice",
            attack_type: "Normal",
            effect_type: "SingleAttack",
            skill_combovalue: 9.999999843067494,
            init_cooldown: -1,
            cooldown: -1,
            sp_base: 19.999999686134989,
            sp_ratio: 0.499999992619036,
            bp_need: -0.9999999843067494,
            bp_add: 0.9999999843067494,
            skill_need: 371857150,
            delay_ratio: 0.9999999843067494,
            tag: "Single Target",
            icon: {
               name: "SkillIcon_1001_Normal.png",
               url: "https://i.imgur.com/CR6aiSX.png",
            },
            checksum: "1cc9ca3f",
         },
         {
            trace_id: 100102,
            name: "The Power of Cuteness",
            desc_simple: "Provides a single ally with a Shield.",
            desc_type: "Skill",
            icon_name: "SkillIcon_1001_BP",
            icon_ultra_name: "",
            description_per_level: [
               {
                  level: 1,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>96%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>320</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 2,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>102%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>448</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 3,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>109%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>472</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 4,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>115%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>496</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 5,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>122%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>520</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 6,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>128%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>544</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 7,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>136%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>568</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 8,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>144%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>592</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 9,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>152%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>616</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 10,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>160%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>640</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 11,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>166%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>664</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 12,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>173%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>688</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 13,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>179%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>712</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 14,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>186%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>736</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
               {
                  level: 15,
                  description:
                     'Provides a single ally with a Shield that can absorb DMG equal to <span style=""color: #f29e38ff""><unbreak>192%</unbreak></span> of March 7th\'s DEF plus <span style=""color: #f29e38ff""><unbreak>760</unbreak></span> for <unbreak>6</unbreak> turn(s). If the ally\'s HP is <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of their Max HP or higher, greatly increases the chance of enemies attacking that ally.',
               },
            ],
            max_level: 15,
            attack_type: "BPSkill",
            effect_type: "Defence",
            skill_combovalue: 9.999999843067494,
            init_cooldown: -1,
            cooldown: -1,
            sp_base: 29.999999529202485,
            sp_ratio: 0.499999992619036,
            bp_need: 0.9999999843067494,
            skill_need: 371857150,
            delay_ratio: 0.9999999843067494,
            tag: "Defense",
            icon: {
               name: "SkillIcon_1001_BP.png",
               url: "https://i.imgur.com/MFz1i34.png",
            },
            checksum: "-5724553d",
         },
         {
            trace_id: 100103,
            name: "Glacial Cascade",
            desc_simple:
               "Deals Ice DMG to all enemies, with a high chance of Freezing them.",
            desc_type: "Ultimate",
            icon_name: "SkillIcon_1001_Ultra",
            icon_ultra_name: "SkillIcon_1001_Ultra_on",
            description_per_level: [
               {
                  level: 1,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>180%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>60%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 2,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>192%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>64%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 3,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>204%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>68%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 4,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>216%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>72%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 5,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>228%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>76%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 6,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>240%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>80%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 7,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>255%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>85%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 8,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>270%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>90%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 9,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>285%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>95%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 10,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>300%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>100%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 11,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>312%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>104%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 12,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>324%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>108%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 13,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>336%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>112%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 14,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>348%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>116%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
               {
                  level: 15,
                  description:
                     'Deals Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>360%</unbreak></span> of March 7th\'s ATK to all enemies. On a hit, the enemy has a <unbreak>100%</unbreak> base chance to be Frozen for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot act and will take Ice DoT equal to <span style=""color: #f29e38ff""><unbreak>120%</unbreak></span> of March 7th\'s ATK at the beginning of each turn.',
               },
            ],
            max_level: 15,
            damage_type: "Ice",
            attack_type: "Ultra",
            effect_type: "AoEAttack",
            skill_combovalue: 29.999999529202485,
            init_cooldown: -1,
            cooldown: -1,
            sp_base: 4.999999921533747,
            sp_ratio: 0.499999992619036,
            bp_need: -0.9999999843067494,
            skill_need: 371857150,
            delay_ratio: 0.9999999843067494,
            tag: "AoE ATK",
            icon: {
               name: "SkillIcon_1001_Ultra.png",
               url: "https://i.imgur.com/rvShdcr.png",
            },
            icon_ultra: {
               name: "SkillIcon_1001_Ultra_on.png",
               url: "https://i.imgur.com/rvShdcr.png",
            },
            checksum: "-6136a6e6",
         },
         {
            trace_id: 100104,
            name: "Girl Power",
            desc_type: "Talent",
            icon_name: "SkillIcon_1001_Passive",
            icon_ultra_name: "",
            description_per_level: [
               {
                  level: 1,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>100%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 2,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>110%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 3,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>120%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 4,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>130%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 5,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>140%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 6,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>150%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 7,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>162%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 8,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>175%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 9,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>187%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 10,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>200%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 11,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>210%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 12,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>220%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 13,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>230%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 14,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>240%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
               {
                  level: 15,
                  description:
                     'After a shielded ally is attacked by an enemy, March 7th immediately Counters, dealing Ice DMG equal to <span style=""color: #f29e38ff""><unbreak>250%</unbreak></span> of her ATK. This effect can be triggered <unbreak>4</unbreak> time(s) each turn.',
               },
            ],
            max_level: 15,
            damage_type: "Ice",
            effect_type: "SingleAttack",
            skill_combovalue: 19.999999686134989,
            init_cooldown: -1,
            cooldown: -1,
            sp_base: 9.999999843067494,
            sp_ratio: 0.499999992619036,
            bp_need: -0.9999999843067494,
            skill_need: 371857150,
            delay_ratio: 0.9999999843067494,
            tag: "Single Target",
            icon: {
               name: "SkillIcon_1001_Passive.png",
               url: "https://i.imgur.com/47Ev1rj.png",
            },
            checksum: "4f2537a3",
         },
         {
            trace_id: 100106,
            name: "Attack",
            icon_name: "SkillIcon_1001_Normal",
            icon_ultra_name: "",
            description_per_level: [
               {
                  level: 1,
                  description:
                     "Upon attacking an enemy and entering battle, the enemy target's corresponding Type Toughness will be Weakened.",
               },
            ],
            max_level: 1,
            damage_type: "Ice",
            attack_type: "MazeNormal",
            effect_type: "MazeAttack",
            init_cooldown: -1,
            cooldown: -1,
            sp_ratio: 0.499999992619036,
            bp_need: -0.9999999843067494,
            skill_need: 371857150,
            delay_ratio: 0.9999999843067494,
            icon: {
               name: "SkillIcon_1001_Normal.png",
               url: "https://i.imgur.com/CR6aiSX.png",
            },
            checksum: "13598af1",
         },
         {
            trace_id: 100107,
            name: "Freezing Beauty",
            desc_type: "Technique",
            icon_name: "SkillIcon_1001_Maze",
            icon_ultra_name: "",
            description_per_level: [
               {
                  level: 1,
                  description:
                     "Immediately attacks the enemy. After entering battle, there is a <unbreak>200%</unbreak> base chance to Freeze a random enemy for <unbreak>2</unbreak> turn(s). While Frozen, the enemy cannot move and will take Ice DMG equal to <unbreak>100%</unbreak> of March 7th's ATK at the beginning of each turn.",
               },
            ],
            max_level: 1,
            damage_type: "Ice",
            attack_type: "Maze",
            effect_type: "MazeAttack",
            init_cooldown: -1,
            cooldown: -1,
            sp_ratio: 0.499999992619036,
            bp_need: -0.9999999843067494,
            skill_need: 371857150,
            delay_ratio: 0.9999999843067494,
            icon: {
               name: "SkillIcon_1001_Maze.png",
               url: "https://i.imgur.com/uSBw3NW.png",
            },
            checksum: "141636aa",
         },
      ],
      tree: [
         {
            point_id: 1001001,
            name: "Frigid Cold Arrow",
            description: "",
            character_id: 1001,
            point_type: 2,
            anchor: "Point01",
            max_level: 6,
            default_unlock: "true",
            icon_name: "SkillIcon_1001_Normal",
            level_up_cost: [
               {
                  level: 2,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 4000,
                     },
                     {
                        item: {
                           item_id: 110141,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 4,
                     },
                  ],
               },
               {
                  level: 3,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 8000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 4,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 16000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 3,
                     },
                  ],
               },
               {
                  level: 5,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 36000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 6,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 128000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 3,
                     },
                  ],
               },
            ],
            affected_skill: [
               {
                  data_key: 100101,
               },
            ],
            icon: {
               name: "SkillIcon_1001_Normal.png",
               url: "https://i.imgur.com/CR6aiSX.png",
            },
            checksum: "1514cd4b",
         },
         {
            point_id: 1001002,
            name: "The Power of Cuteness",
            description: "",
            character_id: 1001,
            point_type: 2,
            anchor: "Point02",
            max_level: 10,
            default_unlock: "true",
            icon_name: "SkillIcon_1001_BP",
            level_up_cost: [
               {
                  level: 2,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 2000,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 3,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 4000,
                     },
                     {
                        item: {
                           item_id: 110141,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 4,
                     },
                  ],
               },
               {
                  level: 4,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 8000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 5,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 16000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 3,
                     },
                  ],
               },
               {
                  level: 6,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 24000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 5,
                     },
                  ],
               },
               {
                  level: 7,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 36000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 8,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 64000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 3,
                     },
                  ],
               },
               {
                  level: 9,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 128000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
               {
                  level: 10,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 240000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 11,
                     },
                     {
                        item: {
                           item_id: 241,
                        },
                        qty: 1,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
            ],
            affected_skill: [
               {
                  data_key: 100102,
               },
            ],
            icon: {
               name: "SkillIcon_1001_BP.png",
               url: "https://i.imgur.com/MFz1i34.png",
            },
            checksum: "1927d0f7",
         },
         {
            point_id: 1001003,
            name: "Glacial Cascade",
            description: "",
            character_id: 1001,
            point_type: 2,
            anchor: "Point03",
            max_level: 10,
            default_unlock: "true",
            icon_name: "SkillIcon_1001_Ultra",
            level_up_cost: [
               {
                  level: 2,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 2000,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 3,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 4000,
                     },
                     {
                        item: {
                           item_id: 110141,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 4,
                     },
                  ],
               },
               {
                  level: 4,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 8000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 5,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 16000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 3,
                     },
                  ],
               },
               {
                  level: 6,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 24000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 5,
                     },
                  ],
               },
               {
                  level: 7,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 36000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 8,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 64000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 3,
                     },
                  ],
               },
               {
                  level: 9,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 128000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
               {
                  level: 10,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 240000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 11,
                     },
                     {
                        item: {
                           item_id: 241,
                        },
                        qty: 1,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
            ],
            affected_skill: [
               {
                  data_key: 100103,
               },
            ],
            icon: {
               name: "SkillIcon_1001_Ultra.png",
               url: "https://i.imgur.com/rvShdcr.png",
            },
            checksum: "19259151",
         },
         {
            point_id: 1001004,
            name: "Girl Power",
            description: "",
            character_id: 1001,
            point_type: 2,
            anchor: "Point04",
            max_level: 10,
            default_unlock: "true",
            icon_name: "SkillIcon_1001_Passive",
            level_up_cost: [
               {
                  level: 2,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 2000,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 3,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 4000,
                     },
                     {
                        item: {
                           item_id: 110141,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 4,
                     },
                  ],
               },
               {
                  level: 4,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 8000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 5,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 16000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 3,
                     },
                  ],
               },
               {
                  level: 6,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 24000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 5,
                     },
                  ],
               },
               {
                  level: 7,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 36000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 2,
                     },
                  ],
               },
               {
                  level: 8,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 64000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 3,
                     },
                  ],
               },
               {
                  level: 9,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 128000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
               {
                  level: 10,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 240000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 11,
                     },
                     {
                        item: {
                           item_id: 241,
                        },
                        qty: 1,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
            ],
            affected_skill: [
               {
                  data_key: 100104,
               },
            ],
            icon: {
               name: "SkillIcon_1001_Passive.png",
               url: "https://i.imgur.com/47Ev1rj.png",
            },
            checksum: "19225c00",
         },
         {
            point_id: 1001007,
            name: "Freezing Beauty",
            description: "",
            character_id: 1001,
            point_type: 2,
            anchor: "Point05",
            max_level: 1,
            default_unlock: "true",
            icon_name: "SkillIcon_1001_Maze",
            affected_skill: [
               {
                  data_key: 100107,
               },
            ],
            icon: {
               name: "SkillIcon_1001_Maze.png",
               url: "https://i.imgur.com/uSBw3NW.png",
            },
            checksum: "126ff7b3",
         },
         {
            point_id: 1001101,
            name: "Purify",
            description: "March 7th's Skill removes 1 debuff from the target.",
            character_id: 1001,
            point_type: 3,
            anchor: "Point06",
            max_level: 1,
            req_ascension: 2,
            default_unlock: "false",
            pre_point: "1001201",
            icon_name: "SkillIcon_1001_SkillTree1",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 4000,
                     },
                     {
                        item: {
                           item_id: 110141,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
            ],
            icon: {
               name: "SkillIcon_1001_SkillTree1.png",
               url: "https://i.imgur.com/e7VnnQF.png",
            },
            checksum: "12d00725",
         },
         {
            point_id: 1001102,
            name: "Reinforce",
            description:
               "The duration of the Shield generated from her Skill is extended for <unbreak>2</unbreak> turn(s).",
            character_id: 1001,
            point_type: 3,
            anchor: "Point07",
            max_level: 1,
            req_ascension: 4,
            default_unlock: "false",
            pre_point: "1001201",
            icon_name: "SkillIcon_1001_SkillTree2",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 16000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 241,
                        },
                        qty: 1,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
            ],
            icon: {
               name: "SkillIcon_1001_SkillTree2.png",
               url: "https://i.imgur.com/k3GP2gX.png",
            },
            checksum: "130bca61",
         },
         {
            point_id: 1001103,
            name: "Ice Spell",
            description:
               "Increases Ultimate's base chance to Freeze enemies by <unbreak>30%</unbreak>.",
            character_id: 1001,
            point_type: 3,
            anchor: "Point08",
            max_level: 1,
            req_ascension: 6,
            default_unlock: "false",
            icon_name: "SkillIcon_1001_SkillTree3",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 128000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 241,
                        },
                        qty: 1,
                     },
                     {
                        item: {
                           item_id: 110501,
                        },
                        qty: 1,
                     },
                  ],
               },
            ],
            icon: {
               name: "SkillIcon_1001_SkillTree3.png",
               url: "https://i.imgur.com/iJoHTq4.png",
            },
            checksum: "12effd87",
         },
         {
            point_id: 1001201,
            name: "DMG Boost: Ice",
            description: "Ice DMG increases by <unbreak>3.2%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point09",
            max_level: 1,
            req_level: 1,
            default_unlock: "false",
            icon_name: "IconIceAddedRatio",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 2000,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 2,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "IceAddedRatio",
                  value: 0.03199999938791992,
               },
            ],
            icon: {
               name: "IconIceAddedRatio.png",
               url: "https://i.imgur.com/ClvLG9z.png",
            },
            checksum: "12ce6bcc",
         },
         {
            point_id: 1001202,
            name: "DEF Boost",
            description: "DEF increases by <unbreak>5.0%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point10",
            max_level: 1,
            req_ascension: 2,
            default_unlock: "false",
            pre_point: "1001101",
            icon_name: "IconDefence",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 4000,
                     },
                     {
                        item: {
                           item_id: 110141,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111011,
                        },
                        qty: 4,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "DefenceAddedRatio",
                  value: 0.0499999992619036,
               },
            ],
            icon: {
               name: "IconDefence.png",
               url: "https://i.imgur.com/N91Re5w.png",
            },
            checksum: "12e858b1",
         },
         {
            point_id: 1001203,
            name: "DMG Boost: Ice",
            description: "Ice DMG increases by <unbreak>3.2%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point11",
            max_level: 1,
            req_ascension: 3,
            default_unlock: "false",
            pre_point: "1001202",
            icon_name: "IconIceAddedRatio",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 8000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 2,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "IceAddedRatio",
                  value: 0.03199999938791992,
               },
            ],
            icon: {
               name: "IconIceAddedRatio.png",
               url: "https://i.imgur.com/ClvLG9z.png",
            },
            checksum: "12f420b1",
         },
         {
            point_id: 1001204,
            name: "Effect RES Boost",
            description: "Effect RES increases by <unbreak>2.7%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point12",
            max_level: 1,
            req_ascension: 3,
            default_unlock: "false",
            icon_name: "IconStatusResistance",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 8000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 2,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "StatusResistanceBase",
                  value: 0.0269999991124836,
               },
            ],
            icon: {
               name: "IconStatusResistance.png",
               url: "https://i.imgur.com/gAWWzzw.png",
            },
            checksum: "12f6eac2",
         },
         {
            point_id: 1001205,
            name: "DMG Boost: Ice",
            description: "Ice DMG increases by <unbreak>4.8%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point13",
            max_level: 1,
            req_ascension: 4,
            default_unlock: "false",
            pre_point: "1001102",
            icon_name: "IconIceAddedRatio",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 16000,
                     },
                     {
                        item: {
                           item_id: 110142,
                        },
                        qty: 4,
                     },
                     {
                        item: {
                           item_id: 111012,
                        },
                        qty: 3,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "IceAddedRatio",
                  value: 0.04799999873263392,
               },
            ],
            icon: {
               name: "IconIceAddedRatio.png",
               url: "https://i.imgur.com/ClvLG9z.png",
            },
            checksum: "12f4a798",
         },
         {
            point_id: 1001206,
            name: "Effect RES Boost",
            description: "Effect RES increases by <unbreak>4.0%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point14",
            max_level: 1,
            req_ascension: 5,
            default_unlock: "false",
            pre_point: "1001205",
            icon_name: "IconStatusResistance",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 36000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 2,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "StatusResistanceBase",
                  value: 0.03999999940952288,
               },
            ],
            icon: {
               name: "IconStatusResistance.png",
               url: "https://i.imgur.com/gAWWzzw.png",
            },
            checksum: "1304ef2a",
         },
         {
            point_id: 1001207,
            name: "DEF Boost",
            description: "DEF increases by <unbreak>7.5%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point15",
            max_level: 1,
            req_ascension: 5,
            default_unlock: "false",
            icon_name: "IconDefence",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 36000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 2,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 2,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "DefenceAddedRatio",
                  value: 0.07499999854360944,
               },
            ],
            icon: {
               name: "IconDefence.png",
               url: "https://i.imgur.com/N91Re5w.png",
            },
            checksum: "12dd628a",
         },
         {
            point_id: 1001208,
            name: "DMG Boost: Ice",
            description: "Ice DMG increases by <unbreak>4.8%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point16",
            max_level: 1,
            req_ascension: 6,
            default_unlock: "false",
            pre_point: "1001103",
            icon_name: "IconIceAddedRatio",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 128000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 6,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "IceAddedRatio",
                  value: 0.04799999873263392,
               },
            ],
            icon: {
               name: "IconIceAddedRatio.png",
               url: "https://i.imgur.com/ClvLG9z.png",
            },
            checksum: "12f54c51",
         },
         {
            point_id: 1001209,
            name: "DMG Boost: Ice",
            description: "Ice DMG increases by <unbreak>6.4%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point17",
            max_level: 1,
            req_level: 75,
            default_unlock: "false",
            pre_point: "1001208",
            icon_name: "IconIceAddedRatio",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 128000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 6,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "IceAddedRatio",
                  value: 0.06399999877583984,
               },
            ],
            icon: {
               name: "IconIceAddedRatio.png",
               url: "https://i.imgur.com/ClvLG9z.png",
            },
            checksum: "12f5ebfd",
         },
         {
            point_id: 1001210,
            name: "DEF Boost",
            description: "DEF increases by <unbreak>10.0%</unbreak>",
            character_id: 1001,
            point_type: 1,
            anchor: "Point18",
            max_level: 1,
            req_level: 80,
            default_unlock: "false",
            pre_point: "1001208",
            icon_name: "IconDefence",
            level_up_cost: [
               {
                  level: 1,
                  level_up_cost: [
                     {
                        item: {
                           item_id: 2,
                        },
                        qty: 128000,
                     },
                     {
                        item: {
                           item_id: 110143,
                        },
                        qty: 6,
                     },
                     {
                        item: {
                           item_id: 111013,
                        },
                        qty: 6,
                     },
                  ],
               },
            ],
            stat_added: [
               {
                  stat_type: "DefenceAddedRatio",
                  value: 0.0999999985238072,
               },
            ],
            icon: {
               name: "IconDefence.png",
               url: "https://i.imgur.com/N91Re5w.png",
            },
            checksum: "12eaa725",
         },
      ],
      stat_csv:
         "Lv,HP,ATK,DEF,Speed,CritRate,CritDMG,BaseAggro<br/>1,143.99999774017192,69.59999890830855,77.99999877592646,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>2,155.51999755986995,75.16799882089873,84.2399986782241,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>3,167.039997379568,80.73599873348891,90.47999858052172,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>4,178.55999719926604,86.30399864607908,96.71999848281936,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>5,190.0799970189641,91.87199855866926,102.95999838511699,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>6,201.59999683866212,97.43999847125944,109.19999828741463,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>7,213.11999665836015,103.00799838384961,115.43999818971227,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>8,224.6399964780582,108.57599829643979,121.6799980920099,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>9,236.15999629775627,114.14399820902997,127.91999799430752,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>10,247.6799961174543,119.71199812162016,134.15999789660515,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>11,259.1999959371523,125.27999803421034,140.3999977989028,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>12,270.7199957568504,130.8479979468005,146.63999770120043,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>13,282.2399955765484,136.4159978593907,152.87999760349805,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>14,293.7599953962465,141.98399777198085,159.1199975057957,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>15,305.2799952159445,147.55199768457103,165.35999740809334,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>16,316.79999503564255,153.11999759716122,171.59999731039096,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>17,328.3199948553406,158.6879975097514,177.83999721268862,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>18,339.8399946750386,164.25599742234158,184.07999711498624,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>19,351.35999449473667,169.82399733493176,190.31999701728387,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>20,362.8799943144347,175.39199724752194,196.55999691958152,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>20A,478.07999250675846,231.0719963734237,258.9599959406952,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>21,489.5999923264566,236.6399962860139,265.19999584299285,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>22,501.1199921461546,242.20799619860406,271.4399957452905,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>23,512.6399919658527,247.77599611119425,277.6799956475881,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>24,524.1599917855507,253.34399602378443,283.9199955498857,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>25,535.6799916052487,258.91199593637464,290.15999545218335,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>26,547.1999914249468,264.4799958489648,296.399995354481,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>27,558.7199912446448,270.04799576155494,302.63999525677866,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>28,570.2399910643428,275.61599567414515,308.8799951590763,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>29,581.7599908840409,281.1839955867353,315.1199950613739,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>30,593.2799907037389,286.7519954993255,321.3599949636715,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>31,604.7999905234369,292.31999541191567,327.59999486596917,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>32,616.319990343135,297.8879953245058,333.8399947682668,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>33,627.839990162833,303.45599523709603,340.0799946705645,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>34,639.359989982531,309.02399514968624,346.3199945728621,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>35,650.8799898022291,314.5919950622764,352.5599944751597,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>36,662.3999896219271,320.15999497486655,358.7999943774573,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>37,673.9199894416251,325.72799488745676,365.039994279755,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>38,685.4399892613233,331.2959948000469,371.27999418205263,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>39,696.9599890810213,336.8639947126371,377.5199940843503,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>40,708.4799889007193,342.4319946252273,383.7599939866479,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>40A,823.6799870930431,398.11199375206036,446.15999300776156,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>41,835.1999869127412,403.67999366465057,452.39999291005915,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>42,846.7199867324391,409.2479935772408,458.6399928123568,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>43,858.2399865521372,414.81599348983093,464.87999271465446,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>44,869.7599863718353,420.3839934024211,471.1199926169521,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>45,881.2799861915333,425.95199331501124,477.3599925192497,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>46,892.7999860112313,431.51999322760145,483.59999242154737,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>47,904.3199858309295,437.08799314019166,489.83999232384497,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>48,915.8399856506275,442.6559930527818,496.0799922261426,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>49,927.3599854703255,448.22399296537196,502.3199921284403,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>50,938.8799852900236,453.7919928779621,508.5599920307379,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>50A,1054.0799834823474,509.47199200386393,570.9599910509203,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>51,1065.5999833020453,515.0399919164541,577.1999909532179,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>52,1077.1199831217434,520.6079918290443,583.4399908555156,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>53,1088.6399829414415,526.1759917416346,589.6799907578131,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>54,1100.1599827611394,531.7439916542246,595.9199906601109,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>55,1111.6799825808375,537.3119915668149,602.1599905624084,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>56,1123.1999824005356,542.879991479405,608.3999904647061,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>57,1134.7199822202335,548.4479913919952,614.6399903670037,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>58,1146.2399820399316,554.0159913045854,620.8799902693014,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>59,1157.7599818596298,559.5839912171755,627.119990171599,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>60,1169.2799816793276,565.1519911297657,633.3599900738966,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>60A,1284.4799798716515,620.8319902556675,695.7599890950103,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>61,1295.9999796913496,626.3999901682577,701.9999889973079,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>62,1307.5199795110475,631.9679900808478,708.2399888996056,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>63,1319.0399793307456,637.5359899934381,714.4799888019032,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>64,1330.5599791504437,643.1039899060282,720.7199887042009,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>65,1342.0799789701418,648.6719898186184,726.9599886064984,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>66,1353.5999787898397,654.2399897312085,733.1999885087962,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>67,1365.1199786095378,659.8079896437987,739.4399884110937,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>68,1376.6399784292357,665.375989556389,745.6799883133914,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>69,1388.1599782489338,670.9439894689791,751.919988215689,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>70,1399.679978068632,676.5119893815693,758.1599881179866,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>70A,1514.8799762600245,732.191988507471,820.5599871381689,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>71,1526.3999760797224,737.7599884200613,826.7999870404667,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>72,1537.9199758994205,743.3279883326514,833.0399869427642,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>73,1549.4399757191186,748.8959882452416,839.2799868450619,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>74,1560.9599755388167,754.4639881578319,845.5199867473596,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>75,1572.4799753585148,760.0319880704219,851.7599866496571,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>76,1583.9999751782127,765.5999879830122,857.9999865519549,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>77,1595.5199749979106,771.1679878956023,864.2399864542524,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>78,1607.0399748176087,776.7359878081925,870.4799863565501,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>79,1618.5599746373068,782.3039877207827,876.7199862588477,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242<br/>80,1630.079974457005,787.8719876333729,882.9599861611454,100.99999841498169,0.049999999494734236,0.499999992619036,149.99999764601242",
   },
};

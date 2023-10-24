import fs from "fs";

/**
 * These are imported by the JSDoc in the transformers
 */
type Meta = {
   name: string;
   source: string;
   description?: string;
   license: string;
};

const iconTypeFile = "app/components/icons.d.ts";

export default function transformIcon(input: string, meta: Meta): string {
   //we'll get name from the meta.url file name
   const name = JSON.stringify(
      meta.source.split("/").pop()?.split(".")[0] || "icon",
   );

   console.log(name);

   const svg = input.replace(/<svg/, `<svg\n  id=${name}`);

   //Read the iconTypeFile from file system, add name to the type
   //and write it back to the file system
   let iconType = "";
   if (fs.existsSync(iconTypeFile)) {
      iconType = fs.readFileSync(iconTypeFile, "utf8");

      //make sure name doesn't already exist in type
      if (!iconType.includes(name)) {
         const newIconType = iconType.replace(
            /export type IconName =/g,
            `export type IconName =\n  | ${name}`,
         );
         fs.writeFileSync(iconTypeFile, newIconType, "utf8");
      }
   } else {
      //If it doesn't exist, create it
      fs.writeFileSync(
         iconTypeFile,
         `export type IconName =\n  | ${name}`,
         "utf8",
      );
   }

   return svg.toString().trim();
}

const fs = require("fs");

// We should probably avoid hard-coding the path like this
process?.env?.PAYLOAD_CONFIG_PATH === "./app/db/payload.custom.config.ts"
   ? cleanFile("./app/db/payload-custom-types.ts")
   : cleanFile("./app/db/payload-types.ts");

function cleanFile(file) {
   console.log(`Cleaning ${file}`);

   // Read the file
   let content = fs.readFileSync(file, "utf-8");

   // Fix Payload depth issues
   content = content
      .replace(/string \| (?=[A-Z])/g, "")
      .replace(/string\[\] \| (?=[A-Z])/g, "");

   // Write the file
   fs.writeFileSync(file, content, "utf-8");
}

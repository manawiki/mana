const fs = require("fs");

// We should probably avoid hard-coding the path like this
const file = "./app/db/payload-types.ts";

// Read the file
let content = fs.readFileSync(file, "utf-8");

// Make your changes to the content
content = content.replace(/string \| /g, "");

// Write the file
fs.writeFileSync(file, content, "utf-8");

## Collections

`collectionSlug.tsx` in this (`collections`} directory

```
import type { CollectionConfig } from "payload/types";

const Collection: CollectionConfig = {
   slug: "",
   fields: [
      {
         name: "entry",
         type: "relationship",
         relationTo: "entries",
         hasMany: false,
      },
   ],
};

export const CustomCollections = [];
```

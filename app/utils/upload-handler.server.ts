import type { Payload } from "@mana/db";
import { unstable_createFileUploadHandler } from "@remix-run/node";
import {
   unstable_composeUploadHandlers,
   unstable_createMemoryUploadHandler,
   unstable_parseMultipartFormData,
} from "@remix-run/server-runtime";
import { nanoid } from "nanoid";
import { extname } from "path";
import path from "path";
import { parseFormAny } from "react-zorm";
import type { ZodRawShape, ZodTypeAny } from "zod";
import { ZodType, z } from "zod";

//Insert file prefix and nanoid to avoid file name collision
const uploadHandler = ({ prefix }: { prefix: string }) =>
   unstable_composeUploadHandlers(
      unstable_createFileUploadHandler({
         file: ({ filename }) =>
            `${prefix}-${nanoid(12)}${extname(filename ?? "")}`,
      }),
      unstable_createMemoryUploadHandler()
   );

/**
 * The default parser for getMultipleFormData.
 * Parse the multiformdata and return the parsed data
 * We use a custom parser "parseFormAny" from Zorm to handle the file upload https://github.com/rileytomasek/zodix/issues/14
 */

export const getMultipleFormData = async <T extends ZodRawShape | ZodTypeAny>({
   request,
   prefix,
   schema,
}: {
   request: Request;
   prefix: string;
   schema: T;
}) => {
   const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler({ prefix })
   );
   const finalSchema = schema instanceof ZodType ? schema : z.object(schema);
   return await finalSchema.safeParseAsync(parseFormAny(formData));
   // return await zx.parseFormSafe(formData, schema, parseFormAny(formData));
};

//Uploads image to payload images collection and returns the id to update another collection
export const uploadImage = async ({
   payload,
   user,
   image,
}: {
   payload: Payload;
   image: {
      filepath: string;
   };
   user: any;
}) => {
   const imageUploadResult = await payload.create({
      collection: "images",
      data: {},
      filePath: path.resolve(__dirname, image.filepath),
      user,
      overrideAccess: false,
   });
   return imageUploadResult.id;
};

import { type ZodIssue } from "zod";

export function isProcessing(state: "idle" | "submitting" | "loading") {
   return state === "submitting" || state === "loading";
}

export function isAdding(item: any, type: string) {
   return item.state === "submitting" && item.formData.get("intent") === type;
}

export interface FormResponse {
   success?: string;
   error?: string;
   /**
    * Any server-side only issues
    */
   serverIssues?: ZodIssue[];
}

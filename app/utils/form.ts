import type { ZodIssue } from "zod";

export function isProcessing(state: "idle" | "submitting" | "loading") {
   return state === "submitting" || state === "loading";
}

export function isAdding(item: any, type: string) {
   return item.state === "submitting" && item.formData.get("intent") === type;
}

export function isLoading(item: any) {
   return item.state === "loading";
}

export interface FormResponse {
   success?: string;
   error?: string;
   /**
    * Any server-side only issues
    */
   serverIssues?: ZodIssue[];
}

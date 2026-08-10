/**
 * Enquiry validation.
 *
 * ONE SCHEMA, VALIDATED ON THE SERVER. The form is progressively enhanced —
 * it posts to a Server Action and works with JavaScript disabled — so the
 * server is the only place validation can be trusted. Nothing here is
 * duplicated client-side; the browser's own `required` / `type` attributes
 * carry the pre-submit hints and this carries the verdict.
 *
 * Zod 4: string formats are top-level (`z.email()`), and `z.flattenError`
 * replaces the removed `error.flatten()` method.
 */

import { z } from "zod";

/** Which form produced the submission. Shapes the required fields. */
export const ENQUIRY_KINDS = ["quote", "contact"] as const;
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];

/**
 * Trim first, then measure. Without this a field of spaces passes `min(2)`
 * and arrives at dispatch as an empty line.
 */
const text = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required.`)
    .max(max, `${label} is too long.`);

/** Optional text where the browser sends `""` rather than omitting the key. */
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().default("");

const base = {
  name: text(2, 80, "Your name"),
  company: optionalText(120),
  email: z.email("Enter a valid email address.").max(160),
  /*
   * Deliberately loose. Dispatch is called from job sites across Ontario and
   * abroad; a strict North-American pattern rejects a valid number far more
   * often than it catches a bad one, and the number is verified by someone
   * dialling it within the hour either way.
   */
  phone: text(7, 32, "A phone number"),
  message: optionalText(2000),
  /**
   * Honeypot. Hidden from sighted users AND from assistive tech, so a human
   * cannot fill it in; a bot that fills every field will.
   */
  website: optionalText(200),
};

export const quoteSchema = z.object({
  kind: z.literal("quote"),
  ...base,
  material: text(2, 120, "The material"),
  volume: optionalText(120),
  site: text(2, 160, "The site location"),
  schedule: optionalText(160),
  service: optionalText(120),
});

export const contactSchema = z.object({
  kind: z.literal("contact"),
  ...base,
  message: text(10, 2000, "A message"),
});

export const enquirySchema = z.discriminatedUnion("kind", [
  quoteSchema,
  contactSchema,
]);

export type Enquiry = z.infer<typeof enquirySchema>;

/** Field-keyed errors, in the shape the form renders them. */
export type FieldErrors = Partial<Record<string, string[]>>;

export function parseEnquiry(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return enquirySchema.safeParse(raw);
}

export function fieldErrorsOf(error: z.ZodError): FieldErrors {
  return z.flattenError(error).fieldErrors;
}

"use server";

import { COMPANY } from "@/content/company";
import { parseEnquiry, fieldErrorsOf, type FieldErrors } from "@/lib/validation";

/**
 * Enquiry submission.
 *
 * DELIVERY IS NOT WIRED UP AT BUILD TIME, and this file refuses to pretend
 * otherwise. A quote form that validates, says "thank you" and drops the
 * lead on the floor is worse than no form at all — the visitor believes
 * they have reached dispatch and stops trying.
 *
 * So there are exactly two outcomes:
 *
 *  · `ENQUIRY_WEBHOOK_URL` is set — the payload is POSTed to it and the
 *    visitor is told it arrived. Point it at whatever the client already
 *    runs (a CRM intake, Zapier/Make, a Resend or SendGrid function, an
 *    inbox relay); the payload is flat JSON with no service-specific shape.
 *  · It is NOT set — the visitor is told plainly that the form is not yet
 *    connected and handed a `mailto:` carrying everything they just typed,
 *    plus the dispatch number. The lead survives operator error.
 *
 * TODO(client): set `ENQUIRY_WEBHOOK_URL` in the deployment environment
 * before launch, and confirm the receiving endpoint returns 2xx.
 */

export type EnquiryState =
  | { status: "idle" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string; fieldErrors: FieldErrors }
  /** Validated and accepted, but there was nowhere to send it. */
  | { status: "unconfigured"; message: string; mailto: string };

export const INITIAL_ENQUIRY_STATE: EnquiryState = { status: "idle" };

/** Short human-quotable code, so a caller can reference their submission. */
function reference(): string {
  return `HK-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/** Readable transcript, used for both the webhook body and the fallback. */
function transcript(data: Record<string, unknown>): string {
  const LABELS: Record<string, string> = {
    name: "Name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    service: "Service",
    material: "Material",
    volume: "Volume",
    site: "Site location",
    schedule: "Schedule",
    message: "Notes",
  };

  return Object.entries(LABELS)
    .map(([key, label]) => [label, data[key]] as const)
    .filter(([, value]) => typeof value === "string" && value.length > 0)
    .map(([label, value]) => `${label}: ${value as string}`)
    .join("\n");
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = parseEnquiry(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Some details need another look.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }

  const { website, ...data } = parsed.data;

  /*
   * Honeypot tripped. Report success rather than an error: telling a bot
   * which field caught it is how it learns to skip that field next time.
   */
  if (website) return { status: "success", reference: reference() };

  const ref = reference();
  const subject =
    data.kind === "quote"
      ? `Quote request ${ref} — ${data.name}`
      : `Enquiry ${ref} — ${data.name}`;

  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;

  if (!endpoint) {
    const body = `${transcript(data)}\n\nReference: ${ref}`;
    return {
      status: "unconfigured",
      message:
        "This form is not connected to dispatch yet. Your details are ready to send by email, or call dispatch directly — nothing has been lost.",
      mailto: `mailto:${COMPANY.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`,
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        reference: ref,
        subject,
        submittedAt: new Date().toISOString(),
        transcript: transcript(data),
        ...data,
      }),
      // A visitor is waiting on this. Fail fast rather than hanging the form.
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) throw new Error(`Endpoint returned ${response.status}`);
  } catch (cause) {
    // Server-side only — the visitor gets a phone number, not a stack trace.
    console.error("[enquiry] delivery failed", { reference: ref, cause });
    return {
      status: "error",
      message: `We could not send that just now. Please call dispatch on ${COMPANY.phone} or email ${COMPANY.email}.`,
      fieldErrors: {},
    };
  }

  return { status: "success", reference: ref };
}

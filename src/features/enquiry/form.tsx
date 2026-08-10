"use client";

import { useActionState, useId } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/content/company";
import { SERVICES } from "@/content/services";
import { FLEET } from "@/content/fleet";
import type { EnquiryKind, FieldErrors } from "@/lib/validation";
import { cn } from "@/lib/utils";
import {
  submitEnquiry,
  INITIAL_ENQUIRY_STATE,
  type EnquiryState,
} from "@/features/enquiry/actions";

/**
 * Enquiry form.
 *
 * ONE COMPONENT, TWO FORMS. The quote form and the contact form differ by
 * four fields and a heading; building them separately would mean two
 * validation contracts, two error-rendering paths and two things to keep in
 * step. `kind` is also submitted as a hidden field, so the SERVER decides
 * which schema applies rather than trusting the shape of what arrived.
 *
 * PROGRESSIVE ENHANCEMENT IS THE POINT. The form posts to a Server Action,
 * so it submits and validates with JavaScript disabled or still loading —
 * which on a phone on a job site is a real state, not a hypothetical.
 * Everything the client adds is feedback: the pending label and the
 * in-place result panel.
 *
 * FIELDS ARE RULED, NOT BOXED. The rest of the site draws boundaries with
 * hairlines and reserves fills for surfaces; a stack of bordered input boxes
 * would be the most furniture on any page of the site.
 */

const INPUT_BASE =
  "w-full border-b bg-transparent py-3 text-[1.0625rem] text-ink transition-colors duration-500 placeholder:text-ink-4 focus:border-brand";

interface FieldProps {
  name: string;
  label: string;
  errors: FieldErrors;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  /** Suggestions the visitor may ignore — the field stays free text. */
  options?: readonly string[];
  rows?: number;
  className?: string;
}

function Field({
  name,
  label,
  errors,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
  hint,
  options,
  rows,
  className,
}: FieldProps) {
  const id = useId();
  const listId = `${id}-list`;
  const errorId = `${id}-error`;
  const error = errors[name]?.[0];

  const shared = {
    id,
    name,
    required,
    placeholder,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cn(INPUT_BASE, error ? "border-red-deep" : "border-line"),
  };

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="eyebrow">
          {label}
        </label>
        {!required && (
          <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-4">
            Optional
          </span>
        )}
      </div>

      {rows ? (
        <textarea {...shared} rows={rows} className={cn(shared.className, "resize-y")} />
      ) : (
        <input {...shared} type={type} list={options ? listId : undefined} />
      )}

      {options && (
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}

      {hint && !error && (
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-3">{hint}</p>
      )}

      {error && (
        <p id={errorId} className="mt-2 text-[0.8125rem] text-red-deep">
          {error}
        </p>
      )}
    </div>
  );
}

/** Deduplicated from the fleet model, so it cannot drift from what we haul. */
const MATERIALS = [...new Set(FLEET.flatMap((unit) => unit.payloads))].sort(
  (a, b) => a.localeCompare(b),
);

export function EnquiryForm({
  kind,
  className,
}: {
  kind: EnquiryKind;
  className?: string;
}) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    INITIAL_ENQUIRY_STATE,
  );

  const errors = state.status === "error" ? state.fieldErrors : {};
  const isQuote = kind === "quote";

  if (state.status === "success") {
    return (
      <div
        className={cn("rounded-panel bg-brand-wash p-8 md:p-12", className)}
        // The form is replaced by this panel, so focus is already lost from
        // the removed control — announce the result where focus lands next.
        role="status"
      >
        <span
          className="inline-flex size-11 items-center justify-center rounded-full bg-brand text-white"
          aria-hidden="true"
        >
          <Check className="size-5" />
        </span>
        <h3 className="type-h3 mt-7 text-ink">
          {isQuote ? "Your request is with dispatch." : "Your message is with us."}
        </h3>
        <p className="mt-4 max-w-md leading-relaxed text-ink-2">
          {isQuote
            ? "We will come back with the right configuration and a firm price. If the schedule is tight, call dispatch and quote your reference."
            : "We will be in touch. If it is urgent, call dispatch and quote your reference."}
        </p>
        <dl className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-brand/20 pt-6">
          <div className="flex items-baseline gap-3">
            <dt className="eyebrow">Reference</dt>
            <dd className="tnum text-[0.9375rem] font-medium text-ink">
              {state.reference}
            </dd>
          </div>
          <div className="flex items-baseline gap-3">
            <dt className="eyebrow">Dispatch</dt>
            <dd>
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="tnum text-[0.9375rem] font-medium text-brand"
              >
                {COMPANY.phone}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    /*
      `noValidate` hands ALL validation to the server so there is exactly one
      verdict and one way errors are drawn. Native constraint bubbles are
      unstyleable, appear in the browser's own voice, and would disagree with
      the server's messages on the same field. `required` stays on the inputs
      for assistive tech, which reads it as `aria-required`.
    */
    <form action={action} className={cn("flex flex-col gap-10", className)} noValidate>
      <input type="hidden" name="kind" value={kind} />

      {/*
        Honeypot. `hidden` keeps it out of the accessibility tree as well as
        off the screen, so no human — sighted or not — can reach it, while a
        bot filling every input in the DOM trips it. `tabIndex` and
        `autoComplete` are belt and braces for browsers that autofill
        hidden fields.
      */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        hidden
      />

      {(state.status === "error" || state.status === "unconfigured") && (
        <div
          role="alert"
          className={cn(
            "rounded-plate border p-6",
            state.status === "unconfigured"
              ? "border-line bg-paper-alt"
              : "border-red-deep/30 bg-red-wash",
          )}
        >
          <p className="text-[0.9375rem] leading-relaxed text-ink">
            {state.message}
          </p>
          {state.status === "unconfigured" && (
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a
                href={state.mailto}
                className="group/link inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brand"
              >
                Send it by email
                <ArrowRight
                  className="size-4 transition-transform duration-500 ease-[var(--ease-brand)] group-hover/link:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="tnum text-[0.9375rem] text-ink-2 transition-colors duration-500 hover:text-brand"
              >
                {COMPANY.phone}
              </a>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        <Field name="name" label="Your name" errors={errors} required autoComplete="name" />
        <Field name="company" label="Company" errors={errors} autoComplete="organization" />
        <Field
          name="email"
          label="Email"
          type="email"
          errors={errors}
          required
          autoComplete="email"
        />
        <Field
          name="phone"
          label="Phone"
          type="tel"
          errors={errors}
          required
          autoComplete="tel"
        />
      </div>

      {isQuote && (
        <>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            <Field
              name="service"
              label="Service"
              errors={errors}
              options={SERVICES.map((service) => service.name)}
              placeholder="Not sure — advise me"
            />
            <Field
              name="material"
              label="Material"
              errors={errors}
              required
              options={MATERIALS}
              hint="What is being moved, or taken away."
            />
            <Field
              name="volume"
              label="Volume"
              errors={errors}
              placeholder="e.g. 400 tonnes, or 12 loads/day"
            />
            <Field
              name="schedule"
              label="Schedule"
              errors={errors}
              placeholder="Start date and duration"
            />
          </div>

          <Field
            name="site"
            label="Site location"
            errors={errors}
            required
            hint="Nearest intersection is enough. Note any access constraint — overhead clearance, weight restriction, narrow entry."
          />
        </>
      )}

      <Field
        name="message"
        label={isQuote ? "Anything else" : "Message"}
        errors={errors}
        required={!isQuote}
        rows={isQuote ? 4 : 6}
      />

      <div className="flex flex-col items-start gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[0.8125rem] leading-relaxed text-ink-3">
          Your details go to dispatch and are used to answer this enquiry.
          Nothing is shared with anyone else.
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          arrow={!pending}
          className="shrink-0"
        >
          {pending ? "Sending…" : isQuote ? "Request a quote" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

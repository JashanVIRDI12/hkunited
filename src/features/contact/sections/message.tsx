import { COMPANY } from "@/content/company";
import { EnquiryForm } from "@/features/enquiry/form";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";

/**
 * Send a message.
 *
 * The SHORT form — name, company, email, phone, message. Anything that
 * needs material, volume, site and schedule belongs on /quote, and asking
 * for those here would turn a two-line question into a project brief and
 * lose the question.
 *
 * Both forms are the same component with the same server-side contract;
 * `kind` is what decides the fields and the schema. See
 * `features/enquiry/form.tsx`.
 */
export function Message() {
  return (
    <section className="section-y" aria-labelledby="message-heading">
      <div className="container-edge">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-8">Write</p>
            <SplitHeading id="message-heading" className="type-h1 max-w-[10ch] text-ink">
              Or put it in writing.
            </SplitHeading>
            <p className="mt-8 max-w-sm leading-relaxed text-ink-2">
              For anything that is not urgent, or that needs a record. If you
              already know what needs moving, the quote form asks the right
              questions instead.
            </p>
            <p className="mt-8 max-w-sm text-[0.9375rem] leading-relaxed text-ink-3">
              Urgent? Call dispatch on{" "}
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="tnum text-ink transition-colors duration-500 hover:text-brand"
              >
                {COMPANY.phone}
              </a>
              .
            </p>
          </div>

          <Reveal className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm kind="contact" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

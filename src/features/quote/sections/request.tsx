import { PROCESS } from "@/content/process";
import { COMPANY } from "@/content/company";
import { EnquiryForm } from "@/features/enquiry/form";
import { Reveal } from "@/components/motion/reveal";

/**
 * The request.
 *
 * THE FORM IS THE PAGE, so it gets the wide column and the aside carries
 * the reassurance rather than the other way round. A quote page that opens
 * on three paragraphs about why we are trustworthy has misread who is
 * reading it: they have already decided to ask, and every line before the
 * first field is a line between them and asking.
 *
 * The aside answers the one question a form cannot: what happens after I
 * press this. Those five steps are HK United's published operating
 * sequence, and they are the same five the homepage shows — as a horizontal
 * timeline there, as a ledger here, because a sidebar is read down.
 *
 * The form itself is progressively enhanced and validated on the server;
 * see `features/enquiry/form.tsx` and `features/enquiry/actions.ts`.
 */
export function Request() {
  return (
    <section className="section-y" aria-labelledby="request-heading">
      <div className="container-edge">
        <div className="grid gap-x-16 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-8">The request</p>
            <h2 id="request-heading" className="type-h1 max-w-[13ch] text-ink">
              Four things and we can price it.
            </h2>
            <p className="mt-8 max-w-[46ch] text-[1.0625rem] leading-[1.75] text-ink-2">
              Material, volume, site and schedule. Everything else — the unit,
              the sequence, the documentation — is ours to work out, and the
              more you tell us about access constraints the less of it we have
              to assume.
            </p>

            <Reveal className="mt-14">
              <EnquiryForm kind="quote" />
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-32">
              <h3 className="eyebrow mb-8">How a job runs</h3>

              <ol className="border-t border-line-strong">
                {PROCESS.map((step) => (
                  <li
                    key={step.index}
                    className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-2 border-b border-line py-6"
                  >
                    <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
                      {step.index}
                    </span>
                    <div>
                      <h4 className="text-[1.0625rem] font-medium tracking-tight text-ink">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-3">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-8 text-[0.9375rem] leading-relaxed text-ink-3">
                Would rather talk it through? Call dispatch on{" "}
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  className="tnum text-ink transition-colors duration-500 hover:text-brand"
                >
                  {COMPANY.phone}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

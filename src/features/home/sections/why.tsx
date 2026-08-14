import { CalendarCheck, Truck, ShieldCheck, History, FileCheck2 } from "lucide-react";
import { DIFFERENTIATORS } from "@/content/safety";
import { IMAGES } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { Panel, IconBadge, SectionLabel } from "@/components/ui/panel";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";

/**
 * Why they trust us — the bento.
 *
 * THE ASYMMETRY IS THE STRUCTURE, not decoration. A grid of equal tiles
 * says every point weighs the same, which is never true; here the tall dark
 * card is the argument the company actually wins on — sequence — and the
 * cards beside it are supporting. Someone who reads exactly one card reads
 * the right one.
 *
 * TWO DARK CARDS, PLACED DIAGONALLY. Adjacent dark cards merge into a
 * single shape and the grid stops reading as cards at all; on a diagonal
 * they read as emphasis. This is the rule referred to in
 * `components/ui/panel.tsx`.
 *
 * The copy is pulled from `DIFFERENTIATORS` by id rather than retyped, so
 * this section and /about's cannot drift apart.
 */
const by = (id: string) => {
  const item = DIFFERENTIATORS.find((d) => d.id === id);
  // A missing id is a content-model error, not a runtime condition to
  // handle: failing here beats rendering a card with an empty heading.
  if (!item) throw new Error(`Unknown differentiator: ${id}`);
  return item;
};

const RELIABILITY = by("reliability");
const EQUIPMENT = by("equipment");
const EXPERIENCE = by("experience");
const SAFETY = by("safety");

export function Why() {
  return (
    <section className="container-page band-y" aria-labelledby="why-heading">
      <SectionLabel>Advantages</SectionLabel>
      <SplitHeading
        id="why-heading"
        className="type-h2 mt-6 max-w-[16ch] text-ink"
      >
        Why they keep calling us back
      </SplitHeading>

      {/*
        THE BENTO STAGGERS IN READING ORDER, which is the only order that
        makes sense here: the tall dark card is the argument the company wins
        on, and it is first in the DOM precisely so it is read first. A grid
        that revealed from the centre or at random would undo that.
      */}
      <Reveal
        stagger
        variant="cards"
        className="mt-10 grid gap-3 md:mt-14 lg:grid-cols-12"
      >
        <Panel
          tone="dark"
          className="flex flex-col justify-between gap-16 p-7 lg:col-span-4 lg:row-span-2"
        >
          <div className="flex items-start justify-between gap-6">
            <h3 className="type-h3 max-w-[14ch] text-white">{RELIABILITY.heading}</h3>
            <IconBadge icon={CalendarCheck} tone="dark" />
          </div>
          <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/70">
            {RELIABILITY.body}
          </p>
        </Panel>

        {/* Fleet depth, shown rather than asserted. */}
        <Panel tone="paper" className="flex flex-col p-7 lg:col-span-4">
          <h3 className="type-h3 max-w-[16ch] text-ink">{EQUIPMENT.heading}</h3>
          <Media
            asset={IMAGES.fleetTerminal}
            ratio="16/10"
            radius="soft"
            className="mt-6 w-full"
            sizes="(max-width: 1024px) 100vw, 30vw"
          />
        </Panel>

        <Panel tone="paper" className="flex flex-col justify-between gap-10 p-7 lg:col-span-4">
          <div className="flex items-start justify-between gap-6">
            <h3 className="type-h3 max-w-[15ch] text-ink">{EXPERIENCE.heading}</h3>
            <IconBadge icon={History} />
          </div>
          <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-3">
            {EXPERIENCE.body}
          </p>
        </Panel>

        <Panel tone="paper" className="flex flex-col justify-between gap-10 p-7 lg:col-span-4">
          <div className="flex items-start justify-between gap-6">
            <h3 className="type-h3 max-w-[15ch] text-ink">{SAFETY.heading}</h3>
            <IconBadge icon={ShieldCheck} />
          </div>
          <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-3">
            {SAFETY.body}
          </p>
        </Panel>

        {/*
          Documentation. Not a `DIFFERENTIATOR` — it is drawn from the
          environmental hauling service line and the safety programme's
          audit practice, both of which are published. Kept local rather
          than added to the shared list because /about renders that list as
          a four-part narrative and a fifth entry would break it.
        */}
        <Panel tone="dark" className="flex flex-col justify-between gap-10 p-7 lg:col-span-4">
          <div className="flex items-start justify-between gap-6">
            <h3 className="type-h3 max-w-[15ch] text-white">
              Documentation travels with the load
            </h3>
            <IconBadge icon={FileCheck2} tone="dark" />
          </div>
          <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-white/70">
            Contaminated soil and regulated material are tracked to approved
            receiving sites, with trip inspections and log books maintained
            during the job rather than assembled after it.
          </p>
        </Panel>
      </Reveal>

      <Reveal className="mt-3">
        <Panel tone="sunk" className="flex flex-wrap items-center gap-x-6 gap-y-4 p-6">
          <IconBadge icon={Truck} />
          <p className="max-w-[70ch] text-[0.9375rem] leading-relaxed text-ink-2">
            Bulk, tank, waste and flatbed run under one operator — so a job
            needing three of them is still one phone call, one schedule and
            one point of contact.
          </p>
        </Panel>
      </Reveal>
    </section>
  );
}

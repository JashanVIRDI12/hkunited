import { CalendarCheck, Truck, ShieldCheck, History, FileCheck2 } from "lucide-react";
import { DIFFERENTIATORS } from "@/content/safety";
import { IMAGES } from "@/content/imagery";
import { Media } from "@/components/ui/media";
import { Panel, IconBadge, SectionLabel } from "@/components/ui/panel";
import { SplitHeading } from "@/components/motion/split-heading";
import { DepthScene } from "@/components/motion/depth-scene";

/**
 * Why they trust us — the bento, in a box.
 *
 * THE ASYMMETRY IS THE STRUCTURE, not decoration. A grid of equal tiles says
 * every point weighs the same, which is never true; here the tall dark card
 * is the argument the company actually wins on — sequence — and the cards
 * beside it are supporting. Someone who reads exactly one card reads the
 * right one.
 *
 * THE DEPTH IS THAT SAME HIERARCHY, MADE PHYSICAL. Every card carries a
 * `data-depth`, and the values are not decorative: the sequence card sits
 * furthest forward, the two dark cards that carry the emphasis sit forward of
 * the supporting ones, and the terms strip sits furthest back. The grid now
 * states its own priority twice — once in how much space each card takes, and
 * once in how close it is to you. `DepthScene` explains the mechanism and why
 * the perspective belongs to the section rather than to each card.
 *
 * The numbers are small on purpose. Perspective magnifies whatever it lifts,
 * so a wide depth spread would visibly resize the cards and eat the grid gap;
 * `gap-4` rather than the site's usual `gap-3` buys the margin that the ±40px
 * spread needs. Depth here is meant to be felt as weight, not seen as scale.
 *
 * TWO DARK CARDS, PLACED DIAGONALLY. Adjacent dark cards merge into a single
 * shape and the grid stops reading as cards at all; on a diagonal they read
 * as emphasis. This is the rule referred to in `components/ui/panel.tsx`.
 *
 * THE HEADING STAYS OUT OF THE SCENE. Display type re-rasterised through a 3D
 * transform goes soft, and a soft headline is a real cost against an effect
 * meant to be subliminal.
 *
 * THE CARDS ARE WRAPPED rather than carrying the markers themselves. `Panel`
 * takes an explicit prop list rather than spreading arbitrary attributes, and
 * widening it so one section can pass a data attribute would make every card
 * in the system a possible carrier of anything. The wrapper is also the right
 * target for the depth transform: it holds no surface styling, so moving it
 * cannot interact with the card's radius or shadow.
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
      <SplitHeading id="why-heading" className="type-h2 mt-6 max-w-[16ch] text-ink">
        Why they keep calling us back
      </SplitHeading>

      <DepthScene className="mt-10 grid gap-4 md:mt-14 lg:grid-cols-12">
        {/*
          The argument the company wins on. Furthest forward, and the only
          card where the photograph IS the surface rather than an inset plate.

          THE PANEL IS NOT `overflow-hidden`, DELIBERATELY. Clipping here would
          flatten the card's whole subtree and the type could not stand off the
          photograph — the effect this section exists for. `Media` carries its
          own `overflow-hidden` and radius, so the plate clips itself to the
          card's shape without the card having to clip anything.
        */}
        <div
          data-card
          data-depth="40"
          className="lg:col-span-4 lg:row-span-2 [transform-style:preserve-3d]"
        >
          <Panel
            tone="dark"
            className="relative flex h-full flex-col justify-between gap-16 p-7 [transform-style:preserve-3d]"
          >
            <Media
              asset={IMAGES.highwayAerial}
              ratio="auto"
              radius="plate"
              className="absolute inset-0"
              sizes="(max-width: 1024px) 100vw, 30vw"
              scrim="strong"
            />

            {/*
              32px of lift. At the scene's 1600px lens that is a 2%
              magnification — enough that the block visibly parts from the
              photograph as the grid leans, small enough that it stays inside
              the card's padding on the near edge.
            */}
            <div
              className="relative flex items-start justify-between gap-6"
              style={{ transform: "translateZ(32px)" }}
            >
              <h3 className="type-h3 max-w-[14ch] text-white">
                {RELIABILITY.heading}
              </h3>
              <IconBadge icon={CalendarCheck} tone="dark" />
            </div>
            <p
              className="relative max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/85"
              style={{ transform: "translateZ(22px)" }}
            >
              {RELIABILITY.body}
            </p>
          </Panel>
        </div>

        {/*
          Fleet depth, shown rather than asserted. An INSET plate rather than
          a full-bleed one: the two treatments are what keep six photographic
          cards from resolving into a gallery. Dark cards wear the photograph;
          paper cards hold it.
        */}
        <div
          data-card
          data-depth="0"
          className="lg:col-span-4 [transform-style:preserve-3d]"
        >
          <Panel
            tone="paper"
            className="flex h-full flex-col p-7 [transform-style:preserve-3d]"
          >
            <h3
              className="type-h3 max-w-[16ch] text-ink"
              style={{ transform: "translateZ(24px)" }}
            >
              {EQUIPMENT.heading}
            </h3>
            {/*
              The clipped frame flattens its own subtree, which is fine — the
              photograph has no layers inside it that need depth of their own.
            */}
            <Media
              asset={IMAGES.fleetTerminal}
              ratio="16/10"
              radius="soft"
              className="mt-6 w-full"
              sizes="(max-width: 1024px) 100vw, 30vw"
            />
          </Panel>
        </div>

        {/*
          DELIBERATELY THE ONE PAPER CARD WITH NO PHOTOGRAPH, alongside the
          terms strip below it. Six cards all carrying a frame would turn the
          bento into a gallery and undo the asymmetry the layout is built on —
          the eye needs somewhere to rest, and the depth ordering needs a card
          that is only type to be measured against.
        */}
        <div
          data-card
          data-depth="-20"
          className="lg:col-span-4 [transform-style:preserve-3d]"
        >
          <Panel
            tone="paper"
            className="flex h-full flex-col justify-between gap-10 p-7 [transform-style:preserve-3d]"
          >
            <div
              className="flex items-start justify-between gap-6"
              style={{ transform: "translateZ(24px)" }}
            >
              <h3 className="type-h3 max-w-[15ch] text-ink">
                {EXPERIENCE.heading}
              </h3>
              <IconBadge icon={History} />
            </div>
            <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-3">
              {EXPERIENCE.body}
            </p>
          </Panel>
        </div>

        {/*
          Safety, illustrated with a PERSON rather than equipment. Every claim
          in this card is about training and re-testing a driver; a photograph
          of another truck here would be arguing against its own text. It is
          also the only human face in the grid, which is what stops six
          photographs of machinery reading as a catalogue.
        */}
        <div
          data-card
          data-depth="-20"
          className="lg:col-span-4 [transform-style:preserve-3d]"
        >
          <Panel
            tone="paper"
            className="flex h-full flex-col justify-between gap-7 p-7 [transform-style:preserve-3d]"
          >
            <div
              className="flex items-start justify-between gap-6"
              style={{ transform: "translateZ(24px)" }}
            >
              <h3 className="type-h3 max-w-[15ch] text-ink">{SAFETY.heading}</h3>
              <IconBadge icon={ShieldCheck} />
            </div>
            <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-3">
              {SAFETY.body}
            </p>
            <Media
              asset={IMAGES.driverPortrait}
              ratio="16/10"
              radius="soft"
              className="w-full"
              sizes="(max-width: 1024px) 100vw, 30vw"
            />
          </Panel>
        </div>

        {/*
          Documentation. Not a `DIFFERENTIATOR` — it is drawn from the
          environmental hauling service line and the safety programme's audit
          practice, both of which are published. Kept local rather than added
          to the shared list because /about renders that list as a four-part
          narrative and a fifth entry would break it.

          The second dark card, and forward of the paper ones so the two
          emphasis surfaces read as a diagonal in depth as well as in tone.
        */}
        <div
          data-card
          data-depth="20"
          className="lg:col-span-4 [transform-style:preserve-3d]"
        >
          <Panel
            tone="dark"
            className="relative flex h-full flex-col justify-between gap-10 p-7 [transform-style:preserve-3d]"
          >
            {/*
              The second full-bleed card, and it is the second DARK one — so
              the photographic treatment lands on the same diagonal the tone
              already draws. Waste and regulated material is what this card is
              about, so it carries that frame rather than a generic truck.
            */}
            <Media
              asset={IMAGES.industryWaste}
              ratio="auto"
              radius="plate"
              className="absolute inset-0"
              sizes="(max-width: 1024px) 100vw, 30vw"
              scrim="strong"
            />

            <div
              className="relative flex items-start justify-between gap-6"
              style={{ transform: "translateZ(32px)" }}
            >
              <h3 className="type-h3 max-w-[15ch] text-white">
                Documentation travels with the load
              </h3>
              <IconBadge icon={FileCheck2} tone="dark" />
            </div>
            <p
              className="relative max-w-[36ch] text-[0.9375rem] leading-relaxed text-white/85"
              style={{ transform: "translateZ(22px)" }}
            >
              Contaminated soil and regulated material are tracked to approved
              receiving sites, with trip inspections and log books maintained
              during the job rather than assembled after it.
            </p>
          </Panel>
        </div>

        {/*
          The closing note. Furthest back — it qualifies, it does not argue.

          It also sits a little lower than the grid gap alone would put it.
          `mt-4` doubles the 16px gap to 32px, which is what separates a
          FOOTNOTE from a seventh card: at the grid's own rhythm it reads as
          one more tile in the bento, and it is not one — it is a remark about
          all six. The extra space and the −40 depth are saying the same thing
          in two registers, which is why the value is small; any more and it
          stops reading as attached to the grid at all.
        */}
        <div data-card data-depth="-40" className="mt-4 lg:col-span-12">
          <Panel
            tone="sunk"
            className="flex flex-wrap items-center gap-x-6 gap-y-4 p-6"
          >
            <IconBadge icon={Truck} />
            <p className="max-w-[70ch] text-[0.9375rem] leading-relaxed text-ink-2">
              Bulk, tank, waste and flatbed run under one operator — so a job
              needing three of them is still one phone call, one schedule and
              one point of contact.
            </p>
          </Panel>
        </div>
      </DepthScene>
    </section>
  );
}

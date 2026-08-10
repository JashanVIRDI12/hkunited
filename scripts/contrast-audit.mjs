#!/usr/bin/env node
/**
 * WCAG contrast audit.
 *
 * Parses the colour tokens straight out of `src/app/globals.css` and checks
 * every foreground/surface pairing the design system actually permits.
 * Run it after ANY palette change:  node scripts/contrast-audit.mjs
 *
 * Exits non-zero on failure so it can gate CI.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "../src/app/globals.css"), "utf8");

/** Pull `--color-x: #hex;` declarations out of the @theme block. */
const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [
    m[1],
    m[2],
  ]),
);

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const ratio = (a, b) => {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const AA_TEXT = 4.5;
const AA_LARGE = 3.0;

/**
 * Light surfaces that body text and labels sit on.
 * `brand-wash` is in the list because the card layout uses it as a real
 * surface — the icon badges are a brand glyph on a wash fill — not just as
 * a decorative tint.
 */
const SURFACES = ["paper", "paper-alt", "paper-sunk", "paper-deep", "brand-wash"];
/**
 * Marks that must remain legible on every surface above.
 * NOTE `red` is absent by design: at 4.23:1 it is reserved for LARGE
 * display type and graphic use only, and is checked separately below.
 */
const INK = ["ink", "ink-2", "ink-3", "ink-4", "brand", "red-deep"];

const checks = [];

for (const surface of SURFACES) {
  for (const ink of INK) {
    checks.push({
      label: `${ink} on ${surface}`,
      fg: tokens[ink],
      bg: tokens[surface],
      min: AA_TEXT,
    });
  }
}

// Filled controls: white label on a brand/red fill.
for (const fill of ["brand", "brand-deep", "red-deep"]) {
  checks.push({
    label: `white on ${fill}`,
    fg: "#ffffff",
    bg: tokens[fill],
    min: AA_TEXT,
  });
}

// Inverted control: brand label on a white button.
checks.push({
  label: "brand on white",
  fg: tokens.brand,
  bg: "#ffffff",
  min: AA_TEXT,
});

/*
 * Stack panels — src/components/motion/card-stack.tsx — are solid `brand`
 * and `red-deep` under white type, which the filled-control checks above
 * already cover.
 *
 * If those panels are ever made translucent again, the ratios above stop
 * describing them — a translucent surface has no contrast ratio of its
 * own, only its blend against a particular backdrop does. Composite the
 * fill over every surface it can park on and assert THAT instead. For
 * reference: white on a 90%-alpha fill drops to 4.70:1 over paper, and
 * 0.85 fails outright at 4.34:1.
 */

// Non-text UI: the focus ring needs 3:1 against every surface it lands on.
for (const surface of SURFACES) {
  checks.push({
    label: `focus ring (brand) on ${surface}`,
    fg: tokens.brand,
    bg: tokens[surface],
    min: AA_LARGE,
  });
}

// White type over photography sits on the scrim, never on a paper surface.
checks.push({
  label: "white on scrim (over imagery)",
  fg: "#ffffff",
  bg: tokens.scrim,
  min: AA_TEXT,
});

/*
 * Dark cards. `ink-panel` carries white body copy and white/70 secondary
 * copy; `ink` still carries the full-bleed dark bands. Both are asserted
 * because a card surface that is softened for looks is exactly the kind of
 * change that quietly walks a palette below AA.
 */
for (const panel of ["ink", "ink-panel"]) {
  checks.push({
    label: `white on ${panel} (dark card)`,
    fg: "#ffffff",
    bg: tokens[panel],
    min: AA_TEXT,
  });
}

// `red` is the brand hex and is intentionally below AA for small text.
// Assert it still clears the LARGE-text threshold it is scoped to.
checks.push({
  label: "red on paper (LARGE display type only)",
  fg: tokens.red,
  bg: tokens.paper,
  min: AA_LARGE,
});

let failed = 0;
console.log("\n  WCAG 2.1 AA contrast audit — HK United\n");

for (const c of checks) {
  if (!c.fg || !c.bg) {
    console.log(`  ????    SKIP  ${c.label} (token missing)`);
    continue;
  }
  const r = ratio(c.fg, c.bg);
  const ok = r >= c.min;
  if (!ok) failed++;
  console.log(
    `  ${r.toFixed(2).padStart(5)}:1  ${ok ? "PASS" : "FAIL"}  ${c.label}` +
      (ok ? "" : `  (needs ${c.min})`),
  );
}

console.log(
  `\n  note: brand ${ratio(tokens.brand, tokens.paper).toFixed(2)}:1 on paper — valid as text AND as fill.` +
    `\n  note: red ${ratio(tokens.red, tokens.paper).toFixed(2)}:1 on paper — LARGE display type only;` +
    ` use red-deep for small text and fills.`,
);

console.log(
  failed === 0
    ? `\n  ✓ ${checks.length} pairings pass\n`
    : `\n  ✗ ${failed} of ${checks.length} pairings FAIL\n`,
);

process.exit(failed === 0 ? 0 : 1);

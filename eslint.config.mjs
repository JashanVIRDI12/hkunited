import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    /*
      Installed agent skills. Third-party tooling, not project source: their
      `.cjs` helper scripts legitimately use `require()`, which this config
      forbids, and linting them buried the project's own output under
      seventeen errors nobody could act on. Not ours to fix and not shipped
      to the browser.
    */
    ".claude/**",
    ".agents/**",
  ]),
]);

export default eslintConfig;

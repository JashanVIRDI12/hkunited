import { cn } from "@/lib/utils";

/**
 * HK United logotype.
 *
 * Only "HK UNITED" is drawn. An earlier revision carried a "TRUCKS"
 * descriptor, but the paths for C, K and S were never drawn and it
 * rendered as "TRU" — the full legal name lives in the footer,
 * metadata and JSON-LD instead.
 *
 * Drawn as vector paths rather than set in a webfont so the mark is
 * identical across platforms, needs no font load to paint, and holds
 * its optical spacing at 20px in the header and 120px in the footer.
 *
 * The angled cut through the counters reads as a load line — the mark
 * carries the same 12° shear used by the section index numerals.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 164 24"
      fill="none"
      className={cn("block", className)}
      role="img"
      aria-label="HK United"
    >
      {/* H */}
      <path d="M0 1h4.6v8.2h6.6V1h4.6v22h-4.6v-9.4H4.6V23H0V1Z" fill="currentColor" />
      {/* K with sheared leg */}
      <path
        d="M19.6 1h4.6v9.1L31.4 1h5.6l-8.2 10.2L37.4 23h-5.7l-6.1-8.6-1.4 1.7V23h-4.6V1Z"
        fill="currentColor"
      />
      {/* Load-line rule between monogram and wordmark */}
      <path d="M43 1h1.8v22H43z" fill="currentColor" opacity=".28" />
      {/* UNITED */}
      <path
        d="M53 1h4.6v14.2c0 2.6 1.4 4 3.7 4s3.7-1.4 3.7-4V1H69.6v14c0 5.4-3.3 8.4-8.3 8.4s-8.3-3-8.3-8.4V1Z"
        fill="currentColor"
      />
      <path d="M74.4 1h4.3l8.4 13.4V1h4.5v22h-4.3L79 9.6V23h-4.6V1Z" fill="currentColor" />
      <path d="M96.6 1h4.6v22h-4.6V1Z" fill="currentColor" />
      <path d="M104.6 1h17v4.2h-6.2V23h-4.6V5.2h-6.2V1Z" fill="currentColor" />
      <path d="M125.2 1h13.9v4.2h-9.3v4.5h8.4v4.1h-8.4v5h9.6V23h-14.2V1Z" fill="currentColor" />
      <path
        d="M143.6 1h7.6c6.6 0 10.8 4.2 10.8 11s-4.2 11-10.8 11h-7.6V1Zm4.6 4.2v13.6h2.8c3.9 0 6.3-2.5 6.3-6.8s-2.4-6.8-6.3-6.8h-2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Zero-pad an ordinal for editorial index numerals: 3 -> "03". */
export const pad = (n: number, width = 2): string =>
  String(n).padStart(width, "0");

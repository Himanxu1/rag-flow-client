import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum SourceFileType {
  FILE = "FILE",
  WEBSITE = "WEBSITE",
  NOTION = "NOTION",
  TEXT = "TEXT",
}

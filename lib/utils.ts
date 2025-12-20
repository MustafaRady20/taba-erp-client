import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateReadable(dateString?: string) {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}
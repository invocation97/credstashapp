import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function createHandleFromName(name: string) {
  return name.toLowerCase().replace(/\s/g, "-");
}

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US");
};

export const createNameFromHandle = (handle: string) => {
  return handle.replace(/-/g, " ");
};

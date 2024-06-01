import { type ClassValue, clsx } from "clsx";
import { format, isToday, isYesterday } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkUser(user1Id: string, user2Id: string): Boolean {
  return user1Id === user2Id;
}

export function getDay(date: Date) {
  if (isToday(date)) return "Today";
  else if (isYesterday(date)) return "Yesterday";
  else return format(date, "dd-MMM-yyyy");
}

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
};

export const generateFileName = (bytes = 32) => {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
};

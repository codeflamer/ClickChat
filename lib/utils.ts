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

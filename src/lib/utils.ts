import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return phoneNumberString;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""
    }${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;

  return formattedTime;
}

export function formatTimeWithUnits(seconds: number) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;
  const hrs = Math.floor(seconds / (60 * 60));
  seconds -= hrs * 60 * 60;
  const mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;

  if (days) return days + (days > 1 ? " days" : " day") + " ago";
  if (hrs) return hrs + (hrs > 1 ? " hours" : " hour") + " ago";
  if (mnts) return mnts + (mnts > 1 ? " minutes" : " minute") + " ago";
  if (seconds) return seconds + (seconds > 1 ? " second" : " second") + " ago";
}

export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD HH:mm') {
  return dayjs(date).format(format);
}

export function copyText(text: string): void {
  navigator.clipboard.writeText(text);
}

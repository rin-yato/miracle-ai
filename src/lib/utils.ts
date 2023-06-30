import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeDuplicateLinks(links: string[]) {
  const filteredArray = links.map((link: string) => {
    if (!link) return "";
    if (link.endsWith("/")) {
      return link.slice(0, -1);
    }
    return link;
  });

  const filterHash = filteredArray.map((link) => {
    if (link.includes("#")) {
      return link.split("#")[0];
    }
    return link;
  });

  const uniqueLinks = new Set(filterHash);
  const array = Array.from(uniqueLinks);

  return array.filter(Boolean);
}

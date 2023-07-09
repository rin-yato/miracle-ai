import { removeDuplicateLinks } from "@/lib/utils";

import axios from "axios";

function lintingUrl(url: string) {
  let res = "";
  if (url.startsWith("https://")) {
    res = url;
  } else {
    res = `https://${url}`;
  }

  if (res.endsWith("/")) {
    return res.slice(0, -1);
  }

  return res;
}

export async function generateUrls(url: string) {
  const sanitizedUrl = lintingUrl(url);

  // set no-cors to true to prevent CORS errors
  const html = (await axios.post("/api/fetch", { url: sanitizedUrl })).data;
  // get the links from the response
  const links = html.match(/href="([^"]*)"/g);

  // strip the href=" and " from the links
  const strippedLinks = links.map((link: string) => {
    return link.replace('href="', "").replace('"', "");
  });

  const validLinks = strippedLinks.filter((link: string) => {
    if (!link) return false; // filter out empty links

    // filter out links that don't end with a valid extension
    const invalidExtensions = [
      ".jpg",
      ".png",
      ".gif",
      ".svg",
      ".jpeg",
      ".webp",
      ".css",
      ".woff2",
      ".woff",
      ".ttf",
      ".ico",
      ".js",
      ".json",
      ".xml",
      ".txt",
      ".pdf",
    ] as const;
    if (
      invalidExtensions.some((extension) => {
        return link.endsWith(extension);
      })
    ) {
      return false;
    }

    // filter out links that start with a invalid string
    const invalidStartsWith = [
      "/#",
      "./#",
      "/index#",
      "tel:",
      "data:",
      "mailto:",
      sanitizedUrl + "/wp-json",
      sanitizedUrl + "/wp-content",
      sanitizedUrl + "/wp-includes",
    ];
    if (invalidStartsWith.some((startsWith) => link.startsWith(startsWith))) {
      return false;
    }

    // return true if the link is valid
    if (link.startsWith("./")) return true;
    if (link.startsWith(sanitizedUrl)) return true;
    if (link.startsWith("/")) return true;

    // otherwise return false
    return false;
  });

  const allLinks = validLinks.map((link: string) => {
    if (link.startsWith("/")) {
      if (link.endsWith("/")) {
        return sanitizedUrl + link.slice(0, -1);
      }
      return sanitizedUrl + link;
    }
    if (link.startsWith("./")) {
      if (link.endsWith("/")) {
        return sanitizedUrl + link.slice(0, -1).slice(1);
      }
      return sanitizedUrl + link.slice(1);
    }
    if (link.startsWith(sanitizedUrl)) {
      return link;
    }
  });

  // remove duplicate links
  const finalLinks = removeDuplicateLinks([sanitizedUrl, ...allLinks]);

  return finalLinks;
}

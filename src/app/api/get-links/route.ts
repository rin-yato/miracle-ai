import { NextResponse } from "next/server";

import { removeDuplicateLinks } from "@/lib/utils";

import axios from "axios";
import { z } from "zod";

const getLinksSchema = z.object({
  url: z.string(),
});

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

export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = getLinksSchema.parse(body);

  const url = lintingUrl(validatedBody.url);
  console.log(url);

  const res = (await axios.get(url)).data;
  // get the links from the response
  const links = res.match(/href="([^"]*)"/g);

  // strip the href=" and " from the links
  const strippedLinks = links.map((link: string) => {
    return link.replace('href="', "").replace('"', "");
  });

  const validLinks = strippedLinks.filter((link: string) => {
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

    if (!link) return false;

    if (link.startsWith("/index#")) return false;

    if (link.startsWith(url + "/wp-content")) return false;
    if (link.startsWith(url + "/wp-includes")) return false;
    if (link.startsWith(url + "/wp-json")) return false;

    if (link.startsWith("/#")) return false;

    if (link.startsWith("./#")) return false;

    if (link.startsWith("./")) return true;

    if (link.startsWith(url)) return true;

    if (link.startsWith("/")) return true;

    return false;
  });

  const allLinks = validLinks.map((link: string) => {
    if (link.startsWith("/")) {
      if (link.endsWith("/")) {
        return url + link.slice(0, -1);
      }
      return url + link;
    }
    if (link.startsWith("./")) {
      if (link.endsWith("/")) {
        return url + link.slice(0, -1).slice(1);
      }
      return url + link.slice(1);
    }
    if (link.startsWith(url)) {
      return link;
    }
  });
  // return NextResponse.json({ allLinks });

  const finalLinks = removeDuplicateLinks([url, ...allLinks]);

  return NextResponse.json({
    status: "OK",
    data: finalLinks,
  });
}

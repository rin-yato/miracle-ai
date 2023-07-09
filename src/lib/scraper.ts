import axios from "axios";
import { convert } from "html-to-text";

export async function scraper(url: string) {
  // scrape website then load the document
  const response = await axios.get(url);
  const htmlContent = convert(response.data);

  const sanitiedContent = htmlContent.replaceAll("\n", " ");

  return sanitiedContent;
}

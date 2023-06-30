import axios from "axios";

export default function useAddSource() {
  async function generateUrls(url: string) {
    const response = await axios.post("/api/get-links", { url });
    const sortedLinks: string[] = response.data.data.sort(
      (a: string, b: string) => {
        return a.length - b.length;
      }
    );
    const data = sortedLinks.map((item: string) => {
      return {
        id: item,
        url: item,
      };
    });
    return data;
  }

  return {
    generateUrls,
  };
}

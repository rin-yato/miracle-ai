export default function getHost(req: Request): string {
  let host = req.headers.get("host");
  if (process.env.NODE_ENV === "production") {
    return "https://" + host;
  } else {
    return "http://" + host;
  }
}

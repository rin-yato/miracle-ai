export function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return "https://ai.just-miracle.space";
  } else {
    return "http://localhost:3000";
  }
}

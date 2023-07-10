export function getBaseUrl() {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else {
    return "https://ai.just-miracle.space";
  }
}

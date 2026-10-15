// Read at call time so env changes in Vercel apply without code edits.
export function cfg() {
  const siteUrl = (process.env.SITE_URL ?? "https://najmulhasan.navicore.co").replace(/\/$/, "");
  const host = new URL(siteUrl).hostname;
  return {
    siteUrl,
    repo: process.env.GITHUB_REPO ?? "", // "owner/name"
    branch: process.env.GITHUB_BRANCH ?? "main",
    articlesDir: "content/articles",
    githubApi: process.env.GITHUB_API_URL ?? "https://api.github.com",
    devtoApi: process.env.DEVTO_API_URL ?? "https://dev.to/api",
    indexnowApi: process.env.INDEXNOW_API_URL ?? "https://api.indexnow.org/IndexNow",
    gscProperty: process.env.GSC_PROPERTY ?? `sc-domain:${host.split(".").slice(-2).join(".")}`,
  };
}

export const INDEXNOW_KEY_RE = /^[a-zA-Z0-9-]{8,128}$/;
export const indexnowKey = () => {
  const k = process.env.INDEXNOW_KEY ?? "";
  return INDEXNOW_KEY_RE.test(k) ? k : "";
};

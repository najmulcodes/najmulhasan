// Parses the "Blogger (Bangla)" block produced by the article generator:
//   Title: ...
//   Permalink: ...
//   Labels: ...
//   Search description: ...
//   <p>...html...</p>
// Pure function, safe to import in client components.
export type BloggerBlock = {
  bnTitle: string;
  bnSlug: string;
  bnLabels: string;
  bnDescription: string;
  bnHtml: string;
};

export function parseBloggerBlock(raw: string): BloggerBlock {
  const text = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((l) => !/^\s*```[a-z]*\s*$/i.test(l)) // drop code-fence lines
    .join("\n");

  const htmlStart = text.search(/^[ \t]*</m);
  const head = htmlStart === -1 ? text : text.slice(0, htmlStart);
  const bnHtml = htmlStart === -1 ? "" : text.slice(htmlStart).trim();

  const pick = (key: string) => head.match(new RegExp(`^[ \\t]*${key}[ \\t]*:[ \\t]*(.+)$`, "im"))?.[1].trim() ?? "";

  return {
    bnTitle: pick("Title"),
    bnSlug: pick("Permalink").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""),
    bnLabels: pick("Labels"),
    bnDescription: pick("Search description"),
    bnHtml,
  };
}

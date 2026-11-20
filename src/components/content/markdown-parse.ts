/** Markdown tahlilchisi (React va server modullarisiz — testlarda ham ishlatiladi). */

export type Block =
  | { t: "h2" | "h3" | "p" | "quote"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "table"; rows: string[][] }
  | { t: "callout"; kind: string; blocks: Block[] }
  | { t: "embed"; kind: "dua" | "dhikr" | "quran" | "hadith" | "steps"; ref: string };

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    const callout = /^:::([a-z]+)\s*$/.exec(trimmed);
    if (callout) {
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") inner.push(lines[i++]);
      i++;
      blocks.push({ t: "callout", kind: callout[1], blocks: parseMarkdown(inner.join("\n")) });
      continue;
    }
    const embed = /^::(dua|dhikr|quran|hadith|steps)\{([^}]+)\}\s*$/.exec(trimmed);
    if (embed) {
      blocks.push({ t: "embed", kind: embed[1] as "dua", ref: embed[2].trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) { blocks.push({ t: "h3", text: trimmed.slice(4) }); i++; continue; }
    if (trimmed.startsWith("## ")) { blocks.push({ t: "h2", text: trimmed.slice(3) }); i++; continue; }
    if (/^[-*] /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) items.push(lines[i++].trim().slice(2));
      blocks.push({ t: "ul", items });
      continue;
    }
    if (/^\d+\. /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^\d+\. /, ""));
      blocks.push({ t: "ol", items });
      continue;
    }
    if (trimmed.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const r = lines[i++].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!r.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(r);
      }
      blocks.push({ t: "table", rows });
      continue;
    }
    if (trimmed.startsWith("> ")) {
      const q: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) q.push(lines[i++].trim().slice(2));
      blocks.push({ t: "quote", text: q.join(" ") });
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |[-*] |\d+\. |\||> |:::|::(dua|dhikr|quran|hadith|steps)\{)/.test(lines[i].trim())) para.push(lines[i++].trim());
    blocks.push({ t: "p", text: para.join(" ") });
  }
  return blocks;
}


export function slugId(text: string) {
  return text.toLowerCase().replace(/[ʻʼ'*]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

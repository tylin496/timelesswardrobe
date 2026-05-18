/**
 * One-off brand string normalisation — title-case each word (not applied at runtime in the app).
 * @param {string} raw
 * @returns {string}
 */
export function titleCaseBrand(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return s;

  function titleToken(token) {
    if (!token) return token;
    const lower = token.toLocaleLowerCase("en");
    return lower.charAt(0).toLocaleUpperCase("en") + lower.slice(1);
  }

  function titleSegment(segment) {
    if (!segment) return segment;
    if (segment.includes(".")) {
      return segment
        .split(".")
        .map((part) => (part ? titleToken(part) : part))
        .join(".");
    }
    if (segment.includes("-")) {
      return segment.split("-").map(titleToken).join("-");
    }
    if (segment.includes("'")) {
      return segment
        .split("'")
        .map((part, i) => (i === 0 ? titleToken(part) : part ? titleToken(part) : part))
        .join("'");
    }
    return titleToken(segment);
  }

  return s
    .split(/(\s+|&)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part) || part === "&") return part;
      if (part.includes(":")) {
        return part
          .split(":")
          .map((chunk, i) => {
            const t = chunk.trim();
            if (!t) return chunk;
            const lead = chunk.match(/^\s*/)?.[0] ?? "";
            const trail = chunk.match(/\s*$/)?.[0] ?? "";
            return `${lead}${titleSegment(t)}${trail}`;
          })
          .join(":");
      }
      if (part.includes("/")) {
        return part
          .split("/")
          .map((chunk, i) => {
            const t = chunk.trim();
            if (!t) return chunk;
            const lead = chunk.match(/^\s*/)?.[0] ?? "";
            const trail = chunk.match(/\s*$/)?.[0] ?? "";
            return `${lead}${titleSegment(t)}${trail}`;
          })
          .join("/");
      }
      return titleSegment(part);
    })
    .join("");
}

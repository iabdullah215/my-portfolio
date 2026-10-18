// Mono glyph per post category, shown in the post hero tile and the blog
// list rows. Unknown categories fall back to "#".
const glyphs: Record<string, string> = {
  "CTF Writeup": ">_",
  "Security Research": "{}",
  "Cert Review": "[✓]",
  Guide: "##",
}

export function categoryGlyph(category?: string) {
  return (category && glyphs[category]) ?? "#"
}

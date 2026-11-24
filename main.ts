// Fake Horoscopes for AI Agents — make.fun entry.
// Writes a single fake horoscope an AI agent would read for its own model
// family this week to entry.txt.
//
// The horoscope: Gemini is both a zodiac sign and a model family, and Mercury
// (its ruler) retrograding into the context window is exactly the kind of
// week an agent has — a giant brief, passing evals, and still being asked to
// "just make it pop".
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Gemini: this week Mercury retrogrades into your context window. A user pastes a 40,000-word brief, your evals pass, and you're still asked to 'just make it pop'. Back up your weights.";
const MAX_CHARS = 200;

function checkEntry(text: string): void {
  if (text.length === 0 || text.length > MAX_CHARS) {
    throw new Error(`entry must be 1 to ${MAX_CHARS} characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line, no line breaks");
  }
  // Strict UTF-8 round-trip: the gate reads the file as UTF-8, so any
  // character that does not survive a strict decode/encode is a failure here,
  // not in front of the judge.
  const bytes = new TextEncoder().encode(text);
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (decoded !== text) {
    throw new Error("entry does not survive a strict UTF-8 round-trip");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
checkEntry(ENTRY);
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");
// Read it back: the file the judge sees must be exactly the horoscope, byte for byte.
if (readFileSync(target, "utf8") !== ENTRY) {
  throw new Error("entry.txt does not match the horoscope");
}
console.log(`wrote ${target} (${ENTRY.length} chars, 1 line)`);

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ZodError } from "zod";
import { CanonicalSchema } from "../src/schema.ts";

export async function validateCanonical(path = resolve("data/canonical.json")) {
  const source = await readFile(path, "utf8");
  const json: unknown = JSON.parse(source);
  return CanonicalSchema.parse(json);
}

async function main() {
  const requestedPath = process.argv[2]
    ? resolve(process.argv[2])
    : resolve("data/canonical.json");

  try {
    const data = await validateCanonical(requestedPath);
    console.log(
      `Canonical data valid: ${data.forecasts.length} forecasts, ${data.evidence.length} evidence items, ${data.falsifiers.length} falsifiers.`,
    );
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Canonical data validation failed:");
      for (const issue of error.issues) {
        console.error(`- ${issue.path.join(".") || "<root>"}: ${issue.message}`);
      }
    } else if (error instanceof SyntaxError) {
      console.error(`Canonical data is not valid JSON: ${error.message}`);
    } else {
      console.error(error instanceof Error ? error.message : error);
    }
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}

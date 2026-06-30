/**
 * Blog Post Generator
 *
 * LLM Gateway を使用して、指定したトピックの技術ブログ記事を生成する。
 *
 * Usage:
 *   npx tsx scripts/generate-blog.ts --topic "Your topic here"
 *
 * Options:
 *   --topic, -t     Blog topic (required)
 *   --locales, -l   Target locales (default: "ja,en,ko")
 *   --dry-run       Print topic and locales without generating files
 *
 * Environment Variables:
 *   LLM_GATEWAY_BASE_URL  LLM Gateway base URL (required)
 *   LLM_GATEWAY_TOKEN     LLM Gateway API token (required)
 *
 * Examples:
 *   npx tsx scripts/generate-blog.ts -t "Next.js Server Actions"
 *   npx tsx scripts/generate-blog.ts -t "React 19" -l ja,en
 */

import {
  LOCALE_NAMES,
  toSlug,
  buildMdx,
  saveMdx,
  runGatewayJob,
} from "./lib/blog-gateway.js";

// --- Argument parsing ---

function parseArgs(args: string[]) {
  const parsed = {
    topic: "",
    locales: ["ja", "en", "ko"],
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--topic":
      case "-t":
        parsed.topic = args[++i] ?? "";
        break;
      case "--locales":
      case "-l":
        parsed.locales = (args[++i] ?? "").split(",").map((s) => s.trim());
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
    }
  }

  return parsed;
}

// --- Main ---

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.topic) {
    console.error("Error: --topic is required");
    console.error("Usage: npx tsx scripts/generate-blog.ts --topic 'Your topic'");
    process.exit(1);
  }

  const today = new Date().toISOString().split("T")[0] as string;
  const slug = toSlug(args.topic) || "post";

  console.log(`Topic: ${args.topic}`);
  console.log(`Locales: ${args.locales.join(", ")}`);
  console.log(`Slug: ${slug}`);
  console.log("---");

  if (args.dryRun) {
    console.log("\n(dry-run: no articles generated)");
    return;
  }

  for (const locale of args.locales) {
    console.log(`\nGenerating ${LOCALE_NAMES[locale] ?? locale} version...`);

    const article = await runGatewayJob("blog-article-by-topic", {
      topic: args.topic,
      language: locale,
    });

    const filePath = saveMdx(locale, slug, buildMdx(article, today, slug));
    console.log(`  Saved: ${filePath}`);
  }

  console.log(`\nDone! Generated ${args.locales.length} posts with slug: "${slug}"`);
  console.log('Status: draft (edit and change to "published" when ready)');
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

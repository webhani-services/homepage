/**
 * Blog Post Polisher
 *
 * LLM Gateway を使用して、ユーザーが書いた原稿を校正・翻訳し、
 * 3言語の MDX ファイルを生成する。
 *
 * Usage:
 *   npx tsx scripts/polish-blog.ts --file drafts/my-article.md
 *   npx tsx scripts/polish-blog.ts --file drafts/my-article.md --slug "my-custom-slug"
 *
 * Options:
 *   --file, -f      Path to draft file (required, supports .md / .txt / .mdx)
 *   --slug, -s      Custom slug (default: auto-generated from title)
 *   --locales, -l   Target locales (default: "ja,en,ko")
 *   --tags          Comma-separated tags (default: auto-detected by the gateway)
 *   --dry-run       Print result without saving files
 *
 * Environment Variables:
 *   LLM_GATEWAY_BASE_URL  LLM Gateway base URL (required)
 *   LLM_GATEWAY_TOKEN     LLM Gateway API token (required)
 *
 * Draft file format:
 *   Plain text or markdown. The gateway will:
 *   1. Polish the content (fix grammar, improve structure, add code examples)
 *   2. Generate proper MDX frontmatter
 *   3. Translate to all target locales
 */

import fs from "fs";
import path from "path";
import {
  LOCALE_NAMES,
  toSlug,
  buildMdx,
  saveMdx,
  runGatewayJob,
} from "./lib/blog-gateway.js";

function parseArgs(args: string[]) {
  const parsed = {
    file: "",
    slug: "",
    locales: ["ja", "en", "ko"],
    tags: "",
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--file":
      case "-f":
        parsed.file = args[++i] ?? "";
        break;
      case "--slug":
      case "-s":
        parsed.slug = args[++i] ?? "";
        break;
      case "--locales":
      case "-l":
        parsed.locales = (args[++i] ?? "").split(",").map((s) => s.trim());
        break;
      case "--tags":
        parsed.tags = args[++i] ?? "";
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
    }
  }

  return parsed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.file) {
    console.error("Error: --file is required");
    console.error(
      "Usage: npx tsx scripts/polish-blog.ts --file drafts/my-article.md",
    );
    process.exit(1);
  }

  const filePath = path.resolve(args.file);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const draft = fs.readFileSync(filePath, "utf-8");
  const today = new Date().toISOString().split("T")[0] as string;

  console.log(`Draft: ${filePath} (${draft.length} chars)`);
  console.log(`Locales: ${args.locales.join(", ")}`);
  console.log("---");

  let slug = args.slug;

  for (const locale of args.locales) {
    console.log(
      `\nPolishing & translating to ${LOCALE_NAMES[locale] ?? locale}...`,
    );

    const article = await runGatewayJob("blog-polish", {
      draft,
      language: locale,
      ...(args.tags ? { tags: args.tags } : {}),
    });

    if (!slug) slug = toSlug(article.title) || "post";

    if (args.dryRun) {
      console.log(`\n--- ${locale}/${slug}.mdx ---`);
      console.log(buildMdx(article, today, slug));
    } else {
      const saved = saveMdx(locale, slug, buildMdx(article, today, slug));
      console.log(`  Saved: ${saved}`);
    }
  }

  if (!args.dryRun) {
    console.log(
      `\nDone! Polished ${args.locales.length} versions with slug: "${slug}"`,
    );
    console.log('Status: draft (edit and change to "published" when ready)');
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

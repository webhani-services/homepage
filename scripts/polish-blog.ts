/**
 * Blog Post Polisher
 *
 * ユーザーが書いた原稿を LLM で校正・翻訳し、3言語の MDX ファイルを生成する。
 *
 * Usage:
 *   npx tsx scripts/polish-blog.ts --file drafts/my-article.md
 *   npx tsx scripts/polish-blog.ts --file drafts/my-article.md --slug "my-custom-slug"
 *   npx tsx scripts/polish-blog.ts --file drafts/my-article.md -p openai
 *
 * Options:
 *   --file, -f      Path to draft file (required, supports .md / .txt / .mdx)
 *   --slug, -s      Custom slug (default: auto-generated from title)
 *   --locales, -l   Target locales (default: "ja,en,ko")
 *   --provider, -p  LLM provider (default: env LLM_PROVIDER or "anthropic")
 *   --model, -m     Model name (default: env LLM_MODEL or provider default)
 *   --tags          Comma-separated tags (default: auto-detected by LLM)
 *   --dry-run       Print generated content without saving files
 *
 * Environment Variables:
 *   LLM_PROVIDER       Default LLM provider (anthropic | openai | gemini)
 *   LLM_MODEL          Default model name
 *   ANTHROPIC_API_KEY   Anthropic API key (default)
 *   OPENAI_API_KEY      OpenAI API key
 *   GEMINI_API_KEY      Google Gemini API key
 *
 * Draft file format:
 *   Plain text or markdown. The LLM will:
 *   1. Polish the content (fix grammar, improve structure, add code examples)
 *   2. Generate proper MDX frontmatter
 *   3. Translate to all target locales
 */

import fs from "fs";
import path from "path";
import { createProvider } from "./lib/registry.js";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

const LOCALE_NAMES: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  ko: "Korean",
};

function parseArgs(args: string[]) {
  const parsed = {
    file: "",
    slug: "",
    locales: ["ja", "en", "ko"],
    provider: undefined as string | undefined,
    model: undefined as string | undefined,
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
      case "--provider":
      case "-p":
        parsed.provider = args[++i];
        break;
      case "--model":
      case "-m":
        parsed.model = args[++i];
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

function buildPolishPrompt(
  draft: string,
  locale: string,
  slug: string,
  tags: string
): string {
  const langName = LOCALE_NAMES[locale] ?? locale;
  const today = new Date().toISOString().split("T")[0];

  return `You are a technical blog editor for webhani Inc., an IT consulting and development company.

The user has written a draft blog post. Your job is to:
1. Polish the content — fix grammar, improve structure, ensure clarity
2. Add practical code examples if the topic is technical and none exist
3. Translate/rewrite the entire article in ${langName}
4. Format as a complete MDX file with proper frontmatter

IMPORTANT: Output ONLY the complete MDX file content. No explanation before or after.

Frontmatter requirements:
- title: A compelling title in ${langName}
- description: A 1-2 sentence summary in ${langName}
- date: "${today}"
- status: "draft"
- tags: [${tags ? `"${tags.split(",").join('", "')}"` : "auto-detect 3-5 relevant technical tags"}]
- thumbnail: ""
- author: "webhani"
- slug: "${slug || "auto-generate-from-title"}"

${slug ? `Use slug: "${slug}" exactly.` : "Generate a URL-safe English slug from the topic (lowercase, hyphens, no special chars)."}

--- USER DRAFT ---
${draft}
--- END DRAFT ---`;
}

function saveMdx(locale: string, slug: string, content: string): string {
  const dir = path.join(CONTENT_DIR, locale);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.mdx`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

function extractSlug(mdxContent: string): string {
  const match = mdxContent.match(/slug:\s*"([^"]+)"/);
  return match?.[1] ?? "untitled";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.file) {
    console.error("Error: --file is required");
    console.error(
      "Usage: npx tsx scripts/polish-blog.ts --file drafts/my-article.md"
    );
    process.exit(1);
  }

  const filePath = path.resolve(args.file);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const draft = fs.readFileSync(filePath, "utf-8");
  const provider = createProvider(args.provider, undefined, args.model);

  console.log(`Provider: ${provider.name}`);
  console.log(`Draft: ${filePath} (${draft.length} chars)`);
  console.log(`Locales: ${args.locales.join(", ")}`);
  console.log("---");

  let slug = args.slug;

  for (const locale of args.locales) {
    console.log(
      `\nPolishing & translating to ${LOCALE_NAMES[locale] ?? locale}...`
    );

    const prompt = buildPolishPrompt(draft, locale, slug, args.tags);
    const content = await provider.generate({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 4096,
      temperature: 0.5,
    });

    if (!slug) {
      slug = extractSlug(content);
    }

    if (args.dryRun) {
      console.log(`\n--- ${locale}/${slug}.mdx ---`);
      console.log(content);
    } else {
      const saved = saveMdx(locale, slug, content);
      console.log(`  Saved: ${saved}`);
    }
  }

  if (!args.dryRun) {
    console.log(
      `\nDone! Polished ${args.locales.length} versions with slug: "${slug}"`
    );
    console.log('Status: draft (edit and change to "published" when ready)');
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

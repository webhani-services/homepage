/**
 * Blog Post Generator
 *
 * Usage:
 *   npx tsx scripts/generate-blog.ts --topic "Your topic here"
 *
 * Options:
 *   --topic, -t     Blog topic (required)
 *   --locales, -l   Target locales (default: "ja,en,ko")
 *   --provider, -p  LLM provider (default: env LLM_PROVIDER or "anthropic")
 *   --model, -m     Model name (default: env LLM_MODEL or provider default)
 *   --dry-run       Print generated content without saving files
 *
 * Environment Variables:
 *   LLM_PROVIDER       Default LLM provider (anthropic | openai | gemini)
 *   LLM_MODEL          Default model name
 *   ANTHROPIC_API_KEY   Anthropic API key (default provider)
 *   OPENAI_API_KEY      OpenAI API key
 *   GEMINI_API_KEY      Google Gemini API key
 *
 * Examples:
 *   npx tsx scripts/generate-blog.ts -t "Next.js Server Actions"
 *   npx tsx scripts/generate-blog.ts -t "React 19" -p openai -m gpt-4o
 *   npx tsx scripts/generate-blog.ts -t "Docker tips" -p gemini
 *   npx tsx scripts/generate-blog.ts -t "AWS Lambda" -p anthropic -m claude-haiku-4-5-20251001
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

// --- Argument parsing ---

function parseArgs(args: string[]) {
  const parsed = {
    topic: "",
    locales: ["ja", "en", "ko"],
    provider: undefined as string | undefined,
    model: undefined as string | undefined,
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
      case "--provider":
      case "-p":
        parsed.provider = args[++i];
        break;
      case "--model":
      case "-m":
        parsed.model = args[++i];
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
    }
  }

  return parsed;
}

// --- Prompt ---

function buildPrompt(topic: string, locale: string): string {
  const langName = LOCALE_NAMES[locale] ?? locale;
  const today = new Date().toISOString().split("T")[0];

  return `You are a technical blog writer for webhani Inc., an IT consulting and development company.

Write a technical blog post in ${langName} about the following topic:
"${topic}"

Output ONLY the complete MDX file content including frontmatter. No explanation before or after.

Requirements:
- frontmatter must include: title, description, date, status, tags, thumbnail, author, slug
- status must be "draft"
- date must be "${today}"
- author must be "webhani"
- slug must be a URL-safe English string derived from the topic (lowercase, hyphens, no special chars)
- thumbnail should be empty string ""
- tags should be relevant technical keywords (3-5 tags)
- The blog content should be 800-1500 words
- Use proper markdown headings (##, ###), code blocks, and lists
- Include practical code examples where appropriate
- Write in a professional but approachable tone

Format:
---
title: "..."
description: "..."
date: "${today}"
status: "draft"
tags: ["...", "..."]
thumbnail: ""
author: "webhani"
slug: "..."
---

(blog content in ${langName})`;
}

// --- File operations ---

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

// --- Main ---

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.topic) {
    console.error("Error: --topic is required");
    console.error("Usage: npx tsx scripts/generate-blog.ts --topic 'Your topic'");
    process.exit(1);
  }

  const provider = createProvider(args.provider, undefined, args.model);
  console.log(`Provider: ${provider.name}`);
  console.log(`Topic: ${args.topic}`);
  console.log(`Locales: ${args.locales.join(", ")}`);
  console.log("---");

  let slug = "";

  for (const locale of args.locales) {
    console.log(`\nGenerating ${LOCALE_NAMES[locale] ?? locale} version...`);

    const prompt = buildPrompt(args.topic, locale);
    const content = await provider.generate({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 4096,
      temperature: 0.7,
    });

    if (!slug) {
      slug = extractSlug(content);
    }

    if (args.dryRun) {
      console.log(`\n--- ${locale}/${slug}.mdx ---`);
      console.log(content);
    } else {
      const filePath = saveMdx(locale, slug, content);
      console.log(`  Saved: ${filePath}`);
    }
  }

  if (!args.dryRun) {
    console.log(`\nDone! Generated ${args.locales.length} posts with slug: "${slug}"`);
    console.log(`Status: draft (edit and change to "published" when ready)`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

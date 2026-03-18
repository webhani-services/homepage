/**
 * Daily Blog Generator
 *
 * 最新の技術ニュースを取得し、Top 3 を選定して会社ブログ記事を自動生成する。
 * 3件のうち少なくとも1件は LLM/AI 関連のニュースが含まれる。
 *
 * Usage:
 *   npx tsx scripts/daily-blog.ts
 *   npx tsx scripts/daily-blog.ts --provider openai
 *   npx tsx scripts/daily-blog.ts --count 5
 *   npx tsx scripts/daily-blog.ts --dry-run
 *
 * Options:
 *   --count, -c     Number of articles to generate (default: 3)
 *   --locales, -l   Target locales (default: "ja,en,ko")
 *   --provider, -p  LLM provider (default: env LLM_PROVIDER or "anthropic")
 *   --model, -m     Model name (default: env LLM_MODEL or provider default)
 *   --dry-run       Print selected topics without generating articles
 *
 * Environment Variables:
 *   LLM_PROVIDER       Default LLM provider (anthropic | openai | gemini)
 *   LLM_MODEL          Default model name
 *   ANTHROPIC_API_KEY   Anthropic API key (default)
 *   OPENAI_API_KEY      OpenAI API key
 *   GEMINI_API_KEY      Google Gemini API key
 *
 * News Sources:
 *   - Hacker News API (free, no auth)
 *   - Dev.to API (free, no auth)
 *
 * Workflow:
 *   1. Fetch latest tech news from multiple sources
 *   2. LLM selects top N articles (at least 1 LLM/AI related)
 *   3. For each selected article, generate blog post in all locales
 *   4. Save as draft MDX files
 */

import fs from "fs";
import path from "path";
import { createProvider } from "./lib/registry.js";
import { fetchTechNews, formatNewsForLLM } from "./lib/news-fetcher.js";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

const LOCALE_NAMES: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  ko: "Korean",
};

interface SelectedTopic {
  index: number;
  title: string;
  url: string;
  reason: string;
  slug: string;
  isLLMRelated: boolean;
}

function parseArgs(args: string[]) {
  const parsed = {
    count: 3,
    locales: ["ja", "en", "ko"],
    provider: undefined as string | undefined,
    model: undefined as string | undefined,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--count":
      case "-c":
        parsed.count = parseInt(args[++i] ?? "3", 10);
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

function buildSelectionPrompt(
  newsText: string,
  count: number
): string {
  return `You are a technical content curator for webhani Inc., an IT consulting and development company specializing in web development, cloud infrastructure, and AI/LLM solutions.

Below is a list of recent tech news articles. Select the top ${count} articles that would be most interesting and valuable for our company blog.

IMPORTANT CONSTRAINT: At least 1 of the ${count} selected articles MUST be related to LLM, AI, or machine learning (e.g., Claude, GPT, AI tools, prompt engineering, AI coding assistants, etc.).

Selection criteria:
- Relevance to web development, cloud, DevOps, or AI/LLM
- Practical value for developers and IT professionals
- Trending or high-impact topics
- Freshness and novelty

Respond in valid JSON only. No explanation before or after.

Format:
[
  {
    "index": <article number from the list>,
    "title": "<original title>",
    "url": "<url>",
    "reason": "<why this is a good topic for our blog>",
    "slug": "<url-safe-slug>",
    "isLLMRelated": <true if LLM/AI related, false otherwise>
  }
]

--- NEWS LIST ---
${newsText}
--- END LIST ---`;
}

function buildArticlePrompt(
  topic: SelectedTopic,
  locale: string
): string {
  const langName = LOCALE_NAMES[locale] ?? locale;
  const today = new Date().toISOString().split("T")[0];

  return `You are a technical blog writer for webhani Inc., an IT consulting and development company.

Write an original blog post in ${langName} inspired by the following news article:

Title: ${topic.title}
URL: ${topic.url}
Why we chose this: ${topic.reason}

IMPORTANT RULES:
- Do NOT simply translate or copy the original article
- Write an ORIGINAL article from webhani's perspective
- Add your own analysis, practical insights, and code examples
- Relate the topic to web development, cloud, or AI consulting
- Write 800-1500 words
- Use proper markdown headings (##, ###), code blocks, and lists
- Write in a professional but approachable tone

Output ONLY the complete MDX file content. No explanation before or after.

Frontmatter:
---
title: "<compelling title in ${langName}>"
description: "<1-2 sentence summary in ${langName}>"
date: "${today}"
status: "draft"
tags: [<3-5 relevant tags>]
thumbnail: ""
author: "webhani"
slug: "${topic.slug}"
---

(blog content in ${langName})`;
}

function saveMdx(locale: string, slug: string, content: string): string {
  const dir = path.join(CONTENT_DIR, locale);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.mdx`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const provider = createProvider(args.provider, undefined, args.model);

  console.log(`Provider: ${provider.name}`);
  console.log(`Articles to generate: ${args.count}`);
  console.log(`Locales: ${args.locales.join(", ")}`);
  console.log("===\n");

  // Step 1: Fetch news
  const news = await fetchTechNews();

  if (news.length === 0) {
    console.error("Error: No news articles fetched. Check network connection.");
    process.exit(1);
  }

  const newsText = formatNewsForLLM(news);

  // Step 2: LLM selects top articles
  console.log(`\nSelecting top ${args.count} articles with LLM...`);

  const selectionResponse = await provider.generate({
    messages: [{ role: "user", content: buildSelectionPrompt(newsText, args.count) }],
    maxTokens: 2048,
    temperature: 0.3,
  });

  let selectedTopics: SelectedTopic[];
  try {
    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = selectionResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");
    selectedTopics = JSON.parse(jsonMatch[0]);
  } catch {
    console.error("Error: Failed to parse LLM selection response");
    console.error("Response:", selectionResponse);
    process.exit(1);
  }

  // Validate at least 1 LLM-related topic
  const llmCount = selectedTopics.filter((t) => t.isLLMRelated).length;
  if (llmCount === 0) {
    console.warn(
      "Warning: No LLM/AI related topic was selected. The constraint was not met."
    );
  }

  console.log("\nSelected topics:");
  selectedTopics.forEach((topic, i) => {
    console.log(
      `  ${i + 1}. ${topic.title}${topic.isLLMRelated ? " [LLM/AI]" : ""}`
    );
    console.log(`     Slug: ${topic.slug}`);
    console.log(`     Reason: ${topic.reason}`);
  });

  if (args.dryRun) {
    console.log("\n(dry-run: no articles generated)");
    return;
  }

  // Step 3: Generate articles for each topic
  console.log("\n===\nGenerating articles...\n");

  for (const topic of selectedTopics) {
    console.log(`\n--- ${topic.title} ---`);

    for (const locale of args.locales) {
      console.log(
        `  Generating ${LOCALE_NAMES[locale] ?? locale} version...`
      );

      const content = await provider.generate({
        messages: [
          { role: "user", content: buildArticlePrompt(topic, locale) },
        ],
        maxTokens: 4096,
        temperature: 0.7,
      });

      const filePath = saveMdx(locale, topic.slug, content);
      console.log(`  Saved: ${filePath}`);
    }
  }

  console.log(
    `\nDone! Generated ${selectedTopics.length * args.locales.length} draft posts.`
  );
  console.log('Review and change status to "published" when ready.');
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

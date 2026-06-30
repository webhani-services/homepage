/**
 * Daily Blog Generator
 *
 * LLM Gateway を使用して技術ブログ記事を自動生成する。
 *
 * Usage:
 *   npx tsx scripts/daily-blog.ts
 *   npx tsx scripts/daily-blog.ts --count 5
 *   npx tsx scripts/daily-blog.ts --dry-run
 *
 * Options:
 *   --count, -c     Number of articles to generate (default: 3)
 *   --locales, -l   Target locales (default: "ja,en,ko")
 *   --dry-run       Print selected topics without generating articles
 *
 * Environment Variables:
 *   LLM_GATEWAY_BASE_URL  LLM Gateway base URL (required)
 *   LLM_GATEWAY_TOKEN     LLM Gateway API token (required)
 */

import {
  LOCALE_NAMES,
  getGatewayConfig,
  toSlug,
  buildMdx,
  saveMdx,
  runGatewayJob,
} from "./lib/blog-gateway.js";

interface GatewayTopic {
  title: string;
  category: string;
  rationale: string;
}

function parseArgs(args: string[]) {
  const parsed = {
    count: 3,
    locales: ["ja", "en", "ko"],
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
      case "--dry-run":
        parsed.dryRun = true;
        break;
    }
  }

  return parsed;
}

async function main() {
  const { baseUrl, token } = getGatewayConfig();

  const args = parseArgs(process.argv.slice(2));
  const today = new Date().toISOString().split("T")[0] as string;

  console.log(`Articles to generate: ${args.count}`);
  console.log(`Locales: ${args.locales.join(", ")}`);
  console.log("===\n");

  // Step 1: Select topics via gateway (sync task run)
  console.log(`Selecting top ${args.count} topics...`);

  const topicRes = await fetch(
    `${baseUrl}/v1/tasks/daily-tech-topic-selection/run`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        input: { date: today, count: args.count, language: "ja" },
      }),
    },
  );
  if (!topicRes.ok)
    throw new Error(`topic-selection failed: ${topicRes.status}`);
  const { output } = (await topicRes.json()) as {
    output: { topics: GatewayTopic[] };
  };
  const topics = output.topics;

  console.log("\nSelected topics:");
  topics.forEach((topic, i) => {
    console.log(`  ${i + 1}. ${topic.title} [${topic.category}]`);
    console.log(`     Rationale: ${topic.rationale}`);
  });

  if (args.dryRun) {
    console.log("\n(dry-run: no articles generated)");
    return;
  }

  // Step 2: Generate articles for each topic and locale via async jobs
  console.log("\n===\nGenerating articles...\n");

  for (const topic of topics) {
    console.log(`\n--- ${topic.title} ---`);
    const slug = toSlug(topic.title);

    for (const locale of args.locales) {
      console.log(`  Generating ${LOCALE_NAMES[locale] ?? locale} version...`);

      const article = await runGatewayJob(
        "daily-tech-article",
        {
          date: today,
          topic: topic.title,
          language: locale,
          target_length: 2000,
        },
        `daily-article:${today}:${topic.title}:${locale}`,
      );

      const filePath = saveMdx(locale, slug, buildMdx(article, today, slug));
      console.log(`  Saved: ${filePath}`);
    }
  }

  console.log(
    `\nDone! Generated ${topics.length * args.locales.length} draft posts.`,
  );
  console.log('Review and change status to "published" when ready.');
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

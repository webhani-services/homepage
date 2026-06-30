/**
 * Blog Gateway Helper
 *
 * LLM Gateway を使用したブログ記事生成の共通ロジック。
 * generate-blog / polish-blog / daily-blog が共有する。
 *
 * Environment Variables:
 *   LLM_GATEWAY_BASE_URL  LLM Gateway base URL (required)
 *   LLM_GATEWAY_TOKEN     LLM Gateway API token (required)
 */

import fs from "fs";
import path from "path";

export const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export const LOCALE_NAMES: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  ko: "Korean",
};

export interface GatewayArticle {
  title: string;
  body: string;
  tags: string[];
  summary: string;
}

export function getGatewayConfig(): { baseUrl: string; token: string } {
  const baseUrl = process.env.LLM_GATEWAY_BASE_URL;
  const token = process.env.LLM_GATEWAY_TOKEN;
  if (!baseUrl || !token) {
    throw new Error("LLM_GATEWAY_BASE_URL and LLM_GATEWAY_TOKEN are required");
  }
  return { baseUrl, token };
}

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildMdx(
  article: GatewayArticle,
  today: string,
  slug: string,
): string {
  const tagsJson = article.tags.map((t) => `"${t}"`).join(", ");
  return `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${article.summary.replace(/"/g, '\\"')}"
date: "${today}"
status: "draft"
tags: [${tagsJson}]
thumbnail: ""
author: "webhani"
slug: "${slug}"
---

${article.body}
`;
}

export function saveMdx(locale: string, slug: string, content: string): string {
  const dir = path.join(CONTENT_DIR, locale);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.mdx`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

/**
 * Register an async job on the gateway and poll until it completes.
 * Polls every 5s, up to 12 tries (60s). Throws on failed/timeout.
 */
export async function runGatewayJob(
  taskType: string,
  input: Record<string, unknown>,
  idempotencyKey?: string,
): Promise<GatewayArticle> {
  const { baseUrl, token } = getGatewayConfig();

  const body: Record<string, unknown> = { taskType, input };
  if (idempotencyKey !== undefined) {
    body.options = { idempotencyKey };
  }

  const jobRes = await fetch(`${baseUrl}/v1/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const { jobId } = (await jobRes.json()) as { jobId: string };

  // Poll (max 60s, 5s interval)
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const pollRes = await fetch(`${baseUrl}/v1/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const job = (await pollRes.json()) as {
      status: string;
      result?: GatewayArticle;
    };
    if (job.status === "succeeded" && job.result) {
      return job.result;
    }
    if (job.status === "failed") throw new Error(`Job ${jobId} failed`);
  }
  throw new Error(`Job ${jobId} timed out after 60 seconds`);
}

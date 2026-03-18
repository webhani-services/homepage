/**
 * OpenAI Provider
 *
 * 使用するには:
 * 1. `npm install openai`
 * 2. 環境変数 OPENAI_API_KEY を設定
 * 3. LLM_PROVIDER=openai で実行
 */

import type { LLMProvider, LLMGenerateOptions } from "../types.js";

const DEFAULT_MODEL = "gpt-4o";

export class OpenAIProvider implements LLMProvider {
  readonly name = "openai";
  private model: string;

  constructor(_apiKey?: string, model?: string) {
    this.model = model ?? process.env.LLM_MODEL ?? DEFAULT_MODEL;
  }

  async generate(options: LLMGenerateOptions): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let openaiModule: any;
    try {
      // @ts-expect-error -- openai is an optional dependency
      openaiModule = await import("openai");
    } catch {
      throw new Error(
        "OpenAI package not installed. Run: npm install openai"
      );
    }

    const OpenAI = openaiModule.default;
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: this.model,
      max_tokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
      messages: options.messages.map((m: LLMGenerateOptions["messages"][0]) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return response.choices[0]?.message?.content ?? "";
  }
}

/**
 * Google Gemini Provider
 *
 * 使用するには:
 * 1. `npm install @google/generative-ai`
 * 2. 環境変数 GEMINI_API_KEY を設定
 * 3. LLM_PROVIDER=gemini で実行
 */

import type { LLMProvider, LLMGenerateOptions } from "../types.js";

const DEFAULT_MODEL = "gemini-2.5-flash";

export class GeminiProvider implements LLMProvider {
  readonly name = "gemini";
  private model: string;

  constructor(_apiKey?: string, model?: string) {
    this.model = model ?? process.env.LLM_MODEL ?? DEFAULT_MODEL;
  }

  async generate(options: LLMGenerateOptions): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let geminiModule: any;
    try {
      // @ts-expect-error -- @google/generative-ai is an optional dependency
      geminiModule = await import("@google/generative-ai");
    } catch {
      throw new Error(
        "Google Generative AI package not installed. Run: npm install @google/generative-ai"
      );
    }

    const { GoogleGenerativeAI } = geminiModule;
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY ?? ""
    );
    const model = genAI.getGenerativeModel({ model: this.model });

    const systemMessage = options.messages.find((m) => m.role === "system");
    const userMessages = options.messages.filter((m) => m.role !== "system");

    const prompt = [
      ...(systemMessage ? [systemMessage.content, ""] : []),
      ...userMessages.map((m) => m.content),
    ].join("\n");

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.7,
      },
    });

    return result.response.text();
  }
}

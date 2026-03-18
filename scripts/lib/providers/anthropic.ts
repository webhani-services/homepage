import Anthropic from "@anthropic-ai/sdk";
import type { LLMProvider, LLMGenerateOptions } from "../types.js";

const DEFAULT_MODEL = "claude-sonnet-4-6";

export class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic";
  private client: Anthropic;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.client = new Anthropic({
      apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY,
    });
    this.model = model ?? process.env.LLM_MODEL ?? DEFAULT_MODEL;
  }

  async generate(options: LLMGenerateOptions): Promise<string> {
    const systemMessage = options.messages.find((m) => m.role === "system");
    const userMessages = options.messages.filter((m) => m.role !== "system");

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens ?? 4096,
      ...(systemMessage && { system: systemMessage.content }),
      messages: userMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const block = response.content[0];
    if (block.type !== "text") {
      throw new Error(`Unexpected response type: ${block.type}`);
    }
    return block.text;
  }
}

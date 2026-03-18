/**
 * LLM Provider Registry
 *
 * 新しいプロバイダーを追加するには:
 * 1. providers/ にプロバイダークラスを作成
 * 2. ここに登録
 */

import type { LLMProvider } from "./types.js";
import { AnthropicProvider } from "./providers/anthropic.js";
import { OpenAIProvider } from "./providers/openai.js";
import { GeminiProvider } from "./providers/gemini.js";

type ProviderFactory = (apiKey?: string, model?: string) => LLMProvider;

const providers: Record<string, ProviderFactory> = {
  anthropic: (apiKey, model) => new AnthropicProvider(apiKey, model),
  openai: (apiKey, model) => new OpenAIProvider(apiKey, model),
  gemini: (apiKey, model) => new GeminiProvider(apiKey, model),
};

const DEFAULT_PROVIDER = "anthropic";

export function createProvider(
  name?: string,
  apiKey?: string,
  model?: string
): LLMProvider {
  const providerName = name ?? process.env.LLM_PROVIDER ?? DEFAULT_PROVIDER;
  const factory = providers[providerName];

  if (!factory) {
    const available = Object.keys(providers).join(", ");
    throw new Error(
      `Unknown LLM provider: "${providerName}". Available: ${available}`
    );
  }

  return factory(apiKey, model);
}

export function listProviders(): string[] {
  return Object.keys(providers);
}

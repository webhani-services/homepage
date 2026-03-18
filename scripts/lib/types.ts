/**
 * LLM Provider abstraction types
 *
 * 新しいプロバイダーを追加するには:
 * 1. providers/ に新しいファイルを作成
 * 2. LLMProvider インターフェースを実装
 * 3. registry.ts に登録
 */

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMGenerateOptions {
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface LLMProvider {
  readonly name: string;
  generate(options: LLMGenerateOptions): Promise<string>;
}

export interface LLMProviderConfig {
  provider: string;
  model?: string;
  apiKey?: string;
}

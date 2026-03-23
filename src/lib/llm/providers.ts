import type { LLMProvider } from "@/types";

/**
 * Multi-LLM abstraction layer.
 * Calls the appropriate provider based on user selection.
 * All providers use a unified prompt interface.
 */

interface LLMRequest {
  provider: LLMProvider;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
}

const PROVIDER_CONFIGS: Record<
  LLMProvider,
  { envKey: string; model: string; baseUrl?: string }
> = {
  claude: {
    envKey: "ANTHROPIC_API_KEY",
    model: "claude-sonnet-4-20250514",
  },
  openai: {
    envKey: "OPENAI_API_KEY",
    model: "gpt-4o",
  },
  gemini: {
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
    model: "gemini-1.5-pro",
  },
  groq: {
    envKey: "GROQ_API_KEY",
    model: "llama-3.1-70b-versatile",
    baseUrl: "https://api.groq.com/openai/v1",
  },
};

async function callClaude(
  apiKey: string,
  system: string,
  user: string,
  temperature: number
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: PROVIDER_CONFIGS.claude.model,
      max_tokens: 4096,
      temperature,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

async function callOpenAICompatible(
  apiKey: string,
  baseUrl: string,
  model: string,
  system: string,
  user: string,
  temperature: number
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: 4096,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error (${baseUrl}): ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(
  apiKey: string,
  system: string,
  user: string,
  temperature: number
): Promise<string> {
  const model = PROVIDER_CONFIGS.gemini.model;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: user }] }],
      generationConfig: { temperature, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

export async function callLLM(request: LLMRequest): Promise<LLMResponse> {
  const config = PROVIDER_CONFIGS[request.provider];
  const apiKey = process.env[config.envKey];
  const temperature = request.temperature ?? 0.3;

  if (!apiKey) {
    throw new Error(
      `API key not configured for ${request.provider}. Set ${config.envKey} in your .env file.`
    );
  }

  let content: string;

  switch (request.provider) {
    case "claude":
      content = await callClaude(
        apiKey,
        request.systemPrompt,
        request.userPrompt,
        temperature
      );
      break;

    case "openai":
      content = await callOpenAICompatible(
        apiKey,
        "https://api.openai.com/v1",
        config.model,
        request.systemPrompt,
        request.userPrompt,
        temperature
      );
      break;

    case "groq":
      content = await callOpenAICompatible(
        apiKey,
        config.baseUrl!,
        config.model,
        request.systemPrompt,
        request.userPrompt,
        temperature
      );
      break;

    case "gemini":
      content = await callGemini(
        apiKey,
        request.systemPrompt,
        request.userPrompt,
        temperature
      );
      break;
  }

  return { content, provider: request.provider, model: config.model };
}

export function getAvailableProviders(): LLMProvider[] {
  const providers: LLMProvider[] = [];
  for (const [provider, config] of Object.entries(PROVIDER_CONFIGS)) {
    if (process.env[config.envKey]) {
      providers.push(provider as LLMProvider);
    }
  }
  return providers;
}

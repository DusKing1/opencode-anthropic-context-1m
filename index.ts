import type { Plugin } from "@opencode-ai/plugin";

const BETA = "context-1m-2025-08-07";

// Models confirmed by Anthropic docs to support 1M context:
//   Opus 4.6, Sonnet 4.6, Sonnet 4.5, Sonnet 4
const SUPPORTED = [
  "opus-4-6",
  "opus-4.6",
  "sonnet-4-6",
  "sonnet-4.6",
  "sonnet-4-5",
  "sonnet-4.5",
  "sonnet-4-2", // Sonnet 4 (date prefix: claude-sonnet-4-2025xxxx)
];

function supported(id: string): boolean {
  return id.includes("claude") && SUPPORTED.some((m) => id.includes(m));
}

export const plugin: Plugin = async () => ({
  "chat.headers": async (input, output) => {
    if (input.model.providerID !== "anthropic") return;
    if (!supported(input.model.api.id)) return;

    // @ai-sdk/anthropic merges headers via combineHeaders() which uses
    // object spread — later keys override earlier ones.  The SDK-level
    // anthropic-beta (claude-code, interleaved-thinking, …) lives in
    // config.headers and would be overwritten if we naively set
    // output.headers["anthropic-beta"].  Read the existing SDK value
    // from the provider options so we can append instead of replace.
    const sdk =
      (input.provider?.options as Record<string, any>)?.headers?.[
        "anthropic-beta"
      ] ?? "";
    const existing = output.headers["anthropic-beta"] ?? sdk;

    if (existing.includes(BETA)) return;
    output.headers["anthropic-beta"] = existing ? `${existing},${BETA}` : BETA;
  },
});

export default plugin;

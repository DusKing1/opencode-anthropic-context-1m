# opencode-anthropic-context-1m

[OpenCode](https://opencode.ai) plugin that enables the **1M token context window** for supported Anthropic Claude models.

Without this plugin, the API enforces a **200K input token limit**. This plugin injects the `context-1m-2025-08-07` beta flag, unlocking the full 1M context.

Supports both **Anthropic direct API** and **Amazon Bedrock**.

## Supported Models

- Claude Opus 4.6
- Claude Sonnet 4.6
- Claude Sonnet 4.5
- Claude Sonnet 4

## Requirements

- **Anthropic direct**: API key with **Usage Tier 4** ($400+ cumulative deposit) or custom rate limits
- **Amazon Bedrock**: Bedrock access with Claude model enabled in your region
- Requests exceeding 200K input tokens are billed at long-context rates (2x input, 1.5x output)

## Installation

### Anthropic Direct API

Add to your `opencode.json`:

```jsonc
{
  "plugin": ["opencode-anthropic-context-1m"],
  "provider": {
    "anthropic": {
      "models": {
        "claude-opus-4-6":          { "limit": { "context": 1000000, "output": 128000 } },
        "claude-sonnet-4-6":        { "limit": { "context": 1000000, "output": 64000 } },
        "claude-sonnet-4-5":        { "limit": { "context": 1000000, "output": 64000 } },
        "claude-sonnet-4-20250514": { "limit": { "context": 1000000, "output": 64000 } }
      }
    }
  }
}
```

### Amazon Bedrock

```jsonc
{
  "plugin": ["opencode-anthropic-context-1m"],
  "provider": {
    "amazon-bedrock": {
      "models": {
        "anthropic.claude-opus-4-6-v1":              { "limit": { "context": 1000000, "output": 128000 } },
        "anthropic.claude-sonnet-4-6":               { "limit": { "context": 1000000, "output": 64000 } },
        "anthropic.claude-sonnet-4-5-20250929-v1:0": { "limit": { "context": 1000000, "output": 64000 } },
        "anthropic.claude-sonnet-4-20250514-v1:0":   { "limit": { "context": 1000000, "output": 64000 } }
      }
    }
  }
}
```

> **Note**: You don't need to include the region prefix (`us.`, `eu.`, `global.`, etc.) — OpenCode adds it automatically based on your `AWS_REGION`.

The `plugin` entry enables the 1M beta flag. The `provider.*.models` entries override the default 200K context limit so that OpenCode's auto-compaction triggers at ~968K instead of ~168K.

## How It Works

- **Anthropic direct** — uses the `chat.headers` hook to append `context-1m-2025-08-07` to the `anthropic-beta` HTTP header. It reads the current SDK-level beta flags and appends (not replaces) to preserve essential features like `claude-code`, `interleaved-thinking`, and `fine-grained-tool-streaming`.
- **Amazon Bedrock** — uses the `chat.params` hook to inject `anthropicBeta: ["context-1m-2025-08-07"]` into the provider options. The `@ai-sdk/amazon-bedrock` SDK translates this into `additionalModelRequestFields.anthropic_beta` in the Converse API request body.

## License

MIT

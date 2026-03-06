# opencode-anthropic-context-1m

[OpenCode](https://opencode.ai) plugin that enables the **1M token context window** for supported Anthropic Claude models.

Without this plugin, the Anthropic API enforces a **200K input token limit**. This plugin appends the `context-1m-2025-08-07` beta flag to the `anthropic-beta` header, unlocking the full 1M context.

## Supported Models

- Claude Opus 4.6
- Claude Sonnet 4.6
- Claude Sonnet 4.5
- Claude Sonnet 4

## Requirements

- Anthropic API key with **Usage Tier 4** ($400+ cumulative deposit) or custom rate limits
- Requests exceeding 200K input tokens are billed at long-context rates (2x input, 1.5x output)

## Installation

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

The `plugin` entry enables the 1M beta header. The `provider.anthropic.models` entries override the default 200K context limit so that OpenCode's auto-compaction triggers at ~968K instead of ~168K.

## How It Works

The plugin uses the `chat.headers` hook to append `context-1m-2025-08-07` to the existing `anthropic-beta` header. It reads the current SDK-level beta flags and appends (not replaces) to preserve essential features like `claude-code`, `interleaved-thinking`, and `fine-grained-tool-streaming`.

## License

MIT

# Contributing to Fresh News

Thanks for your interest in contributing! Fresh News is an open source AI news research platform, and we welcome contributions of all kinds.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Fresh-news.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and add at least one LLM API key and one search API key
5. Run the dev server: `npm run dev`
6. Create a branch for your changes: `git checkout -b feature/your-feature`

## Development Guidelines

### Code Style
- TypeScript strict mode — no `any` types
- Functional components with hooks (no class components)
- Prefer named exports over default exports (except pages)

### Security Requirements
All contributions MUST follow these security practices:

- **Never put API keys in URLs** — always use headers
- **Sanitize all external input** — use the utilities in `src/lib/security/sanitize.ts`
- **Wrap untrusted content in data delimiters** when building LLM prompts
- **Validate LLM response shapes at runtime** — never trust `as` casts on external data
- **Never expose internal errors to clients** — use generic messages
- **Add timeouts to all fetch calls** — use `AbortSignal.timeout()`

### Adding a New LLM Provider
1. Add the provider to the `LLMProvider` type in `src/types/index.ts`
2. Add config to `PROVIDER_CONFIGS` and `LLM_OPTIONS`
3. Implement the API call function in `src/lib/llm/providers.ts`
4. Add the provider to the `VALID_PROVIDERS` set
5. Ensure API key is sent via headers, not URL params

### Adding a New Search Source
1. Create a new file in `src/lib/search/`
2. Use `sanitizeUrl()` on all URLs from the source
3. Use `stripHtml()` on any HTML content
4. Add timeout to fetch calls
5. Wire it into `src/lib/search/index.ts`

## Pull Request Process

1. Ensure your code passes `npm run lint` and `npm run build`
2. Write clear commit messages describing the "why"
3. Keep PRs focused — one feature or fix per PR
4. Update the README if you're adding new features or config options
5. If adding new dependencies, justify why they're needed

## Reporting Issues

- Use GitHub Issues for bugs and feature requests
- For security vulnerabilities, see [SECURITY.md](SECURITY.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

# Fresh News — AI Research Machine

An AI-powered news research platform inspired by [Andrej Karpathy's auto-search](https://github.com/karpathy). Fresh News searches the web, gathers sources from multiple feeds, and uses **your chosen AI** to analyze each article for bias, factual claims, and credibility.

**The AI analyzes. You decide.**

## How It Works

```
Topic Input → Multi-Source Search → LLM Analysis → Bias Detection → Synthesis → User Verdict
```

1. **You enter a topic** — anything you want to research
2. **Multi-source search** — searches Tavily, Serper, NewsAPI, and RSS feeds simultaneously
3. **AI analysis** — your chosen LLM analyzes each article for facts, bias, sentiment, and credibility
4. **Synthesis** — the AI cross-references all sources to find consensus, conflicts, and information gaps
5. **Your verdict** — you accept, reject, or mark each article as "unsure"

## Key Features

- **Multi-LLM Support** — Choose from Claude, GPT-4o, Gemini Pro, or Llama 3.1 (via Groq)
- **Bias Detection** — Each article gets a bias score (0-10) with specific biases identified
- **Source Diversity** — Combines web search + structured news APIs + RSS feeds
- **User Sovereignty** — The AI presents analysis; you make the final judgment
- **Research Depth** — Quick (3 sources), Standard (5), or Deep (10)

## Tech Stack

- **Framework**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS (dark mode)
- **State**: Zustand
- **LLM Providers**: Anthropic, OpenAI, Google AI, Groq
- **Search**: Tavily, Serper, NewsAPI, RSS

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and add your API keys
cp .env.example .env

# Run development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Required API Keys

Add at least **one LLM provider** and **one search provider** to your `.env`:

```env
# LLM (pick at least one)
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
GROQ_API_KEY=...

# Search (pick at least one)
TAVILY_API_KEY=...
SERPER_API_KEY=...
NEWS_API_KEY=...
```

RSS feeds work without any API key.

## Philosophy

Traditional news aggregators have editorial control. Fresh News flips this:

- **No editorial layer** — the AI doesn't decide what's important, it analyzes what it finds
- **Bias detection, not bias injection** — the LLM is instructed to *detect* bias patterns, not form opinions
- **User sovereignty** — you see the analysis, you see the bias scores, and you make the call
- **Transparency** — every source is linked, every bias is flagged, every fact is listed

## License

MIT

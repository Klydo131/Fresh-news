import type { ResearchReport, SourceArticle, AnalyzedArticle } from "@/types";

/**
 * Demo data — realistic mock research results so users can
 * experience the full UI without any API keys.
 * Topic: "AI regulation" — a topic with natural multi-perspective coverage.
 */

const DEMO_SOURCES: SourceArticle[] = [
  {
    id: "src-0",
    title: "EU Passes Landmark AI Act, Setting Global Standard for Regulation",
    url: "https://example.com/eu-ai-act",
    snippet:
      "The European Union has formally adopted the AI Act, the world's first comprehensive legal framework for artificial intelligence. The regulation classifies AI systems by risk level and imposes strict requirements on high-risk applications including biometric surveillance, critical infrastructure, and hiring tools. Companies face fines of up to 7% of global revenue for violations.",
    source: "Reuters",
    publishedAt: "2026-03-22T14:30:00Z",
    searchProvider: "tavily",
  },
  {
    id: "src-1",
    title: "Tech Industry Warns AI Regulations Could Stifle Innovation",
    url: "https://example.com/tech-warns-regulation",
    snippet:
      "Major technology companies have pushed back against proposed AI regulations, arguing that overly prescriptive rules could slow the pace of innovation and push AI development to less regulated jurisdictions. Industry groups cite potential job losses and reduced competitiveness. Critics say the industry is prioritizing profits over safety.",
    source: "TechCrunch",
    publishedAt: "2026-03-21T09:15:00Z",
    searchProvider: "serper",
  },
  {
    id: "src-2",
    title: "US Proposes Bipartisan AI Safety Framework",
    url: "https://example.com/us-ai-framework",
    snippet:
      "A bipartisan group of senators has introduced a new AI safety bill that would create a federal AI oversight body and require safety testing for frontier AI models. The proposal takes a lighter approach than the EU's AI Act, focusing on the most powerful systems rather than broad categorization. Industry reaction has been cautiously supportive.",
    source: "The Washington Post",
    publishedAt: "2026-03-20T16:45:00Z",
    searchProvider: "newsapi",
  },
  {
    id: "src-3",
    title: "AI Researchers Divided on Regulation Approach",
    url: "https://example.com/researchers-divided",
    snippet:
      "The AI research community remains split on the best approach to regulation. Some researchers advocate for strict government oversight citing existential risks, while others argue that self-regulation and open-source transparency would be more effective. A recent survey of 2,500 AI researchers showed 62% support some form of government regulation, but disagree on specifics.",
    source: "Nature",
    publishedAt: "2026-03-19T11:00:00Z",
    searchProvider: "tavily",
  },
  {
    id: "src-4",
    title: "China Releases Updated AI Governance Rules Targeting Generative Models",
    url: "https://example.com/china-ai-rules",
    snippet:
      "China's Cyberspace Administration has issued new regulations specifically targeting generative AI services, requiring companies to register models, conduct security assessments, and ensure outputs align with 'core socialist values.' The rules represent a fundamentally different approach to AI governance compared to Western frameworks, prioritizing state control over individual rights.",
    source: "South China Morning Post",
    publishedAt: "2026-03-18T08:20:00Z",
    searchProvider: "rss",
  },
];

const DEMO_ARTICLES: AnalyzedArticle[] = [
  {
    id: "analysis-src-0",
    article: DEMO_SOURCES[0],
    analysis: {
      summary:
        "Reports on the EU AI Act's formal adoption as the first comprehensive AI legal framework. Focuses on risk-based classification and enforcement penalties. Largely factual coverage with specific regulatory details.",
      keyFacts: [
        "EU AI Act formally adopted — first comprehensive AI law globally",
        "Risk-based classification system for AI applications",
        "High-risk categories include biometric surveillance and hiring tools",
        "Fines up to 7% of global revenue for violations",
      ],
      potentialBiases: [
        "Framing as 'landmark' and 'global standard' implies positive evaluation",
        "Limited coverage of industry criticism or implementation challenges",
      ],
      biasScore: 2,
      sentiment: "positive",
      credibilityNotes:
        "Reuters is a major wire service with strong editorial standards. Specific regulatory details are verifiable. The 'global standard' framing is editorial but widely used.",
    },
  },
  {
    id: "analysis-src-1",
    article: DEMO_SOURCES[1],
    analysis: {
      summary:
        "Presents the technology industry's opposition to AI regulation, citing innovation and competitiveness concerns. Includes counterpoint from critics. Shows clear industry-perspective framing.",
      keyFacts: [
        "Tech companies argue regulations could slow AI innovation",
        "Industry warns of potential job losses and reduced competitiveness",
        "Concern about AI development moving to less regulated regions",
      ],
      potentialBiases: [
        "Leads with industry perspective — frames regulation as threat rather than protection",
        "Uses 'stifle innovation' language that originates from industry lobbying",
        "Critic perspective relegated to end of article",
      ],
      biasScore: 5,
      sentiment: "negative",
      credibilityNotes:
        "TechCrunch covers technology industry news and tends to platform industry viewpoints. The concerns cited are real but the framing gives disproportionate weight to corporate perspectives.",
    },
  },
  {
    id: "analysis-src-2",
    article: DEMO_SOURCES[2],
    analysis: {
      summary:
        "Reports on a bipartisan US AI safety proposal that takes a narrower approach than EU regulation, focusing on frontier models. Coverage is balanced, noting both the proposal's content and industry reaction.",
      keyFacts: [
        "Bipartisan senators introduced AI safety legislation",
        "Would create a federal AI oversight body",
        "Requires safety testing for frontier AI models specifically",
        "Takes lighter approach than EU AI Act",
        "Industry reaction described as 'cautiously supportive'",
      ],
      potentialBiases: [
        "Describing industry reaction as 'cautiously supportive' without attribution",
        "Framing US approach as 'lighter' implies EU approach may be heavy-handed",
      ],
      biasScore: 2,
      sentiment: "neutral",
      credibilityNotes:
        "The Washington Post is a major newspaper with strong editorial standards. The reporting includes specific legislative details and multiple perspectives. Good factual grounding.",
    },
  },
  {
    id: "analysis-src-3",
    article: DEMO_SOURCES[3],
    analysis: {
      summary:
        "Survey-based article showing AI researcher community is divided on regulation. Presents multiple viewpoints with quantitative data. Strong factual basis with survey methodology.",
      keyFacts: [
        "Survey of 2,500 AI researchers conducted",
        "62% support some form of government regulation",
        "Community divided on specifics of implementation",
        "Debate between government oversight vs self-regulation and open-source approaches",
      ],
      potentialBiases: [
        "Survey methodology not fully detailed — sample selection matters",
        "Framing as 'divided' when 62% majority supports regulation could understate consensus",
      ],
      biasScore: 1,
      sentiment: "neutral",
      credibilityNotes:
        "Nature is a top-tier scientific journal. Survey data provides concrete quantitative grounding. This is the most empirically rigorous source in the set.",
    },
  },
  {
    id: "analysis-src-4",
    article: DEMO_SOURCES[4],
    analysis: {
      summary:
        "Reports on China's generative AI regulations requiring model registration and content alignment. Notes the contrast with Western approaches. Contains value-laden framing in comparing governance models.",
      keyFacts: [
        "China's Cyberspace Administration issued new generative AI regulations",
        "Requirements: model registration, security assessments",
        "Outputs must align with 'core socialist values'",
        "Different approach than Western regulatory frameworks",
      ],
      potentialBiases: [
        "Framing China's approach as 'prioritizing state control over individual rights' is editorial",
        "Uses 'fundamentally different' language that implies one approach is abnormal",
        "Does not explore potential benefits of China's approach from Chinese perspective",
      ],
      biasScore: 4,
      sentiment: "neutral",
      credibilityNotes:
        "South China Morning Post is a Hong Kong-based outlet. Provides useful perspective on Chinese regulation but the comparative framing carries implicit Western-normative assumptions.",
    },
  },
];

export const DEMO_REPORT: ResearchReport = {
  id: "demo-research-001",
  query: {
    topic: "AI regulation",
    llmProvider: "claude",
    depth: "standard",
  },
  timestamp: new Date().toISOString(),
  sources: DEMO_SOURCES,
  articles: DEMO_ARTICLES,
  synthesis: {
    overview:
      "AI regulation is rapidly evolving globally with three distinct approaches emerging: the EU's comprehensive risk-based framework (AI Act), the US's targeted frontier-model approach, and China's state-centric generative AI rules. There is broad agreement that some form of AI governance is needed, but significant disagreement on scope, enforcement mechanisms, and the balance between safety and innovation.",
    consensusPoints: [
      "All major jurisdictions agree AI governance frameworks are necessary",
      "High-risk AI applications (biometrics, critical infrastructure) need oversight",
      "A majority (62%) of AI researchers support some government regulation",
      "Current regulatory approaches are converging on risk-based assessment models",
    ],
    conflictingPoints: [
      "Industry claims regulation stifles innovation vs. researchers who argue it ensures safety",
      "EU broad categorization approach vs. US targeted frontier-model focus",
      "Western rights-based frameworks vs. China's state-control model",
      "Self-regulation advocates vs. government oversight proponents in research community",
    ],
    informationGaps: [
      "How will the EU AI Act actually be enforced across member states?",
      "What specific safety testing requirements will the US proposal include?",
      "How are smaller nations and the Global South approaching AI regulation?",
      "What is the actual economic impact of existing AI regulations?",
      "How do open-source AI models fit into these regulatory frameworks?",
    ],
    recommendation:
      "This topic benefits from reading across multiple jurisdictions and perspectives. Be alert to industry-funded sources framing regulation as purely negative, and to government sources understating implementation challenges. The Nature survey data provides the most empirically grounded perspective. Consider that 'regulation' spans a wide spectrum — the debate is less about whether to regulate and more about how.",
  },
  phase: "complete",
};

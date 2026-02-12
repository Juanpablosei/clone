export interface SuccessStory {
  slug: string;
  category: string;
  headline: string;
  highlightedWord?: string; // Palabra a destacar en verde en el headline
  summary: string;
  industry: string;
  heroImage: string;
  heroImageAlt?: string;
  metric?: string;
  metricDescription?: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

// Datos de ejemplo - en el futuro vendrán de la base de datos
export const SUCCESS_STORIES: SuccessStory[] = [
  {
    slug: "salesforce-integration-healthcare",
    category: "SUCCESS STORY",
    headline: "Salesforce Integration Generates H&N Success in Healthcare",
    highlightedWord: "Success",
    summary:
      "When two multibillion-dollar companies merge, sustained success hinges on seamless salesforce integration. During a major healthcare industry merger, Gradient navigated complex challenges to unite two distinct sales organizations into a single, high-performing team poised for growth.",
    industry: "LIFE SCIENCES & HEALTH CARE",
    heroImage: "/Professional_Discussion.png",
    heroImageAlt: "Healthcare success story",
    metric: "1.6x",
    metricDescription: "NET SYNERGIES REALIZED ABOVE THE INITIAL TARGET IN THE FIRST YEAR",
    sections: [
      {
        title: "The Situation",
        content:
          "Two major healthcare companies had the opportunity to secure leading positions across their markets through a strategic merger. However, realizing the full benefits required integrating their distinct sales approaches into a unified, high-performing organization. The challenge was not just technical—it involved aligning cultures, processes, and systems that had evolved independently over decades.",
      },
      {
        title: "The Approach",
        content:
          "Gradient worked closely with leadership to map out the integration strategy, identifying key bottlenecks and opportunities for synergy. We developed a phased approach that prioritized critical sales functions while maintaining business continuity. Our team facilitated workshops and training sessions to align both organizations around shared goals and best practices.",
      },
      {
        title: "The Results",
        content:
          "The integrated salesforce achieved 1.6x net synergies above the initial target in the first year. Beyond the numbers, the unified team demonstrated improved collaboration, faster decision-making, and a stronger competitive position in the market. The success of this integration has become a model for future organizational transformations.",
      },
    ],
  },
  {
    slug: "policy-guidance-ai-deployment",
    category: "CASE STUDY",
    headline: "Policy Guidance for Responsible AI Deployment",
    summary:
      "A government agency sought expert guidance on developing policies for responsible AI deployment across multiple departments. Gradient provided evidence-based frameworks that balanced innovation with safety and accountability.",
    industry: "GOVERNMENT & PUBLIC SECTOR",
    heroImage: "/Conference.png",
    heroImageAlt: "Policy guidance case study",
    sections: [
      {
        title: "The Challenge",
        content:
          "The agency needed to create comprehensive AI governance policies that would apply across diverse use cases, from citizen services to internal operations. They required guidance that was both technically sound and practically implementable.",
      },
      {
        title: "Our Solution",
        content:
          "Gradient conducted a thorough assessment of the agency's AI use cases and developed tailored policy frameworks. We provided workshops for key stakeholders and created documentation that balanced regulatory requirements with operational flexibility.",
      },
      {
        title: "Impact",
        content:
          "The agency successfully implemented AI governance policies across all departments, with 2x faster alignment across stakeholders using evidence-based frameworks. The policies have since been adopted as a model by other government organizations.",
      },
    ],
  },
  {
    slug: "workshop-series-capability-building",
    category: "SUCCESS STORY",
    headline: "Workshop Series Builds Internal Capability",
    summary:
      "A civil society organization wanted to build internal understanding of AI to better advocate for responsible technology policy. Gradient designed and delivered a series of workshops that empowered their team with practical knowledge and judgment.",
    industry: "CIVIL SOCIETY",
    heroImage: "/Discussion.png",
    heroImageAlt: "Workshop series",
    sections: [
      {
        title: "The Need",
        content:
          "The organization recognized that effective advocacy required deep understanding of AI systems, their capabilities, limitations, and societal impacts. They needed training that went beyond surface-level explanations without overwhelming non-technical staff.",
      },
      {
        title: "The Program",
        content:
          "Gradient developed a multi-session workshop series covering AI fundamentals, real-world case studies, and practical exercises. Each session was tailored to the organization's specific advocacy goals and included opportunities for hands-on learning.",
      },
      {
        title: "Outcomes",
        content:
          "85% of participants reported increased confidence in AI-related decisions. The organization has since launched several successful advocacy campaigns informed by the knowledge gained in the workshops, demonstrating the practical value of building internal capability.",
      },
    ],
  },
];

export function getSuccessStoryBySlug(slug: string): SuccessStory | null {
  return SUCCESS_STORIES.find((story) => story.slug === slug) || null;
}

export function getAllSuccessStorySlugs(): string[] {
  return SUCCESS_STORIES.map((story) => story.slug);
}

// Hardcoded Nepali tech-market dataset. Pure data, no logic — kept separate
// from agent code so it can be curated/edited independently.

export interface CompanyProfile {
  name: string;
  industry: string;
  techStack: string[];
}

export interface MarketNorms {
  salaryRangesNPR: Record<string, { min: number; max: number }>;
  commonDegreeRequirements: string[];
  typicalBenefits: string[];
}

export interface NepaliMarketData {
  companies: CompanyProfile[];
  marketNorms: MarketNorms;
}

export const NEPALI_MARKET_DATA: NepaliMarketData = {
  companies: [
    {
      name: "F1Soft International",
      industry: "Fintech",
      techStack: ["Java", "Spring Boot", "Angular", "PostgreSQL", "Kubernetes"],
    },
    {
      name: "Deerwalk",
      industry: "Healthcare Analytics",
      techStack: ["Java", "React", "Python", "MySQL", "AWS"],
    },
    {
      name: "Logpoint",
      industry: "Cybersecurity (SIEM)",
      techStack: ["Python", "Go", "React", "Elasticsearch", "Docker"],
    },
  ],
  marketNorms: {
    salaryRangesNPR: {
      entry: { min: 30000, max: 60000 },
      mid: { min: 60000, max: 120000 },
      senior: { min: 120000, max: 250000 },
      lead: { min: 200000, max: 400000 },
    },
    commonDegreeRequirements: [
      "Bachelor's in Computer Science, Computer Engineering, or IT",
      "BSc CSIT / BE Computer / BIT commonly accepted",
    ],
    typicalBenefits: [
      "Provident fund",
      "Festival bonus (Dashain/Tihar)",
      "Health insurance",
      "Paid leave (annual, sick, casual)",
      "Hybrid or remote work options",
    ],
  },
};

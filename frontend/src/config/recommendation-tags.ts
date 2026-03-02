export type ProfessionCategory = {
  [category: string]: string[];
};

export type RecommendationTagsConfig = {
  [profession: string]: ProfessionCategory;
};

export const RECOMMENDATION_TAGS: RecommendationTagsConfig = {
  LAWYER: {
    "Performance & Results": [
      "Won my case",
      "Strong legal strategy",
      "Highly knowledgeable",
      "Detail oriented",
    ],
    "Communication": [
      "Explained things clearly",
      "Easy to communicate with",
      "Responsive and reliable",
      "Made me feel comfortable",
    ],
    "Cost & Value": [
      "Transparent pricing",
      "Worth every dollar",
      "Fair billing",
    ],
    "Trust": [
      "Honest and ethical",
      "Genuinely cared about my case",
      "Went above and beyond",
    ],
  },
  ACCOUNTANT: {
    "Technical Competence": [
      "Highly knowledgeable",
      "Very detail oriented",
      "Accurate and thorough",
      "Strategic financial guidance",
    ],
    "Communication": [
      "Explained things clearly",
      "Easy to communicate with",
      "Responsive and reliable",
    ],
    "Cost & Value": [
      "Affordable",
      "Transparent pricing",
      "No surprise fees",
      "Worth every dollar",
    ],
    "Trust": [
      "Honest and trustworthy",
      "Reliable year after year",
      "Genuinely cared about my financial goals",
    ],
  },
  "REAL ESTATE AGENT": {
    "Performance": [
      "Sold quickly",
      "Negotiated strongly",
      "Found exactly what I needed",
      "Great market knowledge",
    ],
    "Communication": [
      "Always available",
      "Clear and honest",
      "Kept me updated",
    ],
    "Experience": [
      "Smooth process",
      "Stress free",
      "Organized and professional",
    ],
    "Trust": [
      "Honest and transparent",
      "Put my interests first",
    ],
  },
  FINANCIAL_ADVISOR: {
    "Expertise": [
      "Deep financial knowledge",
      "Strategic planning",
      "Excellent investment advice",
      "Tax efficient strategies",
    ],
    "Communication": [
      "Explains complex topics clearly",
      "Responsive and accessible",
      "Patient with questions",
    ],
    "Results": [
      "Helped me reach my goals",
      "Strong portfolio performance",
      "Saved me money",
    ],
    "Trust": [
      "Acts in my best interest",
      "Transparent about fees",
      "Long-term focused",
    ],
  },
  DOCTOR: {
    "Medical Care": [
      "Accurate diagnosis",
      "Effective treatment",
      "Thorough examinations",
      "Highly knowledgeable",
    ],
    "Bedside Manner": [
      "Compassionate and caring",
      "Good listener",
      "Explains things clearly",
      "Makes me feel comfortable",
    ],
    "Accessibility": [
      "Easy to schedule",
      "Minimal wait times",
      "Responsive to concerns",
    ],
    "Trust": [
      "Trustworthy and ethical",
      "Takes time with patients",
      "Genuinely cares",
    ],
  },
};

export const WOULD_USE_AGAIN_OPTIONS = [
  "Absolutely",
  "Probably",
  "Maybe",
  "Not sure",
] as const;

export type WouldUseAgainOption = typeof WOULD_USE_AGAIN_OPTIONS[number];

export function getTagsForProfession(profession: string): ProfessionCategory {
  const normalizedProfession = profession.toUpperCase().replace(/\s+/g, "_");
  return RECOMMENDATION_TAGS[normalizedProfession] || RECOMMENDATION_TAGS.LAWYER;
}

export function getAllTagsForProfession(profession: string): string[] {
  const categories = getTagsForProfession(profession);
  return Object.values(categories).flat();
}

export function normalizeProfession(profession: string): string {
  const normalized = profession.toUpperCase().trim();
  
  const professionMap: { [key: string]: string } = {
    "LAWYER": "LAWYER",
    "ATTORNEY": "LAWYER",
    "LEGAL": "LAWYER",
    "ACCOUNTANT": "ACCOUNTANT",
    "CPA": "ACCOUNTANT",
    "TAX": "ACCOUNTANT",
    "REAL ESTATE": "REAL ESTATE AGENT",
    "REALTOR": "REAL ESTATE AGENT",
    "REAL ESTATE AGENT": "REAL ESTATE AGENT",
    "FINANCIAL ADVISOR": "FINANCIAL_ADVISOR",
    "FINANCIAL PLANNER": "FINANCIAL_ADVISOR",
    "WEALTH MANAGER": "FINANCIAL_ADVISOR",
    "DOCTOR": "DOCTOR",
    "PHYSICIAN": "DOCTOR",
    "MD": "DOCTOR",
  };
  
  for (const [key, value] of Object.entries(professionMap)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  return "LAWYER";
}

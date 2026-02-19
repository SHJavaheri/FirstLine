import bcrypt from "bcryptjs";

import { adminSeed } from "../src/backend/config/admins";
import { prisma } from "../src/database/prisma";

type ProfessionalSeed = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  specializations: string[];
  description: string;
  hourlyRate: number;
  minRate?: number;
  maxRate?: number;
  rating: number;
  yearsExperience: number;
  totalExperienceYears?: number;
  location: string;
  jobTitle: string;
  firmName?: string;
  firmWebsite?: string;
  firmAddress?: string;
  licenseNumber?: string;
  licensingBody?: string;
  licenseJurisdiction?: string;
  pricingModel?: string;
  pricingDetails?: string;
  offersInPerson?: boolean;
  offersRemote?: boolean;
  acceptsNewClients?: boolean;
  verified?: boolean;
  yearsAtCurrentFirm?: number;
};

const professionals: ProfessionalSeed[] = [
  {
    firstName: "Ava",
    lastName: "Martinez",
    email: "ava.martinez@firstline-demo.com",
    phone: "+1 (212) 555-0180",
    profession: "Lawyer",
    specializations: ["Corporate Law", "Venture Capital"],
    description:
      "Advises scaling startups and mid-market companies on venture financing, M&A, and governance.",
    hourlyRate: 320,
    minRate: 290,
    maxRate: 350,
    rating: 4.9,
    yearsExperience: 14,
    totalExperienceYears: 14,
    location: "New York, NY",
    jobTitle: "Partner",
    firmName: "Martinez & Co.",
    firmWebsite: "https://www.martinezco.com",
    licenseNumber: "NY-12-3456",
    licensingBody: "New York State Bar",
    licenseJurisdiction: "NY",
    pricingModel: "Hourly",
    pricingDetails: "$320/hr with flexibility for retainers",
    offersInPerson: true,
    offersRemote: true,
    acceptsNewClients: true,
    verified: true,
    yearsAtCurrentFirm: 6,
  },
  {
    firstName: "Noah",
    lastName: "Carter",
    email: "noah.carter@firstline-demo.com",
    phone: "+1 (310) 555-0142",
    profession: "Lawyer",
    specializations: ["Immigration Law", "Employment-Based Visas"],
    description:
      "Represents professionals and families in employment-based visas, green cards, and naturalization.",
    hourlyRate: 210,
    rating: 4.8,
    yearsExperience: 11,
    totalExperienceYears: 11,
    location: "Los Angeles, CA",
    jobTitle: "Senior Associate",
    firmName: "Carter Immigration",
    licenseNumber: "CA-IMM-9822",
    licensingBody: "California Bar",
    licenseJurisdiction: "CA",
    pricingModel: "Fixed + Hourly",
    pricingDetails: "Fixed fee for filings, hourly for counseling",
    offersInPerson: true,
    offersRemote: true,
    acceptsNewClients: true,
    verified: true,
    yearsAtCurrentFirm: 4,
  },
  {
    firstName: "Sophia",
    lastName: "Kim",
    email: "sophia.kim@firstline-demo.com",
    phone: "+1 (773) 555-0197",
    profession: "Lawyer",
    specializations: ["Family Law", "Divorce Mediation"],
    description:
      "Handles high-conflict custody, divorce mediation, and post-judgment modifications with empathy and rigor.",
    hourlyRate: 240,
    rating: 4.7,
    yearsExperience: 10,
    location: "Chicago, IL",
    jobTitle: "Director",
    firmName: "Kim Family Law",
    licenseNumber: "IL-26654",
    licensingBody: "Illinois State Bar",
    licenseJurisdiction: "IL",
    pricingModel: "Contingency",
    pricingDetails: "Sliding scale plus retainers",
    offersRemote: true,
    acceptsNewClients: true,
  },
  {
    firstName: "Liam",
    lastName: "Johnson",
    email: "liam.johnson@firstline-demo.com",
    phone: "+1 (713) 555-0134",
    profession: "Lawyer",
    specializations: ["Criminal Defense", "Federal Litigation"],
    description:
      "Focuses on felony defense, pre-trial negotiations, and jury trial strategy in state and federal courts.",
    hourlyRate: 295,
    rating: 4.8,
    yearsExperience: 13,
    location: "Houston, TX",
    jobTitle: "Lead Counsel",
    firmName: "Johnson Defense",
    licenseNumber: "TX-77812",
    licensingBody: "State Bar of Texas",
    licenseJurisdiction: "TX",
    pricingModel: "Hourly",
    pricingDetails: "$295/hr with trial packages",
    offersInPerson: true,
    verified: true,
  },
  {
    firstName: "Emma",
    lastName: "Patel",
    email: "emma.patel@firstline-demo.com",
    phone: "+1 (415) 555-0122",
    profession: "Lawyer",
    specializations: ["Employment Law", "Workplace Investigations"],
    description:
      "Counsels executives and employers on discrimination claims, contracts, and workplace investigations.",
    hourlyRate: 260,
    rating: 4.9,
    yearsExperience: 12,
    location: "San Francisco, CA",
    jobTitle: "Partner",
    firmName: "Patel Employment Group",
    licenseNumber: "CA-EMP-4521",
    licensingBody: "California State Bar",
    licenseJurisdiction: "CA",
    pricingModel: "Fixed",
    pricingDetails: "Fixed fee retainers for corporate clients",
    offersInPerson: true,
    offersRemote: true,
  },
  {
    firstName: "James",
    lastName: "Robinson",
    email: "james.robinson@firstline-demo.com",
    phone: "+1 (305) 555-0176",
    profession: "Lawyer",
    specializations: ["Real Estate Law", "Commercial Transactions"],
    description:
      "Supports commercial and residential transactions, title issues, leasing, and zoning compliance.",
    hourlyRate: 230,
    rating: 4.6,
    yearsExperience: 9,
    location: "Miami, FL",
    jobTitle: "Counsel",
    firmName: "Robinson Real Estate",
    licenseNumber: "FL-REA-9981",
    licensingBody: "Florida Bar",
    licenseJurisdiction: "FL",
    pricingModel: "Hourly",
    pricingDetails: "Flat closing packages available",
    offersRemote: true,
  },
  {
    firstName: "Olivia",
    lastName: "Nguyen",
    email: "olivia.nguyen@firstline-demo.com",
    phone: "+1 (206) 555-0168",
    profession: "Lawyer",
    specializations: ["Intellectual Property", "Patent Strategy"],
    description:
      "Protects software, design, and media assets through trademark, copyright, and licensing strategy.",
    hourlyRate: 340,
    rating: 4.9,
    yearsExperience: 15,
    location: "Seattle, WA",
    jobTitle: "Managing Partner",
    firmName: "Nguyen IP Collective",
    licenseNumber: "WA-IP-5771",
    licensingBody: "Washington State Bar",
    licenseJurisdiction: "WA",
    pricingModel: "Hourly",
    pricingDetails: "$340/hr with bundled patent prosecution",
    acceptsNewClients: true,
    offersRemote: true,
  },
  {
    firstName: "William",
    lastName: "Davis",
    email: "william.davis@firstline-demo.com",
    phone: "+1 (617) 555-0157",
    profession: "Lawyer",
    specializations: ["Tax Law", "Wealth Planning"],
    description:
      "Guides founders and high-net-worth clients through complex tax planning and audit defense.",
    hourlyRate: 360,
    rating: 4.8,
    yearsExperience: 16,
    location: "Boston, MA",
    jobTitle: "Partner",
    firmName: "Davis Tax Advisors",
    licenseNumber: "MA-TAX-8800",
    licensingBody: "Massachusetts Bar",
    licenseJurisdiction: "MA",
    pricingModel: "Hourly",
    pricingDetails: "$360/hr with annual retainers",
    offersRemote: true,
  },
  {
    firstName: "Isabella",
    lastName: "Brooks",
    email: "isabella.brooks@firstline-demo.com",
    phone: "+1 (602) 555-0114",
    profession: "Lawyer",
    specializations: ["Personal Injury", "Medical Malpractice"],
    description:
      "Represents injury victims in negotiation and litigation, with a strong record on settlements.",
    hourlyRate: 220,
    rating: 4.7,
    yearsExperience: 8,
    location: "Phoenix, AZ",
    jobTitle: "Founder",
    firmName: "Brooks Injury Group",
    licenseNumber: "AZ-PI-3341",
    licensingBody: "Arizona Bar",
    licenseJurisdiction: "AZ",
    pricingModel: "Contingency",
    pricingDetails: "No win, no fee",
    offersRemote: true,
  },
  {
    firstName: "Benjamin",
    lastName: "Clark",
    email: "benjamin.clark@firstline-demo.com",
    phone: "+1 (720) 555-0185",
    profession: "Lawyer",
    specializations: ["Bankruptcy Law"],
    description:
      "Advises individuals and small businesses on Chapter 7/11/13 filings and creditor negotiations.",
    hourlyRate: 245,
    rating: 4.6,
    yearsExperience: 10,
    location: "Denver, CO",
    jobTitle: "Senior Partner",
    firmName: "Clark Restructuring",
    licenseNumber: "CO-BNK-4419",
    licensingBody: "Colorado Bar",
    licenseJurisdiction: "CO",
    pricingModel: "Fixed",
    pricingDetails: "Fixed rate for bankruptcy packages",
    offersRemote: true,
  },
  {
    firstName: "Mia",
    lastName: "Sanders",
    email: "mia.sanders@firstline-demo.com",
    phone: "+1 (404) 555-0105",
    profession: "Lawyer",
    specializations: ["Civil Litigation", "Commercial Disputes"],
    description: "Leads commercial dispute resolution from early case assessment through trial and appeal.",
    hourlyRate: 300,
    rating: 4.8,
    yearsExperience: 12,
    location: "Atlanta, GA",
    jobTitle: "Partner",
    firmName: "Sanders Litigation",
    licenseNumber: "GA-LIT-4403",
    licensingBody: "Georgia Bar",
    licenseJurisdiction: "GA",
    pricingModel: "Hourly",
    pricingDetails: "$300/hr with tiered retainers",
    verified: true,
    offersInPerson: true,
  },
  {
    firstName: "Ethan",
    lastName: "Foster",
    email: "ethan.foster@firstline-demo.com",
    phone: "+1 (615) 555-0190",
    profession: "Lawyer",
    specializations: ["Estate Planning", "Probate"],
    description: "Builds estate plans, trusts, and probate strategies for families and business owners.",
    hourlyRate: 205,
    rating: 4.7,
    yearsExperience: 9,
    location: "Nashville, TN",
    jobTitle: "Partner",
    firmName: "Foster Trusts",
    licenseNumber: "TN-EST-5520",
    licensingBody: "Tennessee Bar",
    licenseJurisdiction: "TN",
    pricingModel: "Fixed",
    pricingDetails: "Fixed planning packages",
    offersRemote: true,
    acceptsNewClients: true,
  },
];

function splitLocation(location: string) {
  const [cityPart, statePart] = location.split(",").map((part) => part.trim());
  return {
    city: cityPart || null,
    state: statePart || null,
  };
}

async function upsertAdmins() {
  for (const admin of adminSeed) {
    await prisma.account.upsert({
      where: { email: admin.email },
      update: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        passwordHash: admin.passwordHash,
        isSuspended: false,
      },
      create: {
        email: admin.email,
        passwordHash: admin.passwordHash,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
      select: { id: true },
    });
  }
}

async function upsertProfessionals() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  for (const professional of professionals) {
    const { city, state } = splitLocation(professional.location);
    const account = await prisma.account.upsert({
      where: { email: professional.email },
      update: {
        firstName: professional.firstName,
        lastName: professional.lastName,
        jobTitle: professional.jobTitle,
        profilePhotoUrl: null,
        phone: professional.phone,
        locationCity: city,
        locationState: state,
        passwordHash,
        role: "PROFESSIONAL",
      },
      create: {
        email: professional.email,
        passwordHash,
        role: "PROFESSIONAL",
        firstName: professional.firstName,
        lastName: professional.lastName,
        jobTitle: professional.jobTitle,
        locationCity: city,
        locationState: state,
        phone: professional.phone,
      },
    });

    await prisma.professionalProfile.upsert({
      where: { accountId: account.id },
      update: {
        profession: professional.profession,
        specializations: professional.specializations,
        hourlyRate: professional.hourlyRate,
        minRate: professional.minRate ?? professional.hourlyRate,
        maxRate: professional.maxRate ?? professional.hourlyRate,
        rating: professional.rating,
        yearsExperience: professional.yearsExperience,
        totalExperienceYears: professional.totalExperienceYears ?? professional.yearsExperience,
        location: professional.location,
        description: professional.description,
        acceptsNewClients: professional.acceptsNewClients ?? true,
        offersInPerson: professional.offersInPerson ?? true,
        offersRemote: professional.offersRemote ?? true,
        pricingModel: professional.pricingModel ?? "Hourly",
        pricingDetails: professional.pricingDetails ?? "",
        firmName: professional.firmName ?? null,
        firmWebsite: professional.firmWebsite ?? null,
        firmAddress: professional.firmAddress ?? null,
        licenseNumber: professional.licenseNumber ?? null,
        licensingBody: professional.licensingBody ?? null,
        licenseJurisdiction: professional.licenseJurisdiction ?? null,
        verified: professional.verified ?? false,
        yearsAtCurrentFirm: professional.yearsAtCurrentFirm ?? null,
      },
      create: {
        accountId: account.id,
        profession: professional.profession,
        specializations: professional.specializations,
        hourlyRate: professional.hourlyRate,
        yearsExperience: professional.yearsExperience,
        location: professional.location,
        rating: professional.rating,
        description: professional.description,
        minRate: professional.minRate ?? professional.hourlyRate,
        maxRate: professional.maxRate ?? professional.hourlyRate,
        acceptsNewClients: professional.acceptsNewClients ?? true,
        offersInPerson: professional.offersInPerson ?? true,
        offersRemote: professional.offersRemote ?? true,
        pricingModel: professional.pricingModel ?? "Hourly",
        pricingDetails: professional.pricingDetails ?? "",
        firmName: professional.firmName ?? null,
        firmWebsite: professional.firmWebsite ?? null,
        firmAddress: professional.firmAddress ?? null,
        licenseNumber: professional.licenseNumber ?? null,
        licensingBody: professional.licensingBody ?? null,
        licenseJurisdiction: professional.licenseJurisdiction ?? null,
        verified: professional.verified ?? false,
        yearsAtCurrentFirm: professional.yearsAtCurrentFirm ?? null,
        totalExperienceYears: professional.totalExperienceYears ?? professional.yearsExperience,
      },
    });
  }
}

async function main() {
  await upsertAdmins();
  await upsertProfessionals();
  console.log("Seed complete. Admin login: owner@firstline-demo.com / AdminPassword123! and professionals use Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

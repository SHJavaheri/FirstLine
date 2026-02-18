import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lawyers = [
  {
    name: "Ava Martinez",
    specialization: "Corporate Law",
    hourlyRate: 320,
    location: "New York, NY",
    rating: 4.9,
    yearsExperience: 14,
    description:
      "Advises scaling startups and mid-market companies on venture financing, M&A, and governance.",
    email: "ava.martinez@firstline-demo.com",
    phone: "+1 (212) 555-0180",
  },
  {
    name: "Noah Carter",
    specialization: "Immigration Law",
    hourlyRate: 210,
    location: "Los Angeles, CA",
    rating: 4.8,
    yearsExperience: 11,
    description:
      "Represents professionals and families in employment-based visas, green cards, and naturalization.",
    email: "noah.carter@firstline-demo.com",
    phone: "+1 (310) 555-0142",
  },
  {
    name: "Sophia Kim",
    specialization: "Family Law",
    hourlyRate: 240,
    location: "Chicago, IL",
    rating: 4.7,
    yearsExperience: 10,
    description:
      "Handles high-conflict custody, divorce mediation, and post-judgment modifications with empathy and rigor.",
    email: "sophia.kim@firstline-demo.com",
    phone: "+1 (773) 555-0197",
  },
  {
    name: "Liam Johnson",
    specialization: "Criminal Defense",
    hourlyRate: 295,
    location: "Houston, TX",
    rating: 4.8,
    yearsExperience: 13,
    description:
      "Focuses on felony defense, pre-trial negotiations, and jury trial strategy in state and federal courts.",
    email: "liam.johnson@firstline-demo.com",
    phone: "+1 (713) 555-0134",
  },
  {
    name: "Emma Patel",
    specialization: "Employment Law",
    hourlyRate: 260,
    location: "San Francisco, CA",
    rating: 4.9,
    yearsExperience: 12,
    description:
      "Counsels executives and employers on discrimination claims, contracts, and workplace investigations.",
    email: "emma.patel@firstline-demo.com",
    phone: "+1 (415) 555-0122",
  },
  {
    name: "James Robinson",
    specialization: "Real Estate Law",
    hourlyRate: 230,
    location: "Miami, FL",
    rating: 4.6,
    yearsExperience: 9,
    description:
      "Supports commercial and residential transactions, title issues, leasing, and zoning compliance.",
    email: "james.robinson@firstline-demo.com",
    phone: "+1 (305) 555-0176",
  },
  {
    name: "Olivia Nguyen",
    specialization: "Intellectual Property",
    hourlyRate: 340,
    location: "Seattle, WA",
    rating: 4.9,
    yearsExperience: 15,
    description:
      "Protects software, design, and media assets through trademark, copyright, and licensing strategy.",
    email: "olivia.nguyen@firstline-demo.com",
    phone: "+1 (206) 555-0168",
  },
  {
    name: "William Davis",
    specialization: "Tax Law",
    hourlyRate: 360,
    location: "Boston, MA",
    rating: 4.8,
    yearsExperience: 16,
    description:
      "Guides founders and high-net-worth clients through complex tax planning and audit defense.",
    email: "william.davis@firstline-demo.com",
    phone: "+1 (617) 555-0157",
  },
  {
    name: "Isabella Brooks",
    specialization: "Personal Injury",
    hourlyRate: 220,
    location: "Phoenix, AZ",
    rating: 4.7,
    yearsExperience: 8,
    description:
      "Represents injury victims in negotiation and litigation, with a strong record on settlements.",
    email: "isabella.brooks@firstline-demo.com",
    phone: "+1 (602) 555-0114",
  },
  {
    name: "Benjamin Clark",
    specialization: "Bankruptcy Law",
    hourlyRate: 245,
    location: "Denver, CO",
    rating: 4.6,
    yearsExperience: 10,
    description:
      "Advises individuals and small businesses on Chapter 7/11/13 filings and creditor negotiations.",
    email: "benjamin.clark@firstline-demo.com",
    phone: "+1 (720) 555-0185",
  },
  {
    name: "Mia Sanders",
    specialization: "Civil Litigation",
    hourlyRate: 300,
    location: "Atlanta, GA",
    rating: 4.8,
    yearsExperience: 12,
    description:
      "Leads commercial dispute resolution from early case assessment through trial and appeal.",
    email: "mia.sanders@firstline-demo.com",
    phone: "+1 (404) 555-0105",
  },
  {
    name: "Ethan Foster",
    specialization: "Estate Planning",
    hourlyRate: 205,
    location: "Nashville, TN",
    rating: 4.7,
    yearsExperience: 9,
    description:
      "Builds estate plans, trusts, and probate strategies for families and business owners.",
    email: "ethan.foster@firstline-demo.com",
    phone: "+1 (615) 555-0190",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const owner = await prisma.user.upsert({
    where: { email: "owner@firstline-demo.com" },
    update: {},
    create: {
      email: "owner@firstline-demo.com",
      name: "FirstLine Admin",
      passwordHash,
    },
  });

  await prisma.lawyer.deleteMany();

  await prisma.lawyer.createMany({
    data: lawyers.map((lawyer) => ({
      ...lawyer,
      userId: owner.id,
    })),
  });

  console.log("Seed complete. Demo login: owner@firstline-demo.com / Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

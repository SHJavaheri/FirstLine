"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Scale,
  Calculator,
  Home as HomeIcon,
  Heart,
  Briefcase,
  TrendingUp,
  Search,
  Filter,
  Star,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                Discover trusted professionals for every need
              </p>
              <h1 className="text-5xl leading-tight text-slate-900 dark:text-slate-50 md:text-6xl lg:text-7xl">
                Find the right professional for real life.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                FirstLine connects you with verified professionals across law, finance, real estate, therapy, consulting, and more. Compare expertise, pricing, and reviews to make confident decisions.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-xl hover:shadow-cyan-500/40 dark:shadow-cyan-500/20 dark:hover:shadow-cyan-500/30"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button
                onClick={() => scrollToSection("features")}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:hover:bg-slate-700/50"
              >
                See How It Works
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/50">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Search by profession</p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Find a professional...</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-cyan-500">
                  <Scale className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Lawyers</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Legal experts</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-blue-500">
                  <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Accountants</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Financial pros</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-indigo-500">
                  <HomeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Real Estate</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Property agents</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-cyan-500">
                  <Heart className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Therapists</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Mental health</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 dark:border-slate-700 dark:from-cyan-950/30 dark:to-blue-950/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Verified profiles</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Trusted by thousands</p>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-20 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-8 backdrop-blur-sm transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mb-4 inline-flex rounded-xl bg-cyan-100 p-3 dark:bg-cyan-950/50">
                <ShieldCheck className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">Trust</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Verified professionals with transparent credentials, ratings, and client feedback you can rely on.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-8 backdrop-blur-sm transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 dark:bg-blue-950/50">
                <Filter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">Comparison</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Side-by-side insights on specialties, rates, availability, and reviews to find your perfect match.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-8 backdrop-blur-sm transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mb-4 inline-flex rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950/50">
                <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">Clarity</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Clear profiles with upfront pricing, availability, and detailed service descriptions. No surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-16 py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-50 md:text-5xl">
              Everything you need to find the right fit
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Powerful search and filtering tools to discover professionals who match your specific needs and preferences.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="inline-flex rounded-xl bg-cyan-100 p-3 dark:bg-cyan-950/50">
                <Search className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Search by Profession</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Browse across multiple professional categories including law, accounting, real estate, therapy, consulting, and financial advising.
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex rounded-xl bg-blue-100 p-3 dark:bg-blue-950/50">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Filter by Specialty</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Narrow down results by specific expertise areas, certifications, and areas of practice to find exact matches.
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950/50">
                <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Location-Based</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Find professionals near you or search by city, state, or region for in-person or remote services.
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex rounded-xl bg-cyan-100 p-3 dark:bg-cyan-950/50">
                <DollarSign className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Transparent Pricing</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Compare hourly rates, flat fees, and service packages. Filter by your budget to find affordable options.
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex rounded-xl bg-blue-100 p-3 dark:bg-blue-950/50">
                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Ratings & Reviews</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Read authentic client reviews and ratings to understand professional quality and service experience.
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950/50">
                <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Availability</h3>
              <p className="text-slate-600 dark:text-slate-400">
                View real-time availability and booking options to connect with professionals when you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Preview Section */}
      <section id="professionals" className="scroll-mt-16 border-t border-slate-200 bg-slate-50/50 py-24 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-50 md:text-5xl">
              Professionals across every field
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              From legal counsel to financial planning, discover trusted experts ready to help with your most important decisions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm transition hover:border-cyan-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-cyan-500">
              <Scale className="mb-4 h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Lawyers</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Find the right legal help with confidence and clarity
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm transition hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500">
              <Calculator className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Accountants</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Connect with experts who bring order to the numbers
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm transition hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-500">
              <HomeIcon className="mb-4 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Real Estate Agents</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Discover trusted guidance for buying, selling, and renting
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm transition hover:border-cyan-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-cyan-500">
              <Heart className="mb-4 h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Therapists</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Explore support from professionals who fit your needs
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm transition hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500">
              <Briefcase className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Consultants</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Reach specialists who can move your next decision forward
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm transition hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-500">
              <TrendingUp className="mb-4 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Financial Advisors</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Compare professionals who help plan with purpose
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create an account to access the full discovery experience with advanced search and filtering
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-slate-200 py-24 dark:border-slate-800">
        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50 md:text-5xl">
                Ready to find your perfect professional?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Join FirstLine today and gain access to our complete platform. Search, compare, and connect with verified professionals who can help you succeed.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-xl hover:shadow-cyan-500/40 dark:shadow-cyan-500/20 dark:hover:shadow-cyan-500/30"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:hover:bg-slate-700/50"
              >
                Sign In
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Trusted by thousands • Verified professionals • Transparent pricing
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Stars } from "lucide-react";

export default function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
            <Sparkles className="h-4 w-4 text-teal-700" />
            Trusted legal discovery for modern teams
          </p>
          <h1 className="text-4xl leading-tight text-slate-900 md:text-6xl">
            Find the right lawyer for your case in minutes.
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            FirstLine helps individuals and businesses discover top-rated legal professionals by
            specialization, location, hourly rate, and proven client outcomes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lawyers"
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Explore Lawyers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.8)]">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Average response time</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">2.4 hours</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <ShieldCheck className="h-5 w-5 text-teal-700" />
              <p className="mt-2 text-sm font-semibold text-slate-900">Verified professionals</p>
              <p className="text-sm text-slate-600">Profiles validated for credibility and outcomes.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <Stars className="h-5 w-5 text-amber-500" />
              <p className="mt-2 text-sm font-semibold text-slate-900">4.8 platform rating</p>
              <p className="text-sm text-slate-600">Quality benchmark from thousands of sessions.</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Built for legal certainty from first call to final outcome.
          </p>
        </div>
      </div>
    </section>
  );
}

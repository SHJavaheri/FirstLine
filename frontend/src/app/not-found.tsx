import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-5xl text-slate-900">Not found</h1>
        <p className="mt-3 text-slate-600">The page or lawyer profile you requested does not exist.</p>
        <Link
          href="/lawyers"
          className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Return to Lawyers
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-100">Page not found</h1>
      <p className="mt-1 text-neutral-500">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
        Back to Dashboard
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-3xl font-bold mb-4">Page not found</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-white"
      >
        Go to profile
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="font-mono text-3xl font-bold mb-4">Page not found</h1>
      <p className="text-lg text-muted-foreground mb-6">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-accent px-4 py-2 font-medium text-accent-foreground no-underline transition-opacity hover:opacity-90"
      >
        Go to profile
      </Link>
    </div>
  );
}

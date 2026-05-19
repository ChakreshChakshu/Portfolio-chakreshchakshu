import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-6xl font-heading font-bold text-foreground">404</h2>
      <p className="text-foreground/70 text-lg">Page not found</p>
      <Link
        href="/"
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        Go home
      </Link>
    </div>
  );
}

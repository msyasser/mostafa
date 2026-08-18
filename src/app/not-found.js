import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-black text-white flex min-h-screen items-center justify-center font-sans">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-neutral-400 mb-6">Page Not Found</p>
          <Link
            href="/en"
            className="inline-block px-6 py-3 rounded-full bg-yellow-500 text-black font-semibold text-sm hover:bg-yellow-400 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </body>
    </html>
  );
}

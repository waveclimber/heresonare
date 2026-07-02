import Link from "next/link";

export default function Footer({ content, language }: any) {
  const navLinks = [
    { href: "/tour", label: "TOUR" },
    { href: "/artists", label: "ARTISTS" },
    { href: "/productions", label: "PRODUCTIONS" },
    { href: "/music", label: "MUSIC" },
    { href: "/video", label: "VIDEO" },
    { href: "/venues", label: "VENUES" },
    { href: "/store", label: "STORE" },
    { href: "/about", label: "ABOUT" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-6 py-20">
      <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[var(--brand-blue)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">

          <h2 className="bg-gradient-to-r from-[var(--brand-pink)] via-white to-[var(--brand-blue)] bg-clip-text text-4xl font-bold text-transparent">
            héReSonare
          </h2>

          <p className="mt-4 text-sm tracking-[0.3em] text-gray-500">
            {content[language].footerSlogan}
          </p>

          <div className="mt-12 h-px w-32 bg-white/10" />

          <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-[0.15em] text-gray-400 transition-all duration-300 hover:text-[var(--brand-blue)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href="mailto:contact@heresonare.com"
            className="mt-14 text-gray-400 transition-all duration-300 hover:text-[var(--brand-blue)]"
          >
            contact@heresonare.com
          </a>

          <p className="mt-10 text-sm text-gray-600">
            {content[language].footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

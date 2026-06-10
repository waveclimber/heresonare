export default function Footer({ content, language }: any) {
  const navLinks = [
    { href: "#products", label: content[language].navProducts },
    { href: "#about", label: content[language].navAbout },
    { href: "#contact", label: content[language].navContact },
  ];

  return (
    <footer className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="bg-gradient-to-r from-[var(--brand-pink)] via-white to-[var(--brand-blue)] bg-clip-text text-2xl font-semibold tracking-[0.05em] text-transparent">
          héReSonare
        </div>

        <p className="mt-4 text-sm tracking-[0.2em] text-gray-500">
          {content[language].footerSlogan}
        </p>

        <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 transition-all duration-300 hover:text-[var(--brand-blue)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="mt-14 text-sm text-gray-500">
          {content[language].footerCopyright}
        </p>
      </div>
    </footer>
  );
}

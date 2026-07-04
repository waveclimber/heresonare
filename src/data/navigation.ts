export type NavigationItem = {
  href: string;
  label: string;
};

export const navigationItems = [
  { href: "/tour", label: "TOUR" },
  { href: "/artists", label: "ARTISTS" },
  { href: "/productions", label: "PRODUCTIONS" },
  { href: "/music", label: "MUSIC" },
  { href: "/video", label: "VIDEO" },
  { href: "/venues", label: "VENUES" },
  { href: "/store", label: "STORE" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
] satisfies NavigationItem[];

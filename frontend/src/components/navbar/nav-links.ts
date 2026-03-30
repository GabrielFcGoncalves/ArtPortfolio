export interface NavLink {
  label: string;
  href: string;
  isMain?: boolean;
}

export const AUTH_NAV_LINKS: NavLink[] = [
  { label: "Explore", href: "/explore" },
  { label: "Studio", href: "/dashboard" },
];

export const LANDING_NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Showcase", href: "#" },
];

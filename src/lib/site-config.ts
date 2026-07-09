export const siteConfig = {
  name: "Bookuncleses",
  tagline: "Every Moment, Beautifully Booked.",
  description:
    "Photography, video & content creation, event hosting, venue planning, stand-up comedy, and brand promotion — browse the portfolio, check pricing, and book directly.",
  whatsappNumber: "2340000000000",
  email: "hello@bookuncleses.com",
  phone: "+234 000 000 0000",
  address: "Abuja, Nigeria",
  instagram: "https://instagram.com/bookuncleses",
  tiktok: "https://tiktok.com/@bookuncleses",
};

// Flat deposit required to hold a date, regardless of package — simplest
// model until the business owner wants tiered deposits per package price.
export const bookingDepositNaira = 20000;

export const bookingServiceOptions = [
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Video Coverage & Content Creation" },
  { value: "event_hosting", label: "Event Hosting" },
  { value: "stand_up_comedy", label: "Stand-up Comedy" },
  { value: "hype_man", label: "Hype Man" },
  { value: "event_planning", label: "Event Planning" },
  { value: "full_package", label: "Full Package" },
] as const;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Photos & Videos", href: "/photos" },
  { label: "Bookings", href: "/bookings" },
  { label: "Tickets", href: "/tickets" },
  { label: "Rate Card", href: "/rate-card" },
  { label: "Contact", href: "/contact" },
] as const;

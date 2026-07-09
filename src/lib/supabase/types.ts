export type BookingServiceType =
  | "photography"
  | "videography"
  | "event_hosting"
  | "event_planning"
  | "stand_up_comedy"
  | "hype_man"
  | "full_package";
export type BookingStatus = "pending" | "deposit_paid" | "confirmed" | "cancelled";
export type PaymentProvider = "paystack" | "flutterwave";
export type EventStatus = "draft" | "published";
export type OrderStatus = "pending" | "paid" | "cancelled";
export type GalleryCategory = "weddings" | "corporate" | "portraits" | "hosted_events";
export type GalleryMediaType = "image" | "video_embed";
export type RateCardCategory =
  | "photography"
  | "videography"
  | "event_hosting"
  | "event_planning"
  | "stand_up_comedy"
  | "hype_man";
export type ServiceKind = "bookable" | "quote" | "teaser";
export type ServiceCategory = "entertainment" | "creative" | "event";
export type ServiceIconKey =
  | "microphone"
  | "spotlight"
  | "bolt"
  | "star"
  | "ticket"
  | "camera"
  | "video"
  | "megaphone"
  | "calendar";

export interface Booking {
  id: string;
  service_type: BookingServiceType;
  event_date: string;
  location: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  budget_range: string | null;
  notes: string | null;
  status: BookingStatus;
  deposit_amount: number | null;
  payment_reference: string | null;
  payment_provider: PaymentProvider | null;
  created_at: string;
}

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  venue: string;
  event_date: string;
  cover_image_url: string | null;
  status: EventStatus;
  created_at: string;
}

export interface TicketTier {
  id: string;
  event_id: string;
  name: string;
  price: number;
  quantity_available: number;
  quantity_sold: number;
  sort_order: number;
}

export interface TicketOrder {
  id: string;
  event_id: string;
  tier_id: string;
  buyer_name: string;
  buyer_email: string;
  quantity: number;
  amount: number;
  payment_reference: string | null;
  payment_provider: PaymentProvider | null;
  status: OrderStatus;
  created_at: string;
}

export interface Ticket {
  id: string;
  order_id: string;
  qr_code_token: string;
  checked_in_at: string | null;
}

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  media_type: GalleryMediaType;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface RateCardItem {
  id: string;
  category: RateCardCategory;
  package_name: string;
  description: string;
  duration: string;
  price: number | null;
  sort_order: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number | null;
  sort_order: number;
}

export interface Service {
  id: string;
  kind: ServiceKind;
  category: ServiceCategory;
  icon: ServiceIconKey;
  title: string;
  description: string;
  badge: string | null;
  cta_label: string;
  cta_href: string;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  event_type: string | null;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

// Note: we deliberately don't pass these types as a generic to the Supabase
// client (PostgrestClient's generic constraints fight a hand-written schema
// like this). Instead each src/lib/data/* helper casts `.data` to the
// relevant interface above at the call site.

export interface Mosque {
  id: string;
  name: string;
  arabicName?: string;
  location: string;
  country: string;
  /** Street address for maps/display when known (optional) */
  address?: string;
  /** Lat/lng for map links (Google Maps, Apple Maps) */
  coordinates?: { lat: number; lng: number };
  capacity: number;
  established: string;
  area: number;
  annualVisitors: string;
  facilities: string[];
  significance: string;
  description: string;
  imageUrl: string;
  /** Optional local image path (e.g. /images/mosques/id.jpg). When set, used first with imageUrl as fallback on error. */
  imageLocal?: string;
  /** Optional extra image URLs for gallery (main image is imageUrl). */
  galleryUrls?: string[];
  isHolySite: boolean;
  architecturalStyle?: string;
  /** Extended architecture notes */
  architectureNotes?: string;
  /** Historical context and timeline */
  history?: string;
  /** Visitor tips, best times, dress code, etc. */
  tourismNotes?: string;
  /** Official mosque or government tourism site */
  officialWebsite?: string;
  womenPrayerArea: boolean;
  touristFriendly: boolean;
  /** Predominant tradition when clearly associated (fact-checked). Omitted if mixed or unspecified. */
  denomination?: "sunni" | "shia";
  /** Data sources and references for this mosque entry (Wikipedia, official sites, etc.) */
  sources?: string[];
}

export interface TimelineEvent {
  year: string;
  mosque: string;
  mosqueId: string;
  event: string;
}

export interface MosquesData {
  mosques: Mosque[];
  timelineEvents: TimelineEvent[];
}

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
  /** Construction cost in USD (if known) */
  constructionCost?: string;
  /** Year construction started (for under-construction mosques) */
  constructionStarted?: string;
  /** Expected completion year (for under-construction mosques) */
  completionExpected?: string;
  /** Status: completed, under-construction, planned */
  status?: "completed" | "under-construction" | "planned";
  /** YouTube video ID for mosque tour/documentary (e.g., "dQw4w9WgXcQ" from youtube.com/watch?v=dQw4w9WgXcQ) */
  youtubeVideoId?: string;
}

export interface TimelineEvent {
  year: string;
  mosque: string;
  mosqueId: string;
  event: string;
  /** Optional: source URL for fact-checking this event */
  source?: string;
  /** If true, this is an Islamic history context event (not a mosque) */
  isContextEvent?: boolean;
  /** Optional category for context events: era, migration, expansion, etc. */
  category?: "era" | "migration" | "expansion" | "caliphate" | "architecture" | "education";
}

export interface MosquesData {
  mosques: Mosque[];
  timelineEvents: TimelineEvent[];
}

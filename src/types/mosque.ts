export interface Mosque {
  id: string;
  name: string;
  arabicName?: string;
  location: string;
  country: string;
  capacity: number;
  established: string;
  area: number;
  annualVisitors: string;
  facilities: string[];
  significance: string;
  description: string;
  imageUrl: string;
  isHolySite: boolean;
  architecturalStyle?: string;
  womenPrayerArea: boolean;
  touristFriendly: boolean;
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

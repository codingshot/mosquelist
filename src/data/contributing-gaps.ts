/**
 * Data for the Contributing page: countries/cities without mosques and expansion targets.
 * Sourced from docs/missing-countries-and-mosques.md.
 */

export interface GapCountry {
  name: string;
  region?: string;
  note?: string;
}

export interface GapCity {
  city: string;
  country: string;
  note?: string;
}

/** Countries that do not yet have any mosque in the app (high priority to add). */
export const countriesWithoutMosques: GapCountry[] = [
  { name: "Libya", region: "Africa", note: "Tripoli, Benghazi — historic and national mosques" },
  { name: "Somalia", region: "Africa", note: "Mogadishu — Mosque of Islamic Solidarity, Fakr ad-Din" },
  { name: "Mauritania", region: "Africa", note: "Nouakchott — Saudi Mosque, Chinguetti historic" },
  { name: "Chad", region: "Africa", note: "N'Djamena Grand Mosque" },
  { name: "Sierra Leone", region: "Africa", note: "Freetown — central mosque" },
  { name: "Tanzania", region: "Africa", note: "Dar es Salaam — Mohammed VI Mosque, Zanzibar" },
  { name: "Mozambique", region: "Africa", note: "Maputo, Ilha de Moçambique (UNESCO)" },
  { name: "Eritrea", region: "Africa", note: "Asmara — Grand Mosque" },
  { name: "Ivory Coast", region: "Africa", note: "Abidjan — Grand Mosque of Cocody" },
  { name: "Cameroon", region: "Africa", note: "Yaoundé, Garoua — central mosques" },
  { name: "Thailand", region: "Asia", note: "Bangkok, Pattani — Krue Se Mosque, central mosques" },
  { name: "Myanmar", region: "Asia", note: "Yangon — Sule Mosque, Jama Mosque" },
  { name: "Montenegro", region: "Europe", note: "Pljevlja — Husein-paša's Mosque" },
  { name: "Comoros", region: "Indian Ocean", note: "Moroni — Grande Mosquée" },
  { name: "Gabon", region: "Africa", note: "Libreville — Omar Bongo Mosque" },
];

/** Cities or regions that already have some mosques but could have more (expansion targets). */
export const citiesNeedingMoreMosques: GapCity[] = [
  { city: "Lahore / Punjab", country: "Pakistan", note: "Faisalabad, Multan, Rawalpindi" },
  { city: "Karachi / Sindh", country: "Pakistan", note: "Hyderabad, Sukkur" },
  { city: "Lucknow / Uttar Pradesh", country: "India", note: "Allahabad, Varanasi area" },
  { city: "Kolkata", country: "India", note: "Nakhoda Mosque, large city mosques" },
  { city: "Mumbai", country: "India", note: "Historic or large mosques" },
  { city: "Ahmedabad / Gujarat", country: "India", note: "Surat, historic sites" },
  { city: "Medan / Sumatra", country: "Indonesia", note: "Palembang, Banda Aceh" },
  { city: "Makassar", country: "Indonesia", note: "Sulawesi city-center" },
  { city: "Kano", country: "Nigeria", note: "Great Mosque of Kano" },
  { city: "Lagos", country: "Nigeria", note: "Central or historic mosque" },
  { city: "Alexandria", country: "Egypt", note: "Abu al-Abbas al-Mursi, historic" },
  { city: "Riyadh", country: "Saudi Arabia", note: "King Fahd, large Riyadh mosques" },
  { city: "Jeddah", country: "Saudi Arabia", note: "Floating mosque, King Saud Mosque" },
  { city: "Isfahan", country: "Iran", note: "Shah Mosque / Imam Mosque (Naqsh-e Jahan)" },
  { city: "Shiraz", country: "Iran", note: "Nasir al-Mulk, Vakil Mosque" },
  { city: "Samarkand", country: "Uzbekistan", note: "Bibi-Khanym, Shah-i-Zinda" },
  { city: "Chittagong", country: "Bangladesh", note: "Anderkilla Shahi Jame" },
  { city: "Penang", country: "Malaysia", note: "Kapitan Keling, state mosque" },
  { city: "Konya / Anatolia", country: "Turkey", note: "Kayseri, Sivas, Erzurum — Seljuk/Ottoman" },
  { city: "Izmir / Antalya", country: "Turkey", note: "Aegean/Mediterranean large or historic" },
];

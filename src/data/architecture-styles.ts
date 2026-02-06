/**
 * Short descriptions for mosque architectural styles.
 * Full reference: docs/architecture-patterns.md
 */
export const ARCHITECTURE_STYLE_DESCRIPTIONS: Record<string, string> = {
  Ottoman: "Central dome, pencil minarets; Turkey, Balkans, Levant.",
  Mughal: "Bulbous domes, red sandstone & marble; Indian subcontinent.",
  Umayyad: "Early Islamic; hypostyle, courtyard; Syria, 7th–8th c.",
  Persian: "Iwans, blue tile, muqarnas; Iran, Central Asia.",
  "Persian-Timurid": "Large scale, tile mosaic; Samarkand, Herat, Bukhara.",
  Fatimid: "Stucco, keel arches; North Africa, Egypt, 10th–12th c.",
  Mamluk: "Stone, ablaq, muqarnas; Egypt, Syria, 13th–16th c.",
  Moorish: "Horseshoe arches, zellige; North Africa, Andalusia.",
  "Sudano-Sahelian": "Mud/adobe, wooden toron; West Africa.",
  "Modern Islamic": "Contemporary materials, simplified domes & minarets.",
  Malay: "Tiered roofs; Malaysia, Indonesia, Brunei.",
  Byzantine: "Pendentive domes, masonry; e.g. Hagia Sophia (537 CE).",
  Islamic: "Generic when no specific regional style applies.",
};

export function getArchitectureStyleDescription(style: string): string | undefined {
  return ARCHITECTURE_STYLE_DESCRIPTIONS[style];
}

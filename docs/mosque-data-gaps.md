# Mosque Data Gaps & Missing Information

Last updated: 2026-02-08

**Status: 95+ mosques in database. 14 new mosques added from previously missing countries. Sources now tracked in JSON.**

---

## Summary

| Field | Total Mosques | With Data | Missing |
|-------|---------------|-----------|---------|
| Image URL | 95+ | 95+ | 0 |
| Local Images | 95+ | 15 | ~80 |
| Official Website | 95+ | ~20 | ~75 |
| Address | 95+ | ~40 | ~55 |
| History | 95+ | ~55 | ~40 |
| Tourism Notes | 95+ | ~50 | ~45 |
| Architecture Notes | 95+ | ~55 | ~40 |
| Sources | 95+ | 14 (new) | ~80 |

---

## New Countries Added (2026-02-08)

| Country | Mosque | ID | Sources |
|---------|--------|-----|---------|
| **Kyrgyzstan** | Bishkek Central Mosque | `bishkek-central-mosque` | Wikipedia, Mosqpedia |
| **Kyrgyzstan** | Dungan Mosque | `dungan-mosque-karakol` | Wikipedia, VisitKarakol |
| **Tajikistan** | Imam Abu Hanifa Mosque | `imam-abu-hanifa-mosque-dushanbe` | Wikipedia, Mosqpedia, GlobalVoices |
| **Somalia** | Mosque of Islamic Solidarity | `mosque-of-islamic-solidarity` | Wikipedia |
| **Chad** | N'Djamena Grand Mosque | `ndjamena-grand-mosque` | Wikipedia |
| **Libya** | Al-Naqah Mosque | `al-naqah-mosque-tripoli` | Wikipedia, Nabataea.net |
| **Libya** | Gurgi Mosque | `gurgi-mosque-tripoli` | Wikipedia |
| **Sierra Leone** | Freetown Central Mosque | `freetown-central-mosque` | Wikipedia |
| **Tanzania** | Mohammed VI Mosque | `mohammed-vi-mosque-dar-es-salaam` | Wikipedia |
| **Eritrea** | Great Mosque of Asmara | `great-mosque-of-asmara` | Wikipedia |
| **Thailand** | Krue Se Mosque | `krue-se-mosque-pattani` | Wikipedia |
| **Montenegro** | Husein-paša's Mosque | `husein-pasha-mosque-pljevlja` | Wikipedia |
| **Comoros** | Badjanani Mosque | `badjanani-mosque-moroni` | Wikipedia |
| **Tunisia** | Great Mosque of Kairouan | `great-mosque-of-kairouan` | Wikipedia, UNESCO |

---

## Countries Still Missing

Priority countries not yet in database:

| Region | Countries | Priority |
|--------|-----------|----------|
| Africa | Mauritania, Cameroon, Ivory Coast, Mozambique | High |
| Asia | Myanmar | Medium |
| Indian Ocean | Gabon | Low |

---

## Fixed in Previous Update (2026-02-08)

### Special:FilePath URLs Converted to Direct Upload URLs

| Mosque | ID | Status |
|--------|-----|--------|
| Jamia Masjid Srinagar | `jamia-masjid-srinagar` | ✅ Fixed |
| Pride of Muslims Mosque | `pride-of-muslims-mosque-shali` | ✅ Fixed |
| At-Tin Mosque | `at-tin-mosque` | ✅ Fixed |
| Selahaddin Eyyubi Mosque | `selahaddin-eyyubi-mosque` | ✅ Fixed |
| Id Kah Mosque | `id-kah-mosque` | ✅ Fixed |
| Shah Jahan Mosque Thatta | `shah-jahan-mosque-thatta` | ✅ Fixed |
| Raja Hamidah Mosque Batam | `raja-hamidah-great-mosque-of-batam` | ✅ Fixed |
| Emir Abdelkader Mosque | `emir-abdelkader-mosque` | ✅ Fixed |
| Kocatepe Mosque | `kocatepe-mosque` | ✅ Fixed |
| Grand Mosque of Sabilal Muhtadin | `grand-mosque-of-sabilal-muhtadin` | ✅ Fixed |
| Et'hem Bey Mosque | `ethem-bey-mosque` | ✅ Fixed |
| Tuanku Mizan Zainal Abidin Mosque | `tuanku-mizan-zainal-abidin-mosque` | ✅ Fixed |

---

## Official Websites Verified

| Mosque | Website | Status |
|--------|---------|--------|
| Masjid al-Haram / Nabawi | https://www.gph.gov.sa | ✅ Saudi Presidency |
| Sheikh Zayed Grand Mosque | https://www.szgmc.gov.ae | ✅ Official |
| Hassan II Mosque | https://www.fmh2.ma | ✅ Foundation |
| Al-Azhar Mosque | https://www.azhar.eg | ✅ Official |
| Djamaa el Djazair | https://eldjamaa.dz | ✅ Official |
| Sultan Qaboos Grand Mosque | https://sultanqaboosgrandmosque.com | ✅ VR Tour |
| Great Mosque of Central Java | https://majt.or.id | ✅ Official |
| Islamic Center of Washington | https://www.islamiccenterdc.org | ✅ Official |
| Great Mosque of Kairouan | https://whc.unesco.org/en/list/499 | ✅ UNESCO |

---

## Mosques with Minimal Data (Enrichment Needed)

These mosques have only basic required fields:

1. **Al Jabbar Grand Mosque** - Needs history, tourism notes
2. **Jameh Mosque of Makki** - Needs history (largest Sunni mosque in Iran)
3. **Al-Akbar Mosque** - Needs history, official website
4. **Pride of Muslims Mosque** - Needs history, architecture details
5. **CMH Masjid Jhelum** - Needs capacity/area verification
6. **Jakarta Islamic Center** - Needs updated info, official website
7. **Aqsa Mosque Rabwah** - Needs history, Ahmadiyya community context
8. **Grand Mosque of Conakry** - Needs history, tourism info
9. **Id Kah Mosque** - Needs updated tourism notes (Xinjiang access)
10. **Al Saleh Mosque** - Needs tourism notes (conflict access)

---

## Data Schema

New `sources` field added to Mosque type:

```typescript
interface Mosque {
  // ... existing fields
  /** Data sources and references for this mosque entry */
  sources?: string[];
}
```

All new mosques now include sources for fact-checking. Existing mosques should have sources added when enriching data.

---

## Reference Documents

- **[mosque-image-reference.md](./mosque-image-reference.md)** - Complete image URL inventory for all mosques
- **[countries-and-mosques.md](./countries-and-mosques.md)** - Mosques by country
- **[missing-countries-and-mosques.md](./missing-countries-and-mosques.md)** - Countries without mosque representation

---

## How to Convert Special:FilePath URLs

1. Go to `https://commons.wikimedia.org/wiki/File:FILENAME`
2. Click "Original file" link
3. Copy the direct URL (format: `https://upload.wikimedia.org/wikipedia/commons/X/XX/Filename.jpg`)

Example:
- **Before**: `https://commons.wikimedia.org/wiki/Special:FilePath/Example.jpg`
- **After**: `https://upload.wikimedia.org/wikipedia/commons/a/ab/Example.jpg`

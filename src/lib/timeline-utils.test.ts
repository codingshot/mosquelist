import { describe, it, expect } from "vitest";
import { 
  parseEstablishmentYear, 
  formatYearDisplay, 
  formatEstablishmentRange,
  getEstablishmentYearRange,
  yearRangeOverlaps,
  validateMosqueDate,
  ISLAMIC_HISTORY_PERIODS 
} from "./timeline-utils";

describe("parseEstablishmentYear", () => {
  it("parses simple year strings", () => {
    expect(parseEstablishmentYear("638 CE")).toBe(638);
    expect(parseEstablishmentYear("2007")).toBe(2007);
    expect(parseEstablishmentYear("1993")).toBe(1993);
  });

  it("parses year ranges (takes first year)", () => {
    expect(parseEstablishmentYear("705–715 CE")).toBe(705);
    expect(parseEstablishmentYear("1573-1594")).toBe(1573);
  });

  it("parses century notation as start of range (sorts correctly)", () => {
    // 14th century = 1300-1399, 15th = 1400-1499 (start year for sort/timeline)
    expect(parseEstablishmentYear("14th century")).toBe(1300);
    expect(parseEstablishmentYear("15th century")).toBe(1400);
    expect(parseEstablishmentYear("16th century")).toBe(1500);
    expect(parseEstablishmentYear("19th century")).toBe(1800);
    expect(parseEstablishmentYear("7th century")).toBe(600);
    expect(parseEstablishmentYear("1st century")).toBe(0);
  });

  it("handles case insensitivity", () => {
    expect(parseEstablishmentYear("15TH CENTURY")).toBe(1400);
    expect(parseEstablishmentYear("15th Century")).toBe(1400);
  });

  it("returns 0 for unparseable strings", () => {
    expect(parseEstablishmentYear("")).toBe(0);
    expect(parseEstablishmentYear("unknown")).toBe(0);
    expect(parseEstablishmentYear("Under construction")).toBe(0);
  });

  it("parses composite strings (takes first year)", () => {
    expect(parseEstablishmentYear("1824 (current building 1932)")).toBe(1824);
    expect(parseEstablishmentYear("1950s")).toBe(1950);
  });
});

describe("formatYearDisplay", () => {
  it("adds CE to plain numbers", () => {
    expect(formatYearDisplay("638")).toBe("638 CE");
    expect(formatYearDisplay("2007")).toBe("2007 CE");
  });

  it("returns century as year range for display", () => {
    expect(formatYearDisplay("14th century")).toBe("1300-1399");
    expect(formatYearDisplay("15th century")).toBe("1400-1499");
    expect(formatYearDisplay("16th century")).toBe("1500-1599");
  });

  it("returns other strings as-is", () => {
    expect(formatYearDisplay("705–715 CE")).toBe("705–715 CE");
    expect(formatYearDisplay("c. 1500")).toBe("c. 1500");
  });
});

describe("formatEstablishmentRange", () => {
  it("formats century as year range", () => {
    expect(formatEstablishmentRange("14th century")).toBe("1300-1399");
    expect(formatEstablishmentRange("15th century")).toBe("1400-1499");
    expect(formatEstablishmentRange("7th century")).toBe("600-699");
  });

  it("returns non-century strings unchanged", () => {
    expect(formatEstablishmentRange("638 CE")).toBe("638 CE");
    expect(formatEstablishmentRange("705–715 CE")).toBe("705–715 CE");
  });
});

describe("getEstablishmentYearRange", () => {
  it("returns range for century", () => {
    expect(getEstablishmentYearRange("14th century")).toEqual({ start: 1300, end: 1399 });
    expect(getEstablishmentYearRange("15th century")).toEqual({ start: 1400, end: 1499 });
  });

  it("returns same start/end for exact year", () => {
    expect(getEstablishmentYearRange("638 CE")).toEqual({ start: 638, end: 638 });
  });
});

describe("yearRangeOverlaps", () => {
  it("matches century ranges against filter windows", () => {
    expect(yearRangeOverlaps("14th century", 1300, 1400)).toBe(true);
    expect(yearRangeOverlaps("14th century", 1350, 1400)).toBe(true);
    expect(yearRangeOverlaps("14th century", 1400, 1500)).toBe(false);
  });

  it("matches exact years", () => {
    expect(yearRangeOverlaps("638 CE", 600, 700)).toBe(true);
    expect(yearRangeOverlaps("638 CE", 700, 800)).toBe(false);
  });
});

describe("validateMosqueDate", () => {
  it("accepts valid mosque dates after 622 CE", () => {
    expect(validateMosqueDate("638 CE", "test-mosque").valid).toBe(true);
    expect(validateMosqueDate("1993", "test-mosque").valid).toBe(true);
    expect(validateMosqueDate("15th century", "test-mosque").valid).toBe(true);
  });

  it("rejects dates before Islam (610 CE)", () => {
    const result = validateMosqueDate("500 CE", "test-mosque");
    expect(result.valid).toBe(false);
    expect(result.warning).toContain("predates Islam");
  });

  it("allows Hagia Sophia as pre-Islamic exception", () => {
    const result = validateMosqueDate("537 CE", "hagia-sophia-istanbul");
    expect(result.valid).toBe(true);
  });

  it("rejects future dates", () => {
    const futureYear = new Date().getFullYear() + 10;
    const result = validateMosqueDate(`${futureYear}`, "test-mosque");
    expect(result.valid).toBe(false);
    expect(result.warning).toContain("in the future");
  });

  it("warns for dates between 610-622 CE", () => {
    const result = validateMosqueDate("615 CE", "test-mosque");
    expect(result.valid).toBe(true);
    expect(result.warning).toContain("before the Hijrah");
  });
});

describe("ISLAMIC_HISTORY_PERIODS", () => {
  it("contains key Islamic history milestones", () => {
    const labels = ISLAMIC_HISTORY_PERIODS.map(p => p.label);
    expect(labels).toContain("First Revelation");
    expect(labels).toContain("The Hijrah");
    expect(labels).toContain("Fall of Constantinople");
  });

  it("periods are in chronological order (or same year)", () => {
    for (let i = 1; i < ISLAMIC_HISTORY_PERIODS.length; i++) {
      expect(ISLAMIC_HISTORY_PERIODS[i].year).toBeGreaterThanOrEqual(ISLAMIC_HISTORY_PERIODS[i - 1].year);
    }
  });

  it("all periods have required fields", () => {
    ISLAMIC_HISTORY_PERIODS.forEach(period => {
      expect(period.year).toBeGreaterThan(0);
      expect(period.label).toBeTruthy();
      expect(period.description).toBeTruthy();
    });
  });
});

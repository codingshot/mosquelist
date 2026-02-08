import { describe, it, expect } from "vitest";
import { 
  parseEstablishmentYear, 
  formatYearDisplay, 
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

  it("parses century notation correctly", () => {
    // 15th century = 1401-1500, midpoint = 1450
    expect(parseEstablishmentYear("15th century")).toBe(1450);
    expect(parseEstablishmentYear("16th century")).toBe(1550);
    expect(parseEstablishmentYear("19th century")).toBe(1850);
    expect(parseEstablishmentYear("7th century")).toBe(650);
    expect(parseEstablishmentYear("1st century")).toBe(50);
  });

  it("handles case insensitivity", () => {
    expect(parseEstablishmentYear("15TH CENTURY")).toBe(1450);
    expect(parseEstablishmentYear("15th Century")).toBe(1450);
  });

  it("returns 0 for unparseable strings", () => {
    expect(parseEstablishmentYear("")).toBe(0);
    expect(parseEstablishmentYear("unknown")).toBe(0);
  });
});

describe("formatYearDisplay", () => {
  it("adds CE to plain numbers", () => {
    expect(formatYearDisplay("638")).toBe("638 CE");
    expect(formatYearDisplay("2007")).toBe("2007 CE");
  });

  it("returns century strings as-is", () => {
    expect(formatYearDisplay("15th century")).toBe("15th century");
    expect(formatYearDisplay("16th century")).toBe("16th century");
  });

  it("returns other strings as-is", () => {
    expect(formatYearDisplay("705–715 CE")).toBe("705–715 CE");
    expect(formatYearDisplay("c. 1500")).toBe("c. 1500");
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

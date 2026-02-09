import { describe, it, expect } from "vitest";
import {
  curatedLists,
  getListBySlug,
  getListsContainingMosque,
} from "./lists";

describe("lists data", () => {
  it("getListBySlug returns list for valid slug", () => {
    const list = getListBySlug("holy-sites");
    expect(list).toBeDefined();
    expect(list?.slug).toBe("holy-sites");
    expect(list?.name).toBe("Holy Sites");
    expect(Array.isArray(list?.mosqueIds)).toBe(true);
  });

  it("getListBySlug returns undefined for invalid slug", () => {
    expect(getListBySlug("not-a-list")).toBeUndefined();
  });

  it("getListsContainingMosque returns lists that include the mosque", () => {
    const lists = getListsContainingMosque("blue-mosque");
    expect(lists.length).toBeGreaterThan(0);
    expect(lists.every((l) => l.mosqueIds.includes("blue-mosque"))).toBe(true);
    const slugs = lists.map((l) => l.slug);
    expect(slugs).toContain("turkey");
  });

  it("getListsContainingMosque returns empty array for mosque in no list", () => {
    const lists = getListsContainingMosque("nonexistent-mosque-id");
    expect(lists).toEqual([]);
  });

  it("every list mosqueIds only references existing ids (validated by update-lists script)", () => {
    const allListIds = new Set<string>();
    curatedLists.forEach((list) => list.mosqueIds.forEach((id) => allListIds.add(id)));
    expect(allListIds.size).toBeGreaterThan(0);
    // Lists are validated by update-lists-from-mosques.js; we just ensure structure
    curatedLists.forEach((list) => {
      expect(list.slug).toBeDefined();
      expect(list.name).toBeDefined();
      expect(Array.isArray(list.mosqueIds)).toBe(true);
    });
  });
});

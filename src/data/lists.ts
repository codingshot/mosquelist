import type { CuratedList, ListsData } from "@/types/list";

import data from "./lists.json";

const { lists } = data as ListsData;

export type { CuratedList };
export const curatedLists: CuratedList[] = lists;

export function getListBySlug(slug: string): CuratedList | undefined {
  return curatedLists.find((l) => l.slug === slug);
}

/** Returns all curated lists that include the given mosque id. */
export function getListsContainingMosque(mosqueId: string): CuratedList[] {
  return curatedLists.filter((list) => list.mosqueIds.includes(mosqueId));
}

export interface CuratedList {
  slug: string;
  name: string;
  description: string;
  mosqueIds: string[];
}

export interface ListsData {
  lists: CuratedList[];
}

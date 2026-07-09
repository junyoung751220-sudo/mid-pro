export interface OverlapCheckItem {
  id: string;
  date: string | null;
}

export function findOverlappingEntryIds(items: OverlapCheckItem[]): Set<string> {
  const idsByDate = new Map<string, string[]>();

  for (const item of items) {
    if (!item.date) continue;
    const ids = idsByDate.get(item.date) ?? [];
    ids.push(item.id);
    idsByDate.set(item.date, ids);
  }

  const overlapping = new Set<string>();
  for (const ids of idsByDate.values()) {
    if (ids.length > 1) {
      ids.forEach((id) => overlapping.add(id));
    }
  }

  return overlapping;
}

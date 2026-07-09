"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ViewMode = "date" | "search";

interface ViewTabsProps {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
}

export function ViewTabs({ value, onValueChange }: ViewTabsProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={(next: string) => {
        if (next === "date" || next === "search") {
          onValueChange(next);
        }
      }}
    >
      <ToggleGroupItem value="date">날짜순</ToggleGroupItem>
      <ToggleGroupItem value="search">검색</ToggleGroupItem>
    </ToggleGroup>
  );
}

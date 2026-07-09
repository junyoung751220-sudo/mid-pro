"use client";

import { useState } from "react";
import { DateSortedList } from "@/components/nonsul/date-sorted-list";
import { SearchView } from "@/components/nonsul/search-view";
import { ViewTabs, type ViewMode } from "@/components/nonsul/view-tabs";

export function NonsulApp() {
  const [view, setView] = useState<ViewMode>("date");

  return (
    <div className="flex flex-col gap-4">
      <ViewTabs value={view} onValueChange={setView} />
      {view === "date" ? <DateSortedList /> : <SearchView />}
    </div>
  );
}

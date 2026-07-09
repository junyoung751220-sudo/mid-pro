"use client";

import { useState } from "react";
import { DateSortedList } from "@/components/nonsul/date-sorted-list";
import { PrintButton } from "@/components/nonsul/print-button";
import { SearchView } from "@/components/nonsul/search-view";
import { ViewTabs, type ViewMode } from "@/components/nonsul/view-tabs";

export function NonsulApp() {
  const [view, setView] = useState<ViewMode>("date");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 print:hidden">
        <ViewTabs value={view} onValueChange={setView} />
        <PrintButton />
      </div>
      {view === "date" ? <DateSortedList /> : <SearchView />}
    </div>
  );
}

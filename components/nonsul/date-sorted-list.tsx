import { NONSUL_DATASET } from "@/config/nonsulData";
import { formatExamPeriodTime } from "@/lib/nonsulFormat";
import { listSchedulesSortedByDate } from "@/services/nonsulSchedule";
import type { NonsulDataset } from "@/types/nonsul";

interface DateSortedListProps {
  dataset?: NonsulDataset;
}

export function DateSortedList({ dataset = NONSUL_DATASET }: DateSortedListProps) {
  const { withSchedule, withoutSchedule } = listSchedulesSortedByDate(dataset);

  return (
    <div className="flex flex-col gap-2" data-testid="date-sorted-list">
      {withSchedule.map((entry) => (
        <div
          key={`${entry.universityId}-${entry.schedule.date}-${entry.schedule.time}`}
          className="flex items-center justify-between rounded-md border border-border bg-card p-3"
        >
          <span data-testid="university-name" className="font-medium">
            {entry.universityName}
          </span>
          <div className="text-right">
            <div className="text-sm">{entry.schedule.date}</div>
            <div className="text-sm text-muted-foreground">
              {formatExamPeriodTime(entry.schedule)}
            </div>
          </div>
        </div>
      ))}

      {withoutSchedule.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">데이터 없음</span>
          {withoutSchedule.map((entry) => (
            <div
              key={entry.universityId}
              className="flex items-center justify-between rounded-md border border-border bg-card p-3 opacity-60"
            >
              <span data-testid="university-name" className="font-medium">
                {entry.universityName}
              </span>
              <span className="text-sm text-muted-foreground">데이터 없음</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

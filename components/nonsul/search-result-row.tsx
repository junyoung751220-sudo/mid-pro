import { formatExamDateTime } from "@/lib/nonsulFormat";
import type { ResolvedDepartmentInfo } from "@/types/nonsul";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "@phosphor-icons/react";

interface SearchResultRowProps {
  resolved: ResolvedDepartmentInfo;
  isOverlapping: boolean;
  onRemove: () => void;
}

export function SearchResultRow({
  resolved,
  isOverlapping,
  onRemove,
}: SearchResultRowProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-3",
        isOverlapping && "border-destructive bg-destructive/10"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 font-medium">
            <span>
              {resolved.universityName} / {resolved.requestedDepartmentName}
            </span>
            {isOverlapping && <Badge variant="destructive">겹침</Badge>}
          </div>
          {resolved.isSubstituted && (
            <div className="text-xs text-muted-foreground">
              ※ 정확한 학과 데이터 없음 → 같은 계열 대표 데이터(
              {resolved.displayDepartmentName}) 표시 중
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="제거"
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-muted-foreground">
        <span>
          {resolved.schedule ? formatExamDateTime(resolved.schedule) : "데이터 없음"}
        </span>
        <span>{resolved.minimumRequirement?.rawText ?? "데이터 없음"}</span>
        <span>
          {resolved.reflectionRatio
            ? `논술 ${resolved.reflectionRatio.essayPercent}% + 학생부 ${resolved.reflectionRatio.recordPercent}%`
            : "데이터 없음"}
        </span>
      </div>
    </div>
  );
}

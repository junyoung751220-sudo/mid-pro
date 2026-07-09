"use client";

import { useState } from "react";
import { MAX_SEARCH_ENTRIES, NONSUL_DATASET } from "@/config/nonsulData";
import { formatExamDateTime } from "@/lib/nonsulFormat";
import { resolveDepartmentDisplay } from "@/services/nonsulResolve";
import type { NonsulDataset } from "@/types/nonsul";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PlusIcon, XIcon } from "@phosphor-icons/react";

interface SearchEntry {
  id: string;
  universityId: string;
  departmentId: string;
}

interface SearchViewProps {
  dataset?: NonsulDataset;
}

export function SearchView({ dataset = NONSUL_DATASET }: SearchViewProps) {
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [universityId, setUniversityId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const departmentOptions = dataset.departments.filter(
    (department) => department.universityId === universityId
  );

  function handleAdd() {
    if (!universityId || !departmentId) return;
    setEntries((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, universityId, departmentId },
    ]);
    setDepartmentId("");
  }

  function handleRemove(id: string) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup className="flex-row items-end gap-2">
        <Field>
          <FieldLabel htmlFor="nonsul-university">학교</FieldLabel>
          <NativeSelect
            id="nonsul-university"
            value={universityId}
            onChange={(event) => {
              setUniversityId(event.target.value);
              setDepartmentId("");
            }}
          >
            <NativeSelectOption value="">학교 선택...</NativeSelectOption>
            {dataset.universities.map((university) => (
              <NativeSelectOption key={university.id} value={university.id}>
                {university.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="nonsul-department">학과</FieldLabel>
          <NativeSelect
            id="nonsul-department"
            value={departmentId}
            disabled={!universityId}
            onChange={(event) => setDepartmentId(event.target.value)}
          >
            <NativeSelectOption value="">학과 선택...</NativeSelectOption>
            {departmentOptions.map((department) => (
              <NativeSelectOption key={department.id} value={department.id}>
                {department.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!universityId || !departmentId}
        >
          <PlusIcon data-icon="inline-start" />
          추가
        </Button>
      </FieldGroup>

      <Badge variant="secondary">
        담긴 항목 {entries.length} / {MAX_SEARCH_ENTRIES}
      </Badge>

      <div className="flex flex-col gap-2">
        {entries.map((entry) => {
          const resolved = resolveDepartmentDisplay(
            dataset,
            entry.universityId,
            entry.departmentId
          );

          return (
            <div
              key={entry.id}
              className="rounded-md border border-border bg-card p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">
                    {resolved.universityName} / {resolved.requestedDepartmentName}
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
                  onClick={() => handleRemove(entry.id)}
                >
                  <XIcon />
                </Button>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                <span>
                  {resolved.schedule
                    ? formatExamDateTime(resolved.schedule)
                    : "데이터 없음"}
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
        })}
      </div>
    </div>
  );
}

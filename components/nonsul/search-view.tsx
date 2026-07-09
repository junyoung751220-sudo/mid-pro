"use client";

import { useState } from "react";
import { MAX_SEARCH_ENTRIES, NONSUL_DATASET } from "@/config/nonsulData";
import { findOverlappingEntryIds } from "@/services/nonsulOverlap";
import { resolveDepartmentDisplay } from "@/services/nonsulResolve";
import type { NonsulDataset } from "@/types/nonsul";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PlusIcon } from "@phosphor-icons/react";
import { SearchResultRow } from "@/components/nonsul/search-result-row";

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

  const isAtMaxEntries = entries.length >= MAX_SEARCH_ENTRIES;

  function handleAdd() {
    if (!universityId || !departmentId || isAtMaxEntries) return;
    setEntries((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, universityId, departmentId },
    ]);
    setDepartmentId("");
  }

  function handleRemove(id: string) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  const resolvedEntries = entries.map((entry) => ({
    id: entry.id,
    resolved: resolveDepartmentDisplay(dataset, entry.universityId, entry.departmentId),
  }));

  const overlappingIds = findOverlappingEntryIds(
    resolvedEntries.map(({ id, resolved }) => ({
      id,
      date: resolved.schedule?.date ?? null,
    }))
  );

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup className="flex-row items-end gap-2 print:hidden">
        <Field>
          <FieldLabel htmlFor="nonsul-university">학교</FieldLabel>
          <NativeSelect
            id="nonsul-university"
            value={universityId}
            disabled={isAtMaxEntries}
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
            disabled={!universityId || isAtMaxEntries}
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
          disabled={!universityId || !departmentId || isAtMaxEntries}
        >
          <PlusIcon data-icon="inline-start" />
          추가
        </Button>
      </FieldGroup>

      {isAtMaxEntries && (
        <p className="text-sm text-destructive print:hidden">
          최대 10개까지 담을 수 있습니다. 항목을 제거한 뒤 다시 추가해주세요.
        </p>
      )}

      <Badge variant="secondary" className="print:hidden">
        담긴 항목 {entries.length} / {MAX_SEARCH_ENTRIES}
      </Badge>

      <div className="flex flex-col gap-2">
        {resolvedEntries.map(({ id, resolved }) => (
          <SearchResultRow
            key={id}
            resolved={resolved}
            isOverlapping={overlappingIds.has(id)}
            onRemove={() => handleRemove(id)}
          />
        ))}
      </div>
    </div>
  );
}

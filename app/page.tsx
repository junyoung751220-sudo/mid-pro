import { DateSortedList } from "@/components/nonsul/date-sorted-list";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-5 text-lg font-bold">논술 원서 지원 도구</h1>
      <DateSortedList />
    </main>
  );
}

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViewTabs } from "@/components/nonsul/view-tabs";

describe("ViewTabs", () => {
  it("calls onValueChange with 'search' when the 검색 tab is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ViewTabs value="date" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "검색" }));

    expect(onValueChange).toHaveBeenCalledWith("search");
  });

  it("marks the current view's tab as checked", () => {
    render(<ViewTabs value="search" onValueChange={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "검색" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "날짜순" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });
});

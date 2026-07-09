import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __printCalled?: boolean;
  }
}

test.describe("인쇄", () => {
  test("날짜순 보기에서 인쇄 버튼 클릭 시 window.print가 호출되고, print 미디어에서는 조작 UI가 숨겨지고 데이터 없음 목록은 남는다", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.__printCalled = false;
      window.print = () => {
        window.__printCalled = true;
      };
    });
    await page.goto("/");

    await page.getByRole("button", { name: "인쇄" }).click();
    await expect
      .poll(() => page.evaluate(() => window.__printCalled))
      .toBe(true);

    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("radio", { name: "날짜순" })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "인쇄" })).not.toBeVisible();
    await expect(page.getByText("데이터 없음").first()).toBeVisible();
  });

  test("검색 보기에서 print 미디어일 때 입력 폼은 숨겨지고 결과 행은 남는다", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: "검색" }).click();
    await page.getByLabel("학교").selectOption({ label: "서강대학교" });
    await page.getByLabel("학과").selectOption({ label: "경영학과" });
    await page.getByRole("button", { name: "추가" }).click();
    await expect(page.getByText("서강대학교 / 경영학과")).toBeVisible();

    await page.emulateMedia({ media: "print" });
    await expect(page.getByLabel("학교")).not.toBeVisible();
    await expect(page.getByRole("button", { name: "추가" })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "제거" })).not.toBeVisible();
    await expect(page.getByText("서강대학교 / 경영학과")).toBeVisible();
  });
});

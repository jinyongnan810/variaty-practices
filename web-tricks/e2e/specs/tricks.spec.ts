import { expect, test } from "@playwright/test";

test.describe("trick detail demos", () => {
  test("persists useLocalStorage values across reloads", async ({ page }) => {
    await page.goto("/trick/use-local-storage");

    const nameInput = page.getByRole("textbox", { name: "Name" });
    await nameInput.fill("Kin");
    await page.getByRole("button", { name: "+" }).click();
    await page.getByRole("button", { name: "Toggle dark mode" }).click();

    await expect(page.getByText(/Count:\s*1/i)).toBeVisible();
    await expect.poll(() =>
      page.evaluate(() => ({
        name: localStorage.getItem("demo-name"),
        count: localStorage.getItem("demo-count"),
        dark: localStorage.getItem("demo-dark"),
      })),
    ).toEqual({
      name: JSON.stringify("Kin"),
      count: JSON.stringify(1),
      dark: JSON.stringify(true),
    });

    await page.reload();

    await expect(nameInput).toHaveValue("Kin");
    await expect(page.getByText(/Count:\s*1/i)).toBeVisible();
    await expect.poll(() =>
      page.evaluate(() => ({
        name: localStorage.getItem("demo-name"),
        count: localStorage.getItem("demo-count"),
        dark: localStorage.getItem("demo-dark"),
      })),
    ).toEqual({
      name: JSON.stringify("Kin"),
      count: JSON.stringify(1),
      dark: JSON.stringify(true),
    });

    await page.getByRole("button", { name: "Reset all" }).click();
    await expect(nameInput).toHaveValue("");
    await expect(page.getByText(/Count:\s*0/i)).toBeVisible();
  });

  test("keeps IME search results unchanged until composition ends", async ({
    page,
  }) => {
    await page.goto("/trick/composition-search");

    const input = page.getByRole("textbox", { name: "Search keyword" });

    await expect(
      page.getByLabel("Applied keyword value"),
    ).toHaveText("(empty)");
    await expect(page.getByText("22 results")).toBeVisible();

    await input.dispatchEvent("compositionstart");
    await input.fill("東");

    await expect(page.getByLabel("Composition status value")).toContainText(
      "Composing...",
    );
    await expect(
      page.getByLabel("Applied keyword value"),
    ).toHaveText("(empty)");
    await expect(page.getByText("22 results")).toBeVisible();

    await input.dispatchEvent("compositionend", { data: "東" });

    await expect(page.getByLabel("Composition status value")).toContainText(
      "Committed",
    );
    await expect(page.getByLabel("Applied keyword value")).toHaveText("東");
    await expect(page.getByText("1 results")).toBeVisible();
    await expect(page.getByRole("listitem")).toHaveText(["東京"]);
  });
});

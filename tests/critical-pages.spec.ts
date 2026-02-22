import { test, expect } from "@playwright/test";

test("root redirects to profile", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("heading", { name: "Hwat Sauce" })).toBeVisible();
});

test("blog page loads", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { name: "Blogs" })).toBeVisible();
});

test("about page loads", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
});

test("certifications page loads", async ({ page }) => {
  await page.goto("/cert");
  await expect(
    page.getByRole("heading", { name: "My Certifications" })
  ).toBeVisible();
});

test("first blog post opens", async ({ page }) => {
  await page.goto("/blog");
  const firstPost = page.getByRole("link", { name: /.+/ }).first();
  await firstPost.click();
  await expect(page.getByRole("heading").first()).toBeVisible();
});

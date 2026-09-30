import { describe, expect, it } from "vitest";
import { isRenderableHtmlResponse } from "../middleware.ts";
import { liveSections } from "./render.js";
import { SCHOOL_PROFILE } from "../src/data/schoolProfile.mjs";
import {
  SITE_URL,
  buildFallbackHtml,
  buildJsonLd,
  getPageMeta,
} from "../scripts/seo-page-content.mjs";

describe("crawler indexing safeguards", () => {
  it("passes through intentional HTML 404s but rejects renderer failures", () => {
    expect(isRenderableHtmlResponse(200, "text/html; charset=utf-8")).toBe(true);
    expect(isRenderableHtmlResponse(404, "text/html; charset=utf-8")).toBe(true);
    expect(isRenderableHtmlResponse(404, "application/json")).toBe(false);
    expect(isRenderableHtmlResponse(500, "text/html")).toBe(false);
    expect(isRenderableHtmlResponse(429, "text/html")).toBe(false);
  });

  it("has consistent page-specific crawl metadata for the public Roll Number Slip route", () => {
    const page = getPageMeta("/roll-no-slip");
    expect(page?.title).toBe("Roll No. Slip — GMS Taj Muhammad | Exam Roll Numbers & Admit Card");
    expect(page?.description).toContain("view only their own Roll No. Slip");

    const html = buildFallbackHtml(
      "<!doctype html><html><head><title>shell</title></head><body><div id=\"root\"></div></body></html>",
      "/roll-no-slip",
      null,
    );
    expect(html).toContain(`<link rel=\"canonical\" href=\"${SITE_URL}/roll-no-slip\"`);
    expect(html).toContain("only their own slip");
    expect(html).toContain('name="robots" content="index, follow');
    expect(html).toContain("public student directory");
  });

  it("keeps the organization schema aligned with the verified public profile", () => {
    const graph = JSON.parse(buildJsonLd("/"));
    const org = graph["@graph"].find((node) => node["@id"] === `${SCHOOL_PROFILE.siteUrl}#organization`);
    expect(SITE_URL).toBe(SCHOOL_PROFILE.siteUrl);
    expect(org.foundingDate).toBe(String(SCHOOL_PROFILE.establishedYear));
    expect(org.telephone).toBe(SCHOOL_PROFILE.phoneE164);
    expect(org.email).toBe(SCHOOL_PROFILE.email);
    expect(org.address.streetAddress).toBe("Village Dawat Kor");
    expect(org.address.postalCode).toBeUndefined();
  });

  it("renders `/results` live sections without an unscoped BISE variable", () => {
    const data = { exams: { published_exams: [] } };
    const ordinary = liveSections("/results", data);
    expect(ordinary).toContain("No school-published exam results");

    const live = liveSections("/results", data, {
      ok: true,
      exam_title: "SSC Annual-I 2026",
      is_live: true,
    });
    expect(live).toContain("SSC Annual-I 2026 — Results are LIVE");
  });
});

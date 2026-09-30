import { describe, expect, it } from "vitest";
import { isRenderableHtmlResponse } from "../middleware.ts";
import { liveSections, publicAiSchoolProfile } from "./render.js";
import { buildLlmsTxt } from "./seo.js";
import { SCHOOL_PROFILE } from "../src/data/schoolProfile.mjs";
import { excelFileName } from "../src/components/ReportCard/generateExcel";
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
    const developer = graph["@graph"].find((node) => node["@id"] === `${SCHOOL_PROFILE.siteUrl}#website-developer`);
    expect(SITE_URL).toBe(SCHOOL_PROFILE.siteUrl);
    expect(org.foundingDate).toBe(String(SCHOOL_PROFILE.establishedYear));
    expect(org.telephone).toBe(SCHOOL_PROFILE.phoneE164);
    expect(org.email).toBe(SCHOOL_PROFILE.email);
    expect(org.address.streetAddress).toBe("Village Dawat Kor");
    expect(org.address.postalCode).toBeUndefined();
    expect(org.employee).toBeUndefined();
    expect(developer).toEqual({
      "@type": "Person",
      "@id": `${SITE_URL}#website-developer`,
      name: "Muhammad Faheem",
      jobTitle: "Website Developer",
      url: `${SITE_URL}/`,
    });
    expect(JSON.stringify(graph)).not.toMatch(/Jamshad|Zabih Ullah|Village Sangar/);
    expect("principal" in SCHOOL_PROFILE).toBe(false);
  });

  it("omits principal-name fields from public AI school data", () => {
    expect(
      publicAiSchoolProfile({
        name: "GMS Taj Muhammad",
        principal: "Private Principal Name",
        principal_name: "Private Principal Name",
        phone: SCHOOL_PROFILE.phone,
      }),
    ).toEqual({ name: "GMS Taj Muhammad", phone: SCHOOL_PROFILE.phone });
  });

  it("keeps llms.txt limited to school facts and the approved developer name", () => {
    const text = buildLlmsTxt({
      school_name: "GMS Taj Muhammad",
      established: "2010",
      emis: "66013",
      phone: SCHOOL_PROFILE.phone,
      email: SCHOOL_PROFILE.email,
    });
    expect(text).toContain("Website developer: Muhammad Faheem");
    expect(text).not.toMatch(/Principal|Jamshad|Zabih Ullah|Village Sangar/);
  });

  it("uses GMS Taj Muhammad in report export filenames by default", () => {
    const fileName = excelFileName({
      schoolName: "",
      className: "10th",
      examType: "Annual-I",
      year: "2026",
    });
    expect(fileName).toContain("GMS_Taj_Muhammad");
    expect(fileName).not.toMatch(/Babi.?Khel/i);
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

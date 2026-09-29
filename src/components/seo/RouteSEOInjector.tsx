import { useLocation, matchPath } from "react-router-dom";
import SEO from "./SEO";
import { SITE_URL } from "./SEO";
// Shared canonical FAQ dataset — the SAME data the /faq React page, the
// /api/ai-data feed and /api/render (crawler HTML) serve. Single source,
// zero drift. (Types come from src/data/faqData.d.mts. The import stays
// INSIDE src/ on purpose — the frontend build must never depend on api/.)
import { buildFaqJsonLd } from "../../data/faqData.mjs";

interface RouteSEO {
  pattern: string;
  title: string;
  description: string;
  keywords?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  hasUrdu?: boolean;
  breadcrumbs?: (params: Record<string, string | undefined>) => { name: string; path: string }[];
  jsonLd?: (params: Record<string, string | undefined>, path: string) => Record<string, any> | Record<string, any>[];
}

const baseBreadcrumb = { name: "Home", path: "/" };

// ─── Reusable schemas ────────────────────────────────────────────────────────

/** FAQPage schema for the Admission page — boosts rich results in Google.
 *  Updated to lead with an explicit "are admissions open" Q&A so the SERP
 *  snippet reinforces the open status even when the admin has paused live
 *  form submissions in the database. */
const admissionFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are admissions open at GMS Taj Muhammad right now?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — admissions at Government Middle School Taj Muhammad are open every academic session. The online admission application form is available at https://gmstajmuhamad.vercel.app/admission for Class 6 to Class 8. Apply directly from your phone or computer.",
      },
    },
    {
      "@type": "Question",
      name: "Which classes can apply for admission at GMS Taj Muhammad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fresh admissions are available for Class 6, 7 and 8, the full middle-school course taught at school level. Students joining from another school are transferred directly between the two schools — classes 6 to 8 are not board-registered, so there is no board portal or board fee involved.",
      },
    },
    {
      "@type": "Question",
      name: "What documents are required for admission?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Required documents include: B-Form (NADRA) — mandatory, passport size photo — mandatory, previous result card or marksheet, school leaving certificate (for migration), father's CNIC copy, and migration certificate if applicable.",
      },
    },
    {
      "@type": "Question",
      name: "How can I track my admission application?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can track your admission application online by visiting the Admission page and entering your CNIC or application reference number in the Track Application section.",
      },
    },
    {
      "@type": "Question",
      name: "How does a transfer from another school work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A transfer into Class 6, 7 or 8 is completed directly between the two schools: submit the online application, the previous school issues the School Leaving Certificate together with the mark sheets for completed classes, and both schools confirm the transfer. Classes 6 to 8 are not board-registered, so no board migration, no DMC submission and no board fee apply.",
      },
    },
    {
      "@type": "Question",
      name: "Is there an online application form available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, GMS Taj Muhammad provides an online admission application form available at https://gmstajmuhamad.vercel.app/admission. You can apply directly from your phone or computer.",
      },
    },
    {
      "@type": "Question",
      name: "What is the school address and how can I contact GMS Taj Muhammad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GMS Taj Muhammad is located in Village Dawat Kor, District Mohmand, Khyber Pakhtunkhwa, Pakistan. You can email at gmstajmuhammad@gmail.com or visit the school directly.",
      },
    },
  ],
};

/** Course schema used for online-classes page */
const onlineClassesCourseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "GMS Taj Muhammad Online Classes",
  description:
    "Live and recorded online classes for all subjects — Mathematics, English, Urdu, Islamiyat, Pakistan Studies and Computer Science.",
  provider: {
    "@type": "HighSchool",
    "@id": `${SITE_URL}#organization`,
    name: "Government Middle School Taj Muhammad",
  },
  url: `${SITE_URL}/online-classes`,
  inLanguage: ["ur", "en"],
  educationalLevel: "Secondary",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    inLanguage: "ur",
    courseWorkload: "PT1H",
  },
};

/** Course schema for the Notes section */
const notesCourseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "GMS Taj Muhammad Study Notes",
  description:
    "Subject-wise and chapter-wise study notes for all classes — Mathematics, English, Urdu, Islamiyat, Pakistan Studies and Computer Science.",
  provider: {
    "@type": "HighSchool",
    "@id": `${SITE_URL}#organization`,
    name: "Government Middle School Taj Muhammad",
  },
  url: `${SITE_URL}/notes`,
  educationalLevel: "Secondary",
  isAccessibleForFree: true,
};

/** Library schema */
const librarySchema = {
  "@context": "https://schema.org",
  "@type": "Library",
  name: "GMS Taj Muhammad Digital Library",
  description:
    "Digital library of Government Middle School Taj Muhammad — textbooks, past papers, notes and educational resources for all classes.",
  url: `${SITE_URL}/library`,
  containedInPlace: {
    "@type": "HighSchool",
    "@id": `${SITE_URL}#organization`,
  },
};

const ROUTES: RouteSEO[] = [
  {
    pattern: "/",
    title: "GMS Taj Muhammad — Government Middle School, District Mohmand KPK",
    description:
      "Government Middle School Taj Muhammad, District Mohmand, KPK Pakistan. Quality education, notices, news, results, online classes, library and admissions.",
    keywords:
      "GMS Taj Muhammad, Government Middle School Taj Muhammad, Mohmand school, KPK school, school admission, school notices, school results, online classes Pakistan",
    hasUrdu: true,
  },
  {
    pattern: "/about",
    title: "About GMS Taj Muhammad — History, Mission & Vision | District Mohmand KPK",
    description:
      "Learn about Government Middle School Taj Muhammad — our history since 2018, mission, vision, faculty and commitment to quality education in District Mohmand.",
    keywords: "about GMS Taj Muhammad, school history, school mission, school vision, Mohmand education",
    breadcrumbs: () => [baseBreadcrumb, { name: "About", path: "/about" }],
    jsonLd: () => ({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About GMS Taj Muhammad",
      url: `${SITE_URL}/about`,
      about: { "@id": `${SITE_URL}#organization` },
    }),
  },
  {
    pattern: "/teachers",
    title: "Teachers & Faculty — GMS Taj Muhammad | District Mohmand KPK",
    description:
      "Meet the qualified teachers and faculty of GMS Taj Muhammad — dedicated educators shaping the future of students in District Mohmand, KPK.",
    keywords: "GMS Taj Muhammad teachers, faculty, qualified educators, school staff KPK",
    breadcrumbs: () => [baseBreadcrumb, { name: "Teachers", path: "/teachers" }],
  },
  {
    pattern: "/notices",
    title: "School Notices & Announcements — GMS Taj Muhammad",
    description:
      "Browse the latest school notices, urgent announcements, academic updates and event information from Government Middle School Taj Muhammad.",
    keywords: "school notices, announcements, urgent notices, academic updates, GMS Taj Muhammad notices",
    breadcrumbs: () => [baseBreadcrumb, { name: "Notices", path: "/notices" }],
  },
  {
    pattern: "/news",
    title: "News & Updates — GMS Taj Muhammad | District Mohmand",
    description:
      "Read the latest news, stories and achievements from Government Middle School Taj Muhammad — events, sports, academics and student success.",
    keywords: "school news, GMS Taj Muhammad news, school events, school stories, student achievements",
    breadcrumbs: () => [baseBreadcrumb, { name: "News", path: "/news" }],
  },
  {
    pattern: "/results",
    title:
      "BISE Peshawar Result 2026 — SSC Result, BISEP Result, Peshawar Board Result | GMS Taj Muhammad",
    description:
      "Check BISE Peshawar Result 2026 by roll number — SSC Result (9th & 10th class), HSSC Result (11th & 12th class), BISEP Result, Peshawar Board Result, Annual-I & Annual-II exams. Fast, free, mobile-friendly BISE Peshawar board result lookup powered by GMS Taj Muhammad.",
    keywords:
      "BISE Peshawar Result, BISEP Result, SSC Result, HSSC Result, Peshawar Board Result, BISE Result, Result 2026, 9th class result, 10th class result, 11th class result, 12th class result, Matric result, Intermediate result, BISE Peshawar result by roll number, BISEP result by roll number, BISE Peshawar SSC Result 2026, BISE Peshawar HSSC Result 2026, Annual-I result, Annual-II result, Supplementary result, Peshawar board result 2026, GMS Taj Muhammad results, school results, exam results, annual results, term results",
    hasUrdu: true,
    breadcrumbs: () => [baseBreadcrumb, { name: "Results", path: "/results" }],
    // ✅ Rich JSON-LD stack for /results:
    //   RouteSEOInjector already auto-emits a basic WebPage schema for every
    //   route (see the `webPage` const in RouteSEOInjector component below),
    //   so we do NOT duplicate it here. Instead we add 4 unique rich schemas
    //   eligible for Google rich results:
    //     1. FAQPage  (15 Q&As targeting exact search queries — FAQ rich result)
    //     2. HowTo    (5-step "how to check BISEP result" — HowTo rich result)
    //     3. ItemList (6 result types — SSC-I, SSC-II, HSSC-I, HSSC-II, Supp)
    //     4. Service  (result lookup as a Service with a SearchAction —
    //                 eligible for sitelinks search box treatment)
    //
    // The text inside FAQ/HowTo mirrors the on-page copy in
    // ResultsSeoContent.tsx — keep both files in sync when editing wording.
    jsonLd: () => {
      // ── 1. FAQPage (15 Q&As) — mirrors FAQS in ResultsSeoContent.tsx ──
      const faqs = [
        {
          q: "How do I check my BISE Peshawar Result 2026 by roll number?",
          a: "To check your BISE Peshawar Result 2026, enter your 6-digit roll number in the search box at the top of this page and tap Search Result. Our server fetches your result directly from the official BISEP portal (cloud.bisep.edu.pk) and displays your name, father name, total marks, grade, remarks and subject-wise theory and practical marks in a clean, mobile-friendly card. You can also visit cloud.bisep.edu.pk directly and enter your roll number on the board's official ShowResult page.",
        },
        {
          q: "What is the official website of BISE Peshawar (BISEP)?",
          a: "The official website of the Board of Intermediate and Secondary Education Peshawar is https://cloud.bisep.edu.pk/. This is the only authoritative source for BISEP results, date sheets, roll number slips, enrollment, migration and gazette publications. Result lookups on this page are routed through the same official BISEP endpoint via a cached proxy for speed and reliability.",
        },
        {
          q: "How do I check the 9th class result of BISE Peshawar?",
          a: "The 9th class result of BISE Peshawar is published as the SSC Annual-I Result. Once announced by the board, you can search it on this page using your 9th class roll number. The result card will show your obtained marks out of the total, grade, position in class (if available), and subject-wise breakdown. The 9th class SSC-I result is usually declared in August or September each year.",
        },
        {
          q: "How do I check the 10th class result of BISE Peshawar?",
          a: "The 10th class (Matriculation) result of BISE Peshawar is published as the SSC Annual-II Result. Enter your 10th class roll number in the search box above to view your result instantly. The Matric result includes marks for all subjects (English, Urdu, Islamiyat, Pakistan Studies, Mathematics, Physics, Chemistry, Biology / Computer Science), total obtained marks, grade and pass/fail remarks. The SSC-II result is typically declared in July or August.",
        },
        {
          q: "How do I check the 11th class (First Year) result of BISE Peshawar?",
          a: "The 11th class result, also called First Year or Intermediate Part-I, is published by BISE Peshawar as the HSSC Annual-I Result. Use your 11th class roll number in the search box above to retrieve your result. HSSC-I results are usually declared in October or November. Available groups include Pre-Medical, Pre-Engineering, ICS (Computer Science), I.Com (Commerce) and FA (Humanities).",
        },
        {
          q: "How do I check the 12th class (Second Year) result of BISE Peshawar?",
          a: "The 12th class result, also called Second Year or Intermediate Part-II, is published by BISE Peshawar as the HSSC Annual-II Result. Enter your 12th class roll number above to view your final intermediate result, which determines university admission eligibility. The HSSC-II result is usually declared in September. Both Part-I and Part-II marks are combined on the final HSSC marksheet.",
        },
        {
          q: "When will BISE Peshawar announce the SSC Result 2026?",
          a: "BISE Peshawar typically announces the SSC Annual-II (10th class / Matric) Result in the last week of July or first week of August, and the SSC Annual-I (9th class) Result in August or September. The exact SSC Result 2026 date is officially confirmed by the Chairman of the Board a few days before declaration. Once declared, results are searchable immediately on this page.",
        },
        {
          q: "When will BISE Peshawar announce the HSSC Result 2026?",
          a: "BISE Peshawar typically announces the HSSC Annual-II (12th class / Intermediate Part-II) Result in mid-September, and the HSSC Annual-I (11th class / First Year) Result in October or November. The official HSSC Result 2026 date is confirmed by the board closer to declaration. Bookmark this page to check your HSSC result by roll number the moment it is announced.",
        },
        {
          q: "What are the passing marks for BISE Peshawar SSC and HSSC exams?",
          a: "To pass any subject in BISE Peshawar SSC (9th and 10th class) or HSSC (11th and 12th class) exams, a student must obtain at least 33% marks in both theory and practical separately. To pass the overall exam, a student must pass all subjects. Students who fail 1 or 2 subjects are placed in a supplementary exam; those who fail 3 or more subjects must repeat the entire year.",
        },
        {
          q: "What is the grading system of BISE Peshawar?",
          a: "BISE Peshawar uses the following grading system for SSC and HSSC results: 80% and above = A-1 (A-One), 70% to 79% = A, 60% to 69% = B, 50% to 59% = C, 40% to 49% = D, 33% to 39% = E, and below 33% = F (Fail). The overall grade on the result card is calculated from the combined percentage of theory and practical marks across all subjects.",
        },
        {
          q: "How do I check my BISEP result by name instead of roll number?",
          a: "BISE Peshawar's online result portal at cloud.bisep.edu.pk officially supports search by Roll Number only. Name-based search is available exclusively through the printed gazette, which is distributed to affiliated schools and educational institutions on result day. If you do not know your roll number, contact your school admin office — they have a complete list of roll numbers issued to enrolled students.",
        },
        {
          q: "How do I download the BISE Peshawar result gazette PDF?",
          a: "The BISE Peshawar result gazette PDF is a complete list of every student's result for a given exam session. It is published on result day and is accessible only to affiliated school principals and authorized institutions via the board's institutional login at cloud.bisep.edu.pk. Individual students cannot download the gazette directly; they should request a print copy from their school office.",
        },
        {
          q: "What does BISEP stand for?",
          a: "BISEP stands for Board of Intermediate and Secondary Education Peshawar. It is the government education board responsible for conducting, regulating and certifying Secondary School Certificate (SSC, Class 9 and 10) and Higher Secondary School Certificate (HSSC, Class 11 and 12) examinations in Peshawar District and several adjacent districts of Khyber Pakhtunkhwa (KPK), Pakistan.",
        },
        {
          q: "How do I apply for rechecking or re-totaling of my BISE Peshawar result?",
          a: "If you believe your BISE Peshawar result marks are incorrect, you can apply for rechecking (also called re-totaling) within 15 days of result declaration. Visit the BISEP office at Jamrud Road, Peshawar, or apply through your school. The rechecking fee is paid via bank challan at designated banks. Only the totals are re-counted — the answer sheet is not re-evaluated. Updated marks (if any) are reflected in a revised result card.",
        },
        {
          q: "How do I apply for result correction (name, father name, date of birth) in BISE Peshawar?",
          a: "To correct a name, father name or date of birth error on your BISE Peshawar result card, submit a result correction application through your school along with the original B-Form from NADRA, your father's CNIC copy and the original result card. The board processes corrections through its Record department. Processing typically takes 4 to 8 weeks. Always verify your B-Form details before enrollment to prevent such errors.",
        },
      ];

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        name: "BISE Peshawar Result — Frequently Asked Questions",
        url: `${SITE_URL}/results`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      };

      // ── 2. HowTo (5 steps) — mirrors HOW_TO_STEPS in ResultsSeoContent.tsx ──
      const howToSteps = [
        { name: "Find your roll number", text: "Locate your 6-digit exam roll number printed on your roll number slip issued by BISE Peshawar or your school. If you lost your slip, contact your school admin office — they have a master list of all issued roll numbers." },
        { name: "Enter the roll number in the search box", text: "Type your roll number into the 'Roll No' input field at the top of this page. Use digits only — no spaces, dashes or letters. The field accepts 4 to 10 digit roll numbers." },
        { name: "Tap 'Search Result'", text: "Click the blue Search Result button. Our server fetches your result from the official BISEP portal (cloud.bisep.edu.pk) through a cached proxy and parses the response into a clean card view." },
        { name: "Review your result card", text: "Your result appears instantly showing your name, father name, roll number, total marks, obtained marks, grade, remarks and subject-wise theory and practical marks. Take a screenshot or print the page for your records." },
        { name: "Collect your original DMC", text: "The online result is for information only. Collect your original Detailed Marks Certificate (DMC) from your school or the BISEP office on the date mentioned in the 'Collect DMC From' field of your result." },
      ];

      const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Check Your BISE Peshawar Result by Roll Number",
        description:
          "Step-by-step guide to retrieve your BISEP (Board of Intermediate and Secondary Education Peshawar) result by roll number — covers SSC (9th & 10th class) and HSSC (11th & 12th class) exams.",
        url: `${SITE_URL}/results`,
        inLanguage: ["en", "ur"],
        totalTime: "PT2M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "PKR", value: "0" },
        supply: [{ "@type": "HowToSupply", name: "Exam roll number" }],
        tool: [
          { "@type": "HowToTool", name: "Any web browser (mobile or desktop)" },
          { "@type": "HowToTool", name: "Internet connection" },
        ],
        step: howToSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      };

      // ── 3. ItemList (6 result types) — mirrors RESULT_TYPES in ResultsSeoContent.tsx ──
      const resultTypes = [
        { code: "SSC-I", title: "SSC Annual-I Result (9th Class)", desc: "First-year secondary school (Class 9) BISE Peshawar annual examination result — Science and Arts groups." },
        { code: "SSC-II", title: "SSC Annual-II Result (10th Class / Matric)", desc: "Second-year secondary school (Class 10 / Matriculation) BISE Peshawar annual examination result." },
        { code: "HSSC-I", title: "HSSC Annual-I Result (11th Class / First Year)", desc: "First-year higher secondary (Class 11 / Intermediate Part-I) BISE Peshawar annual examination result — Pre-Medical, Pre-Engineering, ICS, I.Com, FA." },
        { code: "HSSC-II", title: "HSSC Annual-II Result (12th Class / Second Year)", desc: "Second-year higher secondary (Class 12 / Intermediate Part-II) BISE Peshawar annual examination result." },
        { code: "SSC-SUPP", title: "SSC Supplementary Result", desc: "BISE Peshawar 9th and 10th class supplementary (second chance) examination result for students who failed a subject in the annual exam." },
        { code: "HSSC-SUPP", title: "HSSC Supplementary Result", desc: "BISE Peshawar 11th and 12th class supplementary examination result for intermediate students who need to retake one or more subjects." },
      ];

      const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "BISE Peshawar Result Types",
        description: "All examination result types conducted and published by the Board of Intermediate and Secondary Education Peshawar (BISEP).",
        url: `${SITE_URL}/results`,
        numberOfItems: resultTypes.length,
        itemListElement: resultTypes.map((rt, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: rt.title,
          description: rt.desc,
        })),
      };

      // ── 4. Service (result lookup as a Service with a SearchAction) ──
      const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "BISE Peshawar Result Lookup by Roll Number",
        serviceType: "Examination result search",
        description:
          "Free online service to look up any BISE Peshawar (BISEP) examination result by roll number. Returns student name, father name, total marks, grade, remarks and subject-wise marks.",
        url: `${SITE_URL}/results`,
        inLanguage: ["en", "ur"],
        provider: { "@id": `${SITE_URL}#organization` },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Peshawar District and adjacent districts, Khyber Pakhtunkhwa, Pakistan",
        },
        isAccessibleForFree: true,
        category: "Education > Examination Results",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/results?roll={roll_number}`,
            actionPlatform: ["DesktopWebBrowser", "MobileWebBrowser"],
          },
          "query-input": "required name=roll_number",
        },
      };

      return [faqSchema, howToSchema, itemListSchema, serviceSchema];
    },
  },
  {
    pattern: "/merit-list",
    title: "Merit List — Official School Exam Rankings | GMS Taj Muhammad",
    description:
      "Official GMS Taj Muhammad merit list — top position holders of every exam, class-wise and whole-school rankings with marks, percentages and grades. Published live by the school office; upcoming merit lists show a countdown.",
    keywords:
      "merit list, GMS Taj Muhammad merit list, school merit list, position holders, top students, exam rankings, toppers list, class merit list, whole school merit list, Mohmand school ranking",
    breadcrumbs: () => [baseBreadcrumb, { name: "Merit List", path: "/merit-list" }],
  },
  {
    pattern: "/result-card",
    title: "Result Card — GMS Taj Muhammad Student Performance Report",
    description:
      "Download or view your detailed student result card from GMS Taj Muhammad with subject-wise marks, grade and overall performance.",
    keywords: "result card, student report, marks sheet, GMS Taj Muhammad result",
    breadcrumbs: () => [baseBreadcrumb, { name: "Result Card", path: "/result-card" }],
  },
  {
    pattern: "/gallery",
    title: "Photo Gallery — GMS Taj Muhammad School Events & Activities",
    description:
      "Explore the photo and video gallery of Government Middle School Taj Muhammad — events, sports, academic activities and celebrations.",
    keywords: "school gallery, photos, videos, school events, GMS Taj Muhammad gallery",
    breadcrumbs: () => [baseBreadcrumb, { name: "Gallery", path: "/gallery" }],
    jsonLd: () => ({
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "GMS Taj Muhammad Photo Gallery",
      url: `${SITE_URL}/gallery`,
      creator: { "@id": `${SITE_URL}#organization` },
    }),
  },
  {
    pattern: "/library",
    title: "Digital Library — GMS Taj Muhammad | Books, Notes & Past Papers",
    description:
      "Access the digital library of GMS Taj Muhammad — books, study notes, past papers and educational resources for all classes.",
    keywords: "school library, digital library, study notes, past papers, books, GMS Taj Muhammad library",
    breadcrumbs: () => [baseBreadcrumb, { name: "Library", path: "/library" }],
    jsonLd: () => librarySchema,
  },
  {
    pattern: "/calendar",
    title: "School Event Calendar — GMS Taj Muhammad | Exams, Holidays & PTMs",
    description:
      "View the official school calendar of GMS Taj Muhammad — exam dates, holidays, PTMs, sports days, results day and important events. Subscribe via .ics feed for automatic sync to Google Calendar or iPhone.",
    keywords: "school calendar, exam dates, holidays, PTM, sports day, school events, GMS Taj Muhammad calendar, .ics feed",
    breadcrumbs: () => [baseBreadcrumb, { name: "Calendar", path: "/calendar" }],
    // ✅ Event schema — helps Google show upcoming events as rich results
    jsonLd: () => ({
      "@context": "https://schema.org",
      "@type": "EventSchedule",
      name: "GMS Taj Muhammad School Calendar",
      description: "Official calendar of Government Middle School Taj Muhammad — exams, holidays, parent-teacher meetings, sports days and school events.",
      url: `${SITE_URL}/calendar`,
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
      organizer: { "@id": `${SITE_URL}#organization` },
    }),
  },
  {
    pattern: "/contact",
    title: "Contact GMS Taj Muhammad — Address, Phone & Email | District Mohmand",
    description:
      "Contact Government Middle School Taj Muhammad, District Mohmand, KPK. Find our address, phone number, email, WhatsApp and location map. Reach out for admissions, queries and feedback.",
    keywords: "contact GMS Taj Muhammad, school address, school phone, school email, Mohmand school contact, WhatsApp school",
    breadcrumbs: () => [baseBreadcrumb, { name: "Contact", path: "/contact" }],
    // ✅ ContactPage schema — boosts rich results for contact queries
    jsonLd: () => ({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact GMS Taj Muhammad",
      url: `${SITE_URL}/contact`,
      about: { "@id": `${SITE_URL}#organization` },
      mainEntity: {
        "@type": "EducationalOrganization",
        name: "Government Middle School Taj Muhammad",
        url: SITE_URL,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Taj Muhammad",
          addressRegion: "Khyber Pakhtunkhwa",
          addressCountry: "PK",
        },
        areaServed: "District Mohmand, KPK, Pakistan",
      },
    }),
  },
  {
    pattern: "/online-classes",
    title: "Online Classes — GMS Taj Muhammad | Live & Recorded Lectures",
    description:
      "Join live online classes and access recorded lectures from GMS Taj Muhammad — flexible learning anytime, anywhere.",
    keywords: "online classes, live lectures, e-learning, online school Pakistan, GMS Taj Muhammad online",
    breadcrumbs: () => [baseBreadcrumb, { name: "Online Classes", path: "/online-classes" }],
    // ✅ Course schema — helps Google show this as an educational resource
    jsonLd: () => onlineClassesCourseSchema,
  },
  {
    pattern: "/roll-no-slip",
    title: "Roll No. Slip — GMS Taj Muhammad | Exam Roll Numbers & Admit Card",
    description:
      "Find your exam roll number and download your admit card (Roll No. Slip) for Government Middle School Taj Muhammad, District Mohmand, KPK.",
    keywords: "roll no slip, exam roll number, admit card, GMS Taj Muhammad roll number, exam admit card Pakistan",
    breadcrumbs: () => [baseBreadcrumb, { name: "Roll No. Slip", path: "/roll-no-slip" }],
  },
  {
    pattern: "/admission",
    title: "Admissions Open — GMS Taj Muhammad | Apply Online District Mohmand",
    description:
      "Admissions Open at Government Middle School Taj Muhammad, District Mohmand, KPK. Apply online for Class 6, 7 and 8. Eligibility, fee structure, required documents and online admission form.",
    keywords:
      "GMS Taj Muhammad admission, admissions open, school admission Mohmand, KPK school admission, Class 6 admission, Class 7 admission, Class 8 admission, transfer between schools, apply online school Pakistan, Taj Muhammad school admission",
    breadcrumbs: () => [baseBreadcrumb, { name: "Admissions", path: "/admission" }],
    // ✅ Rich schema stack for /admission — maximises Google visibility:
    //   1. FAQPage (rich Q&A result) — updated to emphasise "Admissions Open"
    //      so the SERP snippet reinforces the open status even when the admin
    //      has temporarily paused live form submissions.
    //   2. EducationalOccupationalProgram — explicitly tells Google this page
    //      is about an admission / enrollment program (eligible for the
    //      "Programs" rich result).
    //   3. EducationalOrganization anchor (reused) — links the page back to
    //      the school's main schema identity.
    jsonLd: () => [
      admissionFAQSchema,
      {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalProgram",
        name: "GMS Taj Muhammad Admissions",
        description:
          "Admissions Open at Government Middle School Taj Muhammad for Class 6 to Class 8 — fresh admissions and direct school-to-school transfers.",
        url: `${SITE_URL}/admission`,
        provider: {
          "@type": "HighSchool",
          "@id": `${SITE_URL}#organization`,
          name: "Government Middle School Taj Muhammad",
        },
        educationalProgramMode: "Onsite",
        educationalCredentialAwarded: "Secondary School Certificate (SSC)",
        applicationDeadline: undefined,
        timeToComplete: "P5Y",
        offers: {
          "@type": "Offer",
          category: "Free education (Government school)",
          price: "0",
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  },
  {
    pattern: "/faq",
    title: "FAQ — Frequently Asked Questions | GMS Taj Muhammad",
    description:
      "Frequently asked questions about GMS Taj Muhammad: admission procedure and documents, application tracking, results and grading, BISE Peshawar board exams, study notes, library, contact details and how to install the website as an app.",
    keywords:
      "GMS Taj Muhammad FAQ, school admission questions, how to apply GMS Taj Muhammad, admission documents, result check roll number, BISE Peshawar result, school contact Mohmand, GMS Taj Muhammad help",
    breadcrumbs: () => [baseBreadcrumb, { name: "FAQ", path: "/faq" }],
    // ✅ Full FAQPage rich-result schema — built from the SAME canonical
    // dataset (src/data/faqData.mjs) the AI feed and crawler HTML use. One source,
    // zero drift: if a Q&A is edited there, this schema updates too.
    jsonLd: () => buildFaqJsonLd(),
  },
  {
    pattern: "/notes",
    title: "Study Notes — GMS Taj Muhammad | Subject-wise Notes & Resources",
    description:
      "Access subject-wise study notes, summaries and chapter resources for all classes at GMS Taj Muhammad — interactive learning made easy.",
    keywords: "study notes, subject notes, chapter notes, school notes Pakistan, GMS Taj Muhammad notes",
    breadcrumbs: () => [baseBreadcrumb, { name: "Notes", path: "/notes" }],
    // ✅ Course schema for the notes hub
    jsonLd: () => notesCourseSchema,
  },
  {
    pattern: "/notes/:subject",
    title: "Subject Notes — GMS Taj Muhammad | Chapter-wise Study Material",
    description:
      "Browse chapter-wise notes and lessons for the selected subject. Comprehensive study material curated for GMS Taj Muhammad students.",
    keywords: "subject notes, chapters, lessons, study material",
    breadcrumbs: (p) => [
      baseBreadcrumb,
      { name: "Notes", path: "/notes" },
      { name: p.subject || "Subject", path: `/notes/${p.subject}` },
    ],
    // ✅ Course schema per subject
    jsonLd: (p) => ({
      "@context": "https://schema.org",
      "@type": "Course",
      name: `${(p.subject || "Subject").charAt(0).toUpperCase() + (p.subject || "subject").slice(1)} Notes — GMS Taj Muhammad`,
      description: `Chapter-wise study notes for ${p.subject || "the subject"} — comprehensive learning material for GMS Taj Muhammad students.`,
      provider: {
        "@type": "HighSchool",
        "@id": `${SITE_URL}#organization`,
        name: "Government Middle School Taj Muhammad",
      },
      url: `${SITE_URL}/notes/${p.subject}`,
      educationalLevel: "Secondary",
      isAccessibleForFree: true,
    }),
  },
  {
    pattern: "/notes/:subject/:chapter",
    title: "Chapter Notes — Detailed Study Material",
    description:
      "Read detailed chapter notes, examples and revision content. Interactive study resources for GMS Taj Muhammad students.",
    keywords: "chapter notes, detailed notes, study material, revision",
    type: "article",
    breadcrumbs: (p) => [
      baseBreadcrumb,
      { name: "Notes", path: "/notes" },
      { name: p.subject || "Subject", path: `/notes/${p.subject}` },
      { name: p.chapter || "Chapter", path: `/notes/${p.subject}/${p.chapter}` },
    ],
    // ✅ Article schema for chapter pages
    jsonLd: (p) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${p.chapter || "Chapter"} Notes — ${p.subject || "Subject"} | GMS Taj Muhammad`,
      description: `Detailed notes for ${p.chapter || "chapter"} in ${p.subject || "subject"} — GMS Taj Muhammad study material.`,
      url: `${SITE_URL}/notes/${p.subject}/${p.chapter}`,
      author: { "@id": `${SITE_URL}#organization` },
      publisher: { "@id": `${SITE_URL}#organization` },
      educationalLevel: "Secondary",
      inLanguage: "ur",
    }),
  },
  // ── Private / noindex pages ──
  { pattern: "/auth/signin",         title: "Sign In — Student, Teacher & Admin Login",    description: "Sign in to your GMS Taj Muhammad account.",            noIndex: true },
  { pattern: "/auth/forgot-password",title: "Forgot Password — Recover Your Account",     description: "Recover access to your GMS Taj Muhammad account.",     noIndex: true },
  { pattern: "/auth/reset-password", title: "Reset Password — Set a New Password",        description: "Set a new password for your GMS Taj Muhammad account.", noIndex: true },
  { pattern: "/admin",               title: "Admin Dashboard — School Management",         description: "Administrative console for GMS Taj Muhammad.",          noIndex: true },
      {
    pattern: "/search",
    title: "Search — GMS Taj Muhammad",
    description: "Search across notices, news, teachers and notes at Government Middle School Taj Muhammad.",
    noIndex: true,  // ← ADDED: prevents thin-content search page from being indexed
    breadcrumbs: () => [baseBreadcrumb, { name: "Search", path: "/search" }],
  },
     {
    pattern: "/duty",
    title: "School Duty Board — GMS Taj Muhammad | Class Monitors & Proctors",
    description: "View official duty assignments for GMS Taj Muhammad — class monitors, proctors, social workers, head boys and nazira for Classes 6 to 8.",
    keywords: "school duty board, class monitor, proctor, head boy, GMS Taj Muhammad duty",
    breadcrumbs: () => [baseBreadcrumb, { name: "Duty Board", path: "/duty" }],
  },
  
  {
    pattern: "/news/:id",
    title: "News Article — GMS Taj Muhammad",
    description: "Read the latest news from Government Middle School Taj Muhammad.",
    type: "article",
    breadcrumbs: () => [baseBreadcrumb, { name: "News", path: "/news" }],
  },
  {
    pattern: "/notices/:id",
    title: "School Notice — GMS Taj Muhammad",
    description: "Read the full school notice from Government Middle School Taj Muhammad.",
    type: "article",
    breadcrumbs: () => [baseBreadcrumb, { name: "Notices", path: "/notices" }],
  },
];

const NOT_FOUND: RouteSEO = {
  pattern: "*",
  title: "Page Not Found (404)",
  description: "The page you are looking for could not be found. Return to GMS Taj Muhammad home page.",
  noIndex: true,
};

const RouteSEOInjector = () => {
  const location = useLocation();
  const path = location.pathname;

  let matched: RouteSEO | null = null;
  let matchedParams: Record<string, string | undefined> = {};
  for (const r of ROUTES) {
    const m = matchPath({ path: r.pattern, end: true }, path);
    if (m) {
      matched = r;
      matchedParams = m.params as Record<string, string | undefined>;
      break;
    }
  }
  if (!matched) matched = NOT_FOUND;

  // Dynamic title for /notes/:subject — capitalize subject param
  let titleOut = matched.title;
  if (matched.pattern === "/notes/:subject" && matchedParams.subject) {
    const subj = matchedParams.subject.charAt(0).toUpperCase() + matchedParams.subject.slice(1);
    titleOut = `${subj} Notes — GMS Taj Muhammad | Chapter-wise Study Material`;
  }

  const breadcrumbs = matched.breadcrumbs ? matched.breadcrumbs(matchedParams) : undefined;
  const extraJsonLd = matched.jsonLd ? matched.jsonLd(matchedParams, path) : undefined;

  const webPage = {
    "@context": "https://schema.org",
    "@type": matched.type === "article" ? "Article" : "WebPage",
    name: titleOut,
    description: matched.description,
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    isPartOf: { "@id": `${SITE_URL}#website` },
    ...(matched.type === "article"
      ? {
          headline: titleOut,
          publisher: { "@id": `${SITE_URL}#organization` },
        }
      : {}),
  };

  const jsonLd: Record<string, any>[] = [webPage];
  if (extraJsonLd) {
    if (Array.isArray(extraJsonLd)) jsonLd.push(...extraJsonLd);
    else jsonLd.push(extraJsonLd);
  }

  return (
    <SEO
      title={titleOut}
      description={matched.description}
      keywords={matched.keywords}
      path={path}
      type={matched.type || "website"}
      noIndex={matched.noIndex}
      breadcrumbs={breadcrumbs}
      jsonLd={jsonLd}
      hasUrdu={matched.hasUrdu}
    />
  );
};

export default RouteSEOInjector;
                                         

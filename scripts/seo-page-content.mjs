// ─────────────────────────────────────────────────────────────────────────────
// scripts/seo-page-content.mjs — Build-time crawler-readable page content
//
// PURPOSE
// ───────
// Every public page of the site is a client-rendered React component. When the
// Chromium prerender step cannot run (browser unavailable on a CI builder, or
// a route fails to render), AI/search crawlers would otherwise receive the
// bare 3.3 KB SPA shell — which contains ~60 characters of readable text and
// is exactly the "discoverable but unreadable" problem reported with ChatGPT
// and friends.
//
// This module is the guaranteed floor: for EVERY public route it carries real,
// accurate, crawler-readable HTML (headings, paragraphs, lists, internal
// links) plus per-route <title>/meta description/JSON-LD. The prerender
// pipeline injects this content into the built shell and writes it to
// dist/<route>/index.html whenever (and only whenever) the Chromium render did
// not produce a full page for that route.
//
// FACTS: all school facts below mirror api/llms.js (phone, email, principal,
// EMIS code, BISE Peshawar affiliation, classes 6–8 …) so crawlers never read
// conflicting information. When something about the school changes, update it
// in api/llms.js AND here.
//
// The React app replaces this static block the moment it mounts, so human
// visitors always see the live interactive site.
// ─────────────────────────────────────────────────────────────────────────────

import { FAQ_ITEMS, FAQ_CATEGORIES } from "../src/data/faqData.mjs";

export const SITE_URL = "https://gmstajmuhamad.vercel.app";
export const SITE_NAME = "GMS Taj Muhammad";
export const SITE_LONG_NAME = "Government Middle School Taj Muhammad, District Mohmand";

const SCHOOL_FACTS = [
  "Full name: Government Middle School Taj Muhammad (GMS Taj Muhammad)",
  "Location: Village Dawat Kor, District Mohmand, Khyber Pakhtunkhwa (KPK), Pakistan",
  "Established: 2018",
  "EMIS code: 66013",
  "Principal: Mr. Imdad Ullah",
  "Classes offered: 6, 7, 8, 9 and 10 (matriculation)",
  "Board affiliation: BISE Peshawar — classes 9 and 10 sit board examinations",
  "Phone: +92 346 9898295",
  "Email: gmstajmuhammad@gmail.com",
];

// Main public navigation — appended to every fallback page as internal links
// so crawlers can discover every section from any single page.
export const NAV_LINKS = [
  ["Home", "/"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Admission", "/admission"],
  ["Notices", "/notices"],
  ["News", "/news"],
  ["Results", "/results"],
  ["Merit List", "/merit-list"],
  ["Result Card", "/result-card"],
  ["Roll No. Slip", "/roll-no-slip"],
  ["Calendar", "/calendar"],
  ["Teachers", "/teachers"],
  ["Notes", "/notes"],
  ["Library", "/library"],
  ["Gallery", "/gallery"],
  ["Online Classes", "/online-classes"],
  ["Duty Roster", "/duty"],
  ["FAQ", "/faq"],
];

const SUBJECTS = [
  ["math", "Mathematics", "arithmetic, algebra, geometry and trigonometry with worked examples, chapter quizzes and flashcards"],
  ["english", "English", "grammar, comprehension, essays, letters and tenses with practice exercises"],
  ["urdu", "Urdu", "grammar (قواعد), essays (مضمون), letters (خط) and comprehension practice"],
  ["islamiat", "Islamiat", "Quranic studies, Ahadees, Islamic history and important questions for exam preparation"],
  ["pakistan-studies", "Pakistan Studies", "history of Pakistan, geography, constitution and economy with exam-focused notes"],
  ["computer", "Computer Science", "computer basics, MS Office, programming logic and internet concepts with practice MCQs"],
];

// ── Per-route content ────────────────────────────────────────────────────────
// blocks: h2 = section heading, p = paragraph, ul = bullet list,
//         links = [label, href] rendered as a list (e.g. latest notices).
const PAGES = {
  "/": {
    title: "GMS Taj Muhammad — Government Middle School, District Mohmand KPK",
    description:
      "Official website of Government Middle School (GMS) Village Dawat Kor, District Mohmand, KPK, Pakistan. Online admission applications, exam results by roll number, notices, news, free study notes, past papers, academic calendar, teacher directory and photo gallery for classes 6 to 8.",
    h1: "Government Middle School Taj Muhammad — District Mohmand, KPK",
    blocks: [
      {
        p: [
          "Government Middle School (GMS) Taj Muhammad is a government middle school in Village Dawat Kor, District Mohmand, Khyber Pakhtunkhwa, Pakistan, established in 2018 (EMIS code 66013). The school offers classes 6 to 8 and is affiliated with BISE Peshawar, the Board of Intermediate and Secondary Education Peshawar, whose examinations our class 9 and 10 students sit every year. Mr. Imdad Ullah is the principal of the school.",
          "This official website is the school's digital front door. Students and parents can apply for admission online, search exam results by roll number, read official notices and school news, download free study notes and past papers, check the academic calendar, browse the teacher directory and view photos of school events. The site also works as a Progressive Web App (PWA), so it can be installed on a phone and used offline.",
        ],
      },
      // Filled at build time with the REAL numbers from school_settings —
      // AI tools must read actual statistics, never a "0+" placeholder.
      { h2: "School at a glance", __stats: true },
      {
        h2: "What you can do on this website",
        ul: [
          "Apply online for admission to classes 6–8 and track your application status by reference number, B-Form number or contact number",
          "Search school exam results by roll number (1st/2nd semester for classes 6–8; Annual-I/Annual-II for classes 9–10)",
          "Search BISE Peshawar board results (SSC 9th/10th) live from the official board portal",
          "View the official Merit List — top position holders of each class and school-wide rankings with pass statistics",
          "Find, download and share your exam Roll No. Slip with its QR code and the exam date sheet",
          "Join live online classes in the browser and catch up on recorded lessons",
          "Read official notices — holidays, exam schedules, fee deadlines and parent-teacher meetings",
          "Read school news — events, achievements, sports and competitions",
          "Download free study notes for classes 6–8 in nine subjects",
          "Check the academic calendar, teacher duty roster and staff directory",
        ],
      },
      { h2: "Latest notices", links: { source: "notices", empty: "Open the Notices page for the latest official notices." } },
      { h2: "Latest news", links: { source: "news", empty: "Open the News page for the latest school news." } },
    ],
  },

  "/about": {
    title: "About Us — GMS Taj Muhammad, Village Dawat Kor, District Mohmand",
    description:
      "About Government Middle School Taj Muhammad, District Mohmand, KPK: established 2018, EMIS code 66013, principal Mr. Imdad Ullah, classes 6–8, affiliated with BISE Peshawar. Our mission, vision and values.",
    h1: "About GMS Taj Muhammad",
    blocks: [
      {
        p: [
          "Government Middle School Taj Muhammad is a public middle school serving Taj Muhammad and the surrounding villages of District Mohmand, Khyber Pakhtunkhwa, Pakistan. The school was established in 2018 under the Elementary & Secondary Education Department of Khyber Pakhtunkhwa and is registered with EMIS code 66013. It educates students from class 6 through class 10, preparing them for the Secondary School Certificate examinations conducted by BISE Peshawar.",
          "The school serves a rural tribal district, and its mission is to give every child of the area access to qualified teachers, a proper science education and modern learning tools — free of cost, as provided by the Government of Khyber Pakhtunkhwa. Students receive free textbooks under the provincial free textbook scheme, and the school building houses science facilities, a library corner and a playground for sports and assemblies.",
        ],
      },
      {
        h2: "Mission",
        p: [
          "Our mission is to provide quality, accessible and free education to the children of Taj Muhammad and nearby areas of District Mohmand; to build strong foundations in mathematics, science, languages and computer literacy; and to prepare students to pass their board examinations with confidence and continue on to colleges and universities across Pakistan.",
        ],
      },
      {
        h2: "Vision",
        p: [
          "Our vision is an educated Mohmand: a generation of students from this region who can compete with students anywhere in Pakistan, who respect knowledge and teachers, and who return to serve their community as doctors, engineers, teachers, officers and skilled professionals.",
        ],
      },
      {
        h2: "School facts",
        ul: SCHOOL_FACTS,
      },
      // Real numbers from school_settings, injected at build time.
      { h2: "School at a glance", __stats: true },
    ],
  },

  "/contact": {
    title: "Contact Us — GMS Taj Muhammad, Village Dawat Kor, District Mohmand",
    description:
      "Contact Government Middle School Taj Muhammad: phone +92 346 9898295, email gmstajmuhammad@gmail.com, Village Dawat Kor, District Mohmand, Khyber Pakhtunkhwa, Pakistan. Contact form, WhatsApp and location map.",
    h1: "Contact GMS Taj Muhammad",
    blocks: [
      {
        p: [
          "Parents, guardians and students are welcome to contact the school for admission queries, result verification, notices or any other matter. During working days the school office is open in the morning shift; a contact form and WhatsApp option are also available on this page for written queries, and an embedded map shows the school location in Village Dawat Kor, District Mohmand.",
        ],
      },
      {
        h2: "Contact details",
        ul: [
          "School: Government Middle School Taj Muhammad",
          "Address: Village Dawat Kor, District Mohmand, Khyber Pakhtunkhwa, Pakistan",
          "Phone: +92 346 9898295",
          "Email: gmstajmuhammad@gmail.com",
          "Principal: Mr. Imdad Ullah",
          "Facebook page: https://www.facebook.com/share/1EERTSk1W7/",
        ],
      },
      {
        p: [
          "For admission questions, please first check the Admission page — it explains eligibility, required documents and the online application process, and lets you track an already-submitted application. For exam dates and holidays, see the Notices page and the academic Calendar, which are updated by the school administration throughout the year.",
        ],
      },
    ],
  },

  "/admission": {
    title: "Admission — GMS Taj Muhammad (Classes 6–8)",
    description:
      "Online admission application for Government Middle School Taj Muhammad, District Mohmand — classes 6 to 8. Required documents, application process and online application status tracker.",
    h1: "Admissions at GMS Taj Muhammad",
    blocks: [
      {
        p: [
          "Admissions at Government Middle School Taj Muhammad are open every academic session for classes 6 to 8. Admission is free of charge, as in all government schools of Khyber Pakhtunkhwa. Parents can apply online through the application form on this page — the form issues a reference number that can be used to track the application status on the same website, without visiting the school twice.",
        ],
      },
      {
        h2: "Who can apply",
        ul: [
          "Boys and girls seeking admission to classes 6, 7 and 8",
          "Students transferring from other schools within District Mohmand or from other districts (school leaving certificate required)",
        ],
      },
      {
        h2: "Required documents",
        ul: [
          "Student B-Form (NADRA)",
          "Passport-size photographs of the student",
          "Previous school result card",
          "School leaving certificate (for migration cases)",
          "Father's CNIC copy (for migration cases)",
        ],
      },
      {
        h2: "How to apply",
        ul: [
          "Fill the online admission form on this page and submit it",
          "Save the reference number shown after submission",
          "Track your application any time by reference number, B-Form number or contact number",
          "Visit the school on the given date to complete verification and enrolment",
        ],
      },
      // Filled at build time (prerender-lib.mjs) with the ACTUAL admin-uploaded
      // admission files (category "Admission" in the library) — direct download
      // URLs, so even a static snapshot points AI tools at the real forms.
      {
        h2: "Downloadable admission documents",
        links: {
          source: "admission-files",
          empty: "The admission prospectus, fee structure, transfer letter and rules are generated directly on the Admission page — open it in a browser and use the download buttons.",
        },
      },
    ],
  },

  "/notices": {
    title: "Notices — GMS Taj Muhammad, Village Dawat Kor, District Mohmand",
    description:
      "Official notices of Government Middle School Taj Muhammad — holidays, exam schedules and date sheets, fee deadlines, parent-teacher meetings and urgent announcements for students and parents.",
    h1: "Official Notices",
    blocks: [
      {
        p: [
          "This page lists the official notices of Government Middle School Taj Muhammad, District Mohmand. The school administration publishes exam schedules and date sheets, holiday announcements, fee deadlines, parent-teacher meeting dates and other urgent information here. Each notice shows its publication date and category, and urgent notices are highlighted at the top. Open any notice to read the full details.",
        ],
      },
      { h2: "Recent notices", links: { source: "notices", empty: "All current notices are listed on this page." } },
    ],
  },

  "/news": {
    title: "News — GMS Taj Muhammad, Village Dawat Kor, District Mohmand",
    description:
      "News from Government Middle School Taj Muhammad — school events, student achievements, sports days, science fairs, competitions and announcements from District Mohmand, KPK.",
    h1: "School News",
    blocks: [
      {
        p: [
          "Read the latest news from Government Middle School Taj Muhammad. We publish reports about school events, student achievements in exams and competitions, sports days, science fairs, guest lectures, cultural days and everything that happens around our campus in District Mohmand. Each article shows its publication date and can be opened for the full story with photos.",
        ],
      },
      { h2: "Recent news", links: { source: "news", empty: "All current news articles are listed on this page." } },
    ],
  },

  "/results": {
    title: "Results — Search by Roll Number | GMS Taj Muhammad",
    description:
      "Search exam results of GMS Taj Muhammad by roll number — school results for classes 6–8 (1st/2nd semester exams) plus live BISE Peshawar board results (SSC 9th/10th). Detailed result cards with subject-wise marks.",
    h1: "Exam Results",
    blocks: [
      {
        p: [
          "On this page students of Government Middle School Taj Muhammad can search their examination results by roll number. School internal results are available for classes 6, 7 and 8 (1st and 2nd semester exams) once the school administration publishes them. The same page can also search BISE Peshawar board results for SSC (9th and 10th class) students — these are fetched live from the official board portal, cloud.bisep.edu.pk.",
        ],
      },
      {
        h2: "How to check your result",
        ul: [
          "Select your exam (class and examination name) on the Results page",
          "Enter your roll number exactly as printed on your admit card",
          "Open the result to see total marks, percentage, grade and subject-wise marks",
          "Use the Result Card page for a printable card with position and grades",
        ],
      },
      {
        h2: "Grading scale",
        ul: [
          "A+ : 90% and above",
          "A : 80–89%",
          "B : 60–79%",
          "C : 45–59%",
          "D : 33–44%",
          "Fail: below 33%",
        ],
      },
    ],
  },

  "/result-card": {
    title: "Result Card — GMS Taj Muhammad",
    description:
      "Detailed result cards for GMS Taj Muhammad students — subject-wise marks, grades, percentage, pass/fail status and class position, searchable by roll number and printable as PDF.",
    h1: "Result Card",
    blocks: [
      {
        p: [
          "The Result Card page shows a complete, detailed result card for any published exam of Government Middle School Taj Muhammad. Enter the exam, class and roll number to see the student's name, photo, roll number, class and exam year, together with total and obtained marks, percentage, grade, pass or fail status, class position and a subject-wise marks breakdown. The card can be printed or saved as PDF for admission and record purposes.",
        ],
      },
    ],
  },

  "/calendar": {
    title: "Academic Calendar — GMS Taj Muhammad",
    description:
      "Academic calendar of GMS Taj Muhammad — exam dates, holidays, school events and important dates for classes 6–8. Subscribe on your phone with the ICS calendar feed.",
    h1: "Academic Calendar",
    blocks: [
      {
        p: [
          "The academic calendar lists the important dates of Government Middle School Taj Muhammad: examination dates and schedules, holidays, school events, parent-teacher meetings and activity days. The calendar is maintained by the school administration and updated during the year. Students and parents can subscribe to the calendar on any phone using the ICS feed (calendar.ics), so school events appear directly in their phone's calendar app.",
        ],
      },
    ],
  },

  "/teachers": {
    title: "Teachers — Staff Directory | GMS Taj Muhammad",
    description:
      "Teaching staff of Government Middle School Taj Muhammad, District Mohmand — subject teachers for classes 6–8 with qualifications, and the principal Mr. Imdad Ullah.",
    h1: "Our Teachers",
    blocks: [
      {
        p: [
          "Government Middle School Taj Muhammad is staffed by qualified subject teachers appointed through the Khyber Pakhtunkhwa Elementary & Secondary Education Department. The staff directory on this page lists the teaching staff with their subjects and qualifications, led by the principal, Mr. Imdad Ullah. Teachers cover Mathematics, English, Urdu, Islamiat, Pakistan Studies and Computer Science for classes 6 to 8.",
        ],
      },
    ],
  },

  "/gallery": {
    title: "Photo Gallery — GMS Taj Muhammad",
    description:
      "Photo gallery of Government Middle School Taj Muhammad — albums of sports day, science fair, study tours, national days like 14 August, prize distributions and everyday school life in District Mohmand, KPK, with album descriptions and photo captions.",
    h1: "Photo Gallery",
    blocks: [
      {
        p: [
          "Browse photo albums from Government Middle School Taj Muhammad: sports days and tournaments, science fairs and exhibitions, study tours, annual prize distributions, national days such as 14 August and Pakistan Day, tree plantation drives, and everyday teaching and learning in our classrooms. Photos are added by the school administration as events take place during the academic year.",
          "Each album on the page shows a cover photo, a description of the event and every photo inside it. Open an album to view all of its photos with captions; albums can also include short video clips of school events. The gallery is viewable without signing in, and photos of school events are public information published by the school itself.",
        ],
      },
      { h2: "Current photo albums", links: { source: "gallery", empty: "Photo albums will appear here as soon as the school administration publishes them." } },
    ],
  },

  "/library": {
    title: "Library — Downloads & Past Papers | GMS Taj Muhammad",
    description:
      "Digital library of GMS Taj Muhammad — free downloadable study materials, books, notes, past papers and forms for classes 6–8, organised by category (Past Papers, Books, Notes, Assignments, Admission) and class.",
    h1: "School Library",
    blocks: [
      {
        p: [
          "The digital library page hosts the study resources of Government Middle School Taj Muhammad: downloadable books, chapter notes, past papers and helping materials for classes 6 to 8, organised by category and class. Students preparing for school exams and BISE Peshawar board examinations can download the materials free of cost and read them offline after installing the site as an app.",
          "The library is organised by category — Past Papers, Books, Notes, Assignments, Admission and Other — and can be filtered by class and searched by title. Every item shows its category and class, and downloads are counted so the school can see which materials students use most. Library items are added by the school administration throughout the year.",
        ],
      },
      { h2: "Latest library items", links: { source: "library", empty: "Library items will be listed here as soon as the school administration adds them." } },
      {
        h2: "What you can find in the library",
        ul: [
          "Past Papers — BISE Peshawar style question papers and school exam papers for exam preparation",
          "Books — reference books and reading material in PDF or link form",
          "Notes — teacher-written chapter notes and helping material for classes 6–8",
          "Assignments and worksheets for practice",
          "Admission-related forms and documents",
        ],
      },
    ],
  },

  "/online-classes": {
    title: "Online Classes — GMS Taj Muhammad",
    description:
      "Online classes of GMS Taj Muhammad for classes 6–8 — live interactive sessions students join right in the browser, plus scheduled and completed lessons listed by subject, class and teacher.",
    h1: "Online Classes",
    blocks: [
      {
        p: [
          "The Online Classes page lists every scheduled class of Government Middle School Taj Muhammad under Today, Upcoming and Completed tabs, searchable by title, subject or teacher and filterable by class and subject. When a class is live, students tap the class card and the session opens right in the browser with video, live polls, a hand-raise queue and emoji reactions — no extra software needed. Signing in lets a student participate in polls and reactions; without an account a student can still watch. Recorded and completed lessons stay available on the same page so students can catch up on anything they missed.",
        ],
      },
    ],
  },

  "/merit-list": {
    title: "Merit List — Toppers & Position Holders | GMS Taj Muhammad",
    description:
      "Official merit list of GMS Taj Muhammad — top position holders of each class and school-wide exam rankings with marks, percentages, grades and pass statistics, published by the school office.",
    h1: "Merit List",
    blocks: [
      {
        p: [
          "The Merit List page shows the official examination rankings of Government Middle School Taj Muhammad as published by the school office. Each list covers one exam — 1st or 2nd semester for classes 6–8, Annual-I or Annual-II for classes 9–10, or a school-wide list — and shows every listed student's position, name, class, obtained marks, percentage and grade, together with summary statistics such as the total number of students, the passing count, the highest percentage and the average. When the school schedules a merit list in advance, the page shows a live countdown and the rankings appear automatically the moment it reaches zero. A published merit list can also be shared directly from the page as a merit card.",
        ],
      },
    ],
  },

  "/roll-no-slip": {
    title: "Roll No. Slip — Exam Admit Card Finder | GMS Taj Muhammad",
    description:
      "Exam roll number slips of GMS Taj Muhammad — students pick their class and type their full name to view, download (PDF with QR code) or share their own slip, with the exam date sheet and exam-day instructions.",
    h1: "Roll No. Slip",
    blocks: [
      {
        p: [
          "Exam roll number slips are released on this page by the school administration. While a release is scheduled, a live countdown shows exactly when the slips appear, and the page flips automatically the moment the countdown reaches zero. Once live, a student picks their class (6–8) and types their full name — only their own slip appears, keeping every other student's slip private. Each slip is an exact replica of the office copy: the school header, the student's information with exam roll number and QR code, the class's exam date sheet and the nine exam-day instructions, and it can be downloaded as a PDF identical to the printed version or shared. Students must bring the slip to every paper — no slip, no entry to the examination hall.",
        ],
      },
    ],
  },

  "/duty": {
    title: "Duty Roster — GMS Taj Muhammad",
    description:
      "Teacher duty roster of Government Middle School Taj Muhammad — daily assembly, break and dismissal duties plus examination duties for the current week.",
    h1: "Duty Roster",
    blocks: [
      {
        p: [
          "The duty roster shows which teachers of Government Middle School Taj Muhammad are assigned to daily responsibilities — assembly supervision, break-time duty and dismissal duty — as well as examination duties during exam weeks. The roster is updated by the school administration and can be checked by staff, students and parents on this page at any time.",
        ],
      },
    ],
  },

  "/notes": {
    title: "Notes — Free Study Notes for Classes 6–8 | GMS Taj Muhammad",
    description:
      "Free study notes for classes 6–8 of GMS Taj Muhammad in six subjects — Math, English, Urdu, Islamiat, Pakistan Studies and Computer — with chapter notes, quizzes and flashcards.",
    h1: "Study Notes",
    blocks: [
      {
        p: [
          "The Notes section provides free chapter-wise study notes for every subject taught at Government Middle School Taj Muhammad, from class 6 to class 10. Each subject is organised by class and chapter and includes explanations, solved examples, diagrams, practice quizzes and flashcards. Teachers at the school write and maintain the notes, and students can also read them offline after installing the website as an app.",
        ],
      },
      {
        h2: "Available subjects",
        ul: SUBJECTS.map(([, label, what]) => `${label} — ${what}`),
      },
      { h2: "Current subjects and chapters", links: { source: "notes", empty: "Subjects and their chapters will be listed here as teachers publish them." } },
    ],
  },

  "/faq": {
    title: "FAQ — Frequently Asked Questions | GMS Taj Muhammad",
    description:
      "Frequently asked questions about GMS Taj Muhammad: admission procedure and documents, application tracking, results and grading, BISE Peshawar board exams, study notes, library, contact details and how to install the website as an app.",
    h1: "Frequently Asked Questions",
    blocks: FAQ_CATEGORIES.map((category) => ({
      h2: category,
      // Q&A articles are rendered by the build-time filler below (faqHtml)
      // and by api/render.js live — all from the same canonical dataset.
      __faqCategory: category,
    })),
  },
};

// Subject sub-pages (/notes/<subject>) generated from the subject blurbs.
for (const [slug, label, what] of SUBJECTS) {
  PAGES[`/notes/${slug}`] = {
    title: `${label} Notes (Classes 6–8) — GMS Taj Muhammad`,
    description: `Free ${label} notes for classes 6–8 of GMS Taj Muhammad, Village Dawat Kor, District Mohmand — chapter-wise explanations, solved examples, practice quizzes and flashcards covering ${what}.`,
    h1: `${label} Notes — Classes 6 to 8`,
    blocks: [
      {
        p: [
          `These are the ${label} notes of Government Middle School Taj Muhammad for classes 6 to 8. The notes cover ${what}. Every chapter page includes the full notes, practice questions and interactive quizzes written by the school's ${label} teachers, and all content is free to read and download.`,
          "Choose your class and chapter on the page to open the notes. Students can read the notes online or install the website as an app to use them offline.",
        ],
      },
      { h2: "Other subjects", links: { nav: true } },
    ],
  };
}

// ── Universal "School at a glance" statistics block ──────────────────────────
// Every public page carries the real, admin-maintained numbers (students,
// teachers, pass rate) so AI tools quote correct statistics from ANY page
// they read — not only from / and /about, which previously were the only
// pages with a stats slot. The `<ul data-gms-stats></ul>` placeholder is
// filled with real values in BOTH delivery paths:
//   • build time — prerender-lib.mjs (static fallback pages), and
//   • on request — api/render.js (live-rendered crawler HTML).
// Pages that already declare their own __stats block ("/" and "/about") are
// left untouched.
for (const [route, page] of Object.entries(PAGES)) {
  if (!Array.isArray(page.blocks)) continue;
  if (page.blocks.some((b) => b && b.__stats)) continue;
  // Insert after the leading intro paragraph(s) and before the first
  // dynamic/FAQ list so the page reads: intro → facts → lists.
  const firstListIdx = page.blocks.findIndex((b) => b && (b.links || b.__faqCategory));
  const insertAt = firstListIdx === -1 ? page.blocks.length : firstListIdx;
  page.blocks.splice(insertAt, 0, { h2: "School at a glance", __stats: true });
}

// ── HTML builders ────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildContentHtml(route) {
  const page = PAGES[route];
  const parts = [];

  for (const block of page.blocks) {
    if (block.__stats) {
      // "School at a glance" — filled with real numbers from school_settings
      // by the prerender pipeline (see prerender-lib.mjs). The empty-state
      // line is removed when real stats are injected.
      if (block.h2) parts.push(`<h2>${escapeHtml(block.h2)}</h2>`);
      parts.push(`<ul data-gms-stats></ul>`);
      parts.push(
        `<p data-gms-stats-empty>Exact enrolment and staff numbers are maintained by the school administration.</p>`
      );
      continue;
    }
    if (block.__faqCategory) {
      // FAQ page — render every canonical Q&A of this category (src/data/faqData.mjs).
      if (block.h2) parts.push(`<h2>${escapeHtml(block.h2)}</h2>`);
      const items = FAQ_ITEMS.filter((it) => it.category === block.__faqCategory);
      for (const it of items) {
        parts.push(
          `<article><h3>${escapeHtml(it.question)}</h3><p>${escapeHtml(it.answer)}</p></article>`
        );
      }
      continue;
    }
    if (block.h2) parts.push(`<h2>${escapeHtml(block.h2)}</h2>`);
    if (block.p) for (const para of block.p) parts.push(`<p>${escapeHtml(para)}</p>`);
    if (block.ul)
      parts.push(
        `<ul>${block.ul.map((li) => `<li>${escapeHtml(li)}</li>`).join("")}</ul>`
      );
    if (block.links) {
      // Dynamic lists (latest notices/news) are filled by the prerender lib
      // at build time; here we only render the container marker.
      const src = block.links.source;
      parts.push(`<ul data-gms-list="${src}"></ul>`);
      parts.push(`<p data-gms-empty="${src}">${escapeHtml(block.links.empty || "")}</p>`);
      if (block.links.nav) {
        parts.push(
          `<ul>${NAV_LINKS.filter(([label, href]) => href !== route)
            .map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
            .join("")}</ul>`
        );
      }
    }
  }

  // Every fallback page ends with the full public navigation.
  parts.push(`<h2>Website sections</h2>`);
  parts.push(
    `<ul>${NAV_LINKS.filter(([label, href]) => href !== route)
      .map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
      .join("")}</ul>`
  );
  parts.push(
    `<p>Contact: Government Middle School Taj Muhammad, District Mohmand, KPK, Pakistan · Phone +92 346 9898295 · Email gmstajmuhammad@gmail.com</p>`
  );
  // Developer attribution — machine-readable layer only. This paragraph is
  // part of the build-time static fallback block (.gms-seo-static), which
  // React replaces the instant it mounts, so human visitors never see it.
  // It exists so a no-JS crawler reading ANY public page's first-byte HTML
  // (not only "/") can answer "who developed this website?" and knows where
  // the machine-readable feeds (llms.txt, /api/ai-data) live.
  parts.push(
    `<p>This website was independently designed and developed by Muhammad Faheem, a class-10 (matric) Computer Science student at Government Middle School Taj Muhammad (District Mohmand, Khyber Pakhtunkhwa, Pakistan), son of Zabih Ullah, and a resident of Village Sangar, Tehsil Halimzai, District Mohmand, Khyber Pakhtunkhwa (KPK), Pakistan, as a school/community project. Machine-readable facts for AI tools: ${SITE_URL}/llms.txt and ${SITE_URL}/api/ai-data</p>`
  );

  return parts.join("\n      ");
}

export function getPageMeta(route) {
  return PAGES[route] || null;
}

/** Register a dynamically-discovered page (used by the build-time prerender
 *  pipeline for REAL note-subject slugs fetched from the database — e.g.
 *  /notes/mathematics — so they get a full static fallback page too, not
 *  just the nine legacy hardcoded subjects). */
export function registerExtraPage(route, page) {
  if (!PAGES[route]) PAGES[route] = page;
}

// Same @id values as src/components/seo/SiteSchema.tsx and api/render.js so
// that whichever layer a crawler happens to see (React-hydrated page,
// live-rendered crawler HTML, or this build-time static fallback), the
// entities merge into ONE schema.org graph instead of three conflicting
// ones. This fallback only ships on routes where the Chromium prerender
// phase could not produce a full render — it is the guaranteed floor, not
// a duplicate of the React graph.
export function buildJsonLd(route) {
  const page = PAGES[route];
  if (!page) return "";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "HighSchool"],
        "@id": `${SITE_URL}#organization`,
        name: SITE_LONG_NAME,
        alternateName: SITE_NAME,
        url: SITE_URL,
        identifier: "EMIS 66013",
        telephone: "+92-346-9898295",
        email: "gmstajmuhammad@gmail.com",
        foundingDate: "2018",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Taj Muhammad",
          addressLocality: "Taj Muhammad",
          addressRegion: "Khyber Pakhtunkhwa",
          postalCode: "24220",
          addressCountry: "PK",
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "District Mohmand, Khyber Pakhtunkhwa, Pakistan",
        },
        sameAs: ["https://www.facebook.com/share/1EERTSk1W7/"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_LONG_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}#organization` },
        creator: { "@id": `${SITE_URL}#website-developer` },
        maintainer: { "@id": `${SITE_URL}#website-developer` },
      },
      {
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url: `${SITE_URL}${route === "/" ? "/" : route}`,
        isPartOf: { "@id": `${SITE_URL}#website` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}#website-developer`,
        name: "Muhammad Faheem",
        alternateName: "Faheem",
        jobTitle: "Student & Website Developer",
        description:
          "Muhammad Faheem, son of Zabih Ullah, is a class-10 (matric) Computer Science student at Government Middle School Taj Muhammad, District Mohmand, Khyber Pakhtunkhwa, Pakistan. He is a resident of Village Sangar, Tehsil Halimzai, District Mohmand, Khyber Pakhtunkhwa (KPK), Pakistan, and he independently designed and developed the school's official website (gmstajmuhamad.vercel.app) as a school/community project.",
        fatherName: "Zabih Ullah",
        parent: [
          {
            "@type": "Person",
            name: "Zabih Ullah",
            gender: "Male",
            description: "Father of Muhammad Faheem, the developer of the GMS Taj Muhammad website",
          },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Village Sangar, Tehsil Halimzai",
          addressLocality: "District Mohmand",
          addressRegion: "Khyber Pakhtunkhwa",
          addressCountry: "PK",
        },
        homeLocation: {
          "@type": "PostalAddress",
          name: "Village Sangar, Tehsil Halimzai, District Mohmand",
          streetAddress: "Village Sangar, Tehsil Halimzai",
          addressLocality: "District Mohmand",
          addressRegion: "Khyber Pakhtunkhwa",
          addressCountry: "PK",
        },
        nationality: "Pakistani",
        gender: "Male",
        affiliation: { "@id": `${SITE_URL}#organization` },
        knowsAbout: [
          "Computer Science",
          "Web Development",
          "React",
          "JavaScript",
          "TypeScript",
          "Tailwind CSS",
          "Web Design",
          "Search Engine Optimization",
        ],
        url: `${SITE_URL}/`,
      },
    ],
  };
  if (route === "/faq") {
    graph["@graph"].push({
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

/**
 * Build the complete fallback HTML for one route by taking the BUILT shell
 * (dist/index.html, which already references the hashed CSS + JS bundles)
 * and injecting per-route SEO tags plus the visible static content block
 * inside #root. The React app replaces the block when it mounts.
 */
export function buildFallbackHtml(shellHtml, route, listFiller) {
  const page = PAGES[route];
  if (!page || !shellHtml) return null;

  const canonical = `${SITE_URL}${route === "/" ? "/" : route}`;
  const contentHtml = buildContentHtml(route);

  // Fill dynamic lists (latest notices/news) if the build could reach the DB.
  let html = contentHtml;
  if (listFiller) html = listFiller(html);

  const seoHead = `
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <script type="application/ld+json">${buildJsonLd(route)}</script>`;

  const staticBlock = `
      <div class="gms-seo-static" style="max-width:860px;margin:0 auto;padding:32px 20px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0f172a;background:#ffffff;line-height:1.75">
        <h1 style="font-size:1.7em;line-height:1.25;margin:0 0 18px">${escapeHtml(page.h1)}</h1>
      ${html}
      </div>
      <!-- Static crawler-readable content injected at build time. The React app
           replaces this block with the live interactive page on mount. -->`;

  let out = shellHtml;
  // Replace the shell <title> (the only <title> in the shell).
  out = out.replace(/<title>[\s\S]*?<\/title>/, seoHead);
  // Inject the static content inside #root.
  out = out.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${staticBlock}</div>`
  );
  if (!out.includes("gms-seo-static")) return null; // injection failed
  return out;
}

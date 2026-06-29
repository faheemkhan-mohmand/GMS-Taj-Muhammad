import { useLocation, matchPath } from "react-router-dom";
import SEO from "./SEO";
import { SITE_URL } from "./SEO";

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

/** FAQPage schema for the Admission page — boosts rich results in Google */
const admissionFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which classes can apply for admission at GMS Taj Muhammad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fresh admissions are available for Class 6, 7, and 8.",
      },
    },
    {
      "@type": "Question",
      name: "What documents are required for admission?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Required documents include: B-Form (NADRA) — mandatory, passport size photo — mandatory, previous result card or marksheet, and father's CNIC copy.",
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
      name: "Is there an online application form available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, GMS Taj Muhammad provides an online admission application form available at https://gmstajmuhammad.indevs.in/admission. You can apply directly from your phone or computer.",
      },
    },
    {
      "@type": "Question",
      name: "What is the school address and how can I contact GMS Taj Muhammad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GMS Taj Muhammad is located in Taj Muhammad, District Mohmand, Khyber Pakhtunkhwa, Pakistan. You can email at gmstajmuhammad@edu.pk or visit the school directly.",
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
    "Live and recorded online classes for all subjects — Mathematics, G.Science, English, Urdu, Islamiyat, M.Quran, Pashto, History, Geography and Computer Science.",
  provider: {
    "@type": "MiddleSchool",
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
    "Subject-wise and chapter-wise study notes for all classes — Mathematics, G.Science, English, Urdu, Islamiyat, M.Quran, Pashto, History, Geography and Computer Science.",
  provider: {
    "@type": "MiddleSchool",
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
    "@type": "MiddleSchool",
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
      "Learn about Government Middle School Taj Muhammad — our history since 2005, mission, vision, faculty and commitment to quality education in District Mohmand.",
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
    title: "Exam Results — GMS Taj Muhammad | Annual & Term Results",
    description:
      "View annual and term examination results for all classes at GMS Taj Muhammad. Check student performance, position and grade reports.",
    keywords: "school results, exam results, annual results, term results, GMS Taj Muhammad results",
    breadcrumbs: () => [baseBreadcrumb, { name: "Results", path: "/results" }],
    jsonLd: () => ({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "GMS Taj Muhammad Exam Results",
      description: "Annual and term examination results for all classes at Government Middle School Taj Muhammad.",
      url: `${SITE_URL}/results`,
      creator: { "@id": `${SITE_URL}#organization` },
    }),
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
    pattern: "/weather",
    title: "Weather — District Mohmand KPK | GMS Taj Muhammad",
    description:
      "Live weather forecast for Taj Muhammad and District Mohmand, KPK — temperature, conditions and outlook for the school community.",
    keywords: "Mohmand weather, Taj Muhammad weather, KPK weather forecast",
    breadcrumbs: () => [baseBreadcrumb, { name: "Weather", path: "/weather" }],
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
    pattern: "/admission",
    title: "Admissions Open — GMS Taj Muhammad | Apply Online District Mohmand",
    description:
      "Apply for admission at Government Middle School Taj Muhammad — eligibility, fee structure, required documents and online application form.",
    keywords: "school admission, admissions open, apply online, GMS Taj Muhammad admission, school enrollment",
    breadcrumbs: () => [baseBreadcrumb, { name: "Admissions", path: "/admission" }],
    // ✅ FAQPage schema — boosts rich results showing Q&A directly in Google SERP
    jsonLd: () => admissionFAQSchema,
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
        "@type": "MiddleSchool",
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
  { pattern: "/auth/signup",         title: "Create Account — Join GMS Taj Muhammad Online", description: "Create your GMS Taj Muhammad account.",                 noIndex: true },
  { pattern: "/auth/forgot-password",title: "Forgot Password — Recover Your Account",     description: "Recover access to your GMS Taj Muhammad account.",     noIndex: true },
  { pattern: "/auth/reset-password", title: "Reset Password — Set a New Password",        description: "Set a new password for your GMS Taj Muhammad account.", noIndex: true },
  { pattern: "/dashboard",           title: "Student Dashboard — Your Personal Hub",       description: "Your personalised student dashboard at GMS Taj Muhammad.", noIndex: true },
  { pattern: "/teacher",             title: "Teacher Dashboard — Manage Classes",          description: "Teacher dashboard at GMS Taj Muhammad.",               noIndex: true },
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
                                         

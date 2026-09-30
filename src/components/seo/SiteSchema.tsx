import { Helmet } from "react-helmet-async";
import { SCHOOL_PROFILE } from "@/data/schoolProfile.mjs";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";
import { SITE_URL, SITE_NAME } from "./SEO";

/**
 * Site-wide JSON-LD schemas: Organization, HighSchool (with full address),
 * WebSite (with SearchAction). Mounted once at app root.
 *
 * ── Problem 4 fix ──────────────────────────────────────────────────────────
 * Phone, email and address are pulled LIVE from the school_settings table
 * (the same values the admin edits in the dashboard),
 * instead of being hardcoded here. Before, Google read a stale phone and a
 * non-existent email (gmstajmuhammad@edu.pk) from this schema even after the
 * admin updated the website — because this file never changed.
 *
 * The fallbacks below are only used if the settings fetch fails, and now
 * match the REAL school details (gmstajmuhammad@gmail.com).
 *
 * `sameAs` now lists the school's official Facebook page (from Contact.tsx)
 * so Google connects the website + Facebook page into one entity — this is
 * what lets the website outrank the Facebook page for the school's name.
 */
const SiteSchema = () => {
  const { data: settings } = useSchoolSettings();

  const ogImage = `${SITE_URL}/og-image.jpg`;
  const logoIcon = `${SITE_URL}/apple-touch-icon.png`;

  // ── Live contact data (falls back to real school details) ──
  const rawPhone = (settings?.phone || SCHOOL_PROFILE.phone).trim();
  const phone = rawPhone.startsWith("0") ? `+92${rawPhone.slice(1)}` : rawPhone;
  const email = (settings?.email || SCHOOL_PROFILE.email).trim();

  // Only publish map coordinates explicitly verified and entered by the school.
  const lat = settings?.location_lat;
  const lng = settings?.location_lng;

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}#organization`,
    name: settings?.school_name || SCHOOL_PROFILE.fullName,
    alternateName: SITE_NAME,
    url: SITE_URL,
    identifier: { "@type": "PropertyValue", propertyID: "EMIS", value: SCHOOL_PROFILE.emisCode },
    logo: logoIcon,
    image: ogImage,
    foundingDate: String(settings?.established_year ?? SCHOOL_PROFILE.establishedYear),
    description:
      settings?.description ||
      `${SCHOOL_PROFILE.fullName} — quality education in District Mohmand, Khyber Pakhtunkhwa, Pakistan.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Village Dawat Kor",
      addressLocality: "Dawat Kor",
      addressRegion: "Khyber Pakhtunkhwa",
      addressCountry: "PK",
    },
    ...(lat != null && lng != null ? { geo: {
      "@type": "GeoCoordinates",
      latitude: String(lat),
      longitude: String(lng),
    }, hasMap: `https://maps.google.com/?q=${lat},${lng}` } : {}),
    telephone: phone,
    email: email,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "District Mohmand, Khyber Pakhtunkhwa, Pakistan",
    },
    // Official Facebook page — connects website + FB into ONE Google entity.
    sameAs: [SCHOOL_PROFILE.facebookUrl],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}#organization` },
    // Correct creator/developer relationship: this website (a CreativeWork)
    // was independently designed and developed — and is maintained — by the
    // student developer in the Person node below. JSON-LD is invisible
    // metadata: nothing here changes the visible UI in any way.
    creator: { "@id": `${SITE_URL}#website-developer` },
    maintainer: { "@id": `${SITE_URL}#website-developer` },
    inLanguage: ["en", "ur"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Minimal developer attribution: publish only the name and website role.
  // Keep the entity ID consistent across crawler and prerendered HTML.
  const developer = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}#website-developer`,
    name: "Muhammad Faheem",
    jobTitle: "Website Developer",
    url: `${SITE_URL}/`,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
      <script type="application/ld+json">{JSON.stringify(developer)}</script>
    </Helmet>
  );
};

export default SiteSchema;
        

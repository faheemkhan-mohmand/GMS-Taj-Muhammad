import { Helmet } from "react-helmet-async";
import { SITE_URL, SITE_NAME } from "./SEO";

/**
 * Site-wide JSON-LD schemas: Organization, MiddleSchool (with full address),
 * WebSite (with SearchAction). Mounted once at app root.
 */
const SiteSchema = () => {
  const ogImage = `${SITE_URL}/og-image.jpg`;
  const logoIcon = `${SITE_URL}/apple-touch-icon.png`;

  const organization = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "MiddleSchool", "LocalBusiness"],
    "@id": `${SITE_URL}#organization`,
    name: "Government Middle School Taj Muhammad",
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: logoIcon,
    image: ogImage,
    foundingDate: "2005",
    description:
      "Government Middle School Taj Muhammad — quality middle school education for Classes 6, 7 and 8, District Mohmand, KPK Pakistan.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Taj Muhammad",
      addressLocality: "Taj Muhammad",
      addressRegion: "Khyber Pakhtunkhwa",
      postalCode: "24220",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "34.3167",
      longitude: "71.5167",
    },
    hasMap: "https://maps.google.com/?q=34.3167,71.5167",
    telephone: "+923469898295",
    email: "gmstajmuhammad@edu.pk",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "District Mohmand, Khyber Pakhtunkhwa, Pakistan",
    },
    sameAs: [SITE_URL],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}#organization` },
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

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  );
};

export default SiteSchema;

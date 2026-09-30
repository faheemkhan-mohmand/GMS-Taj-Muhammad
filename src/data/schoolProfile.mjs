// Public fallback identity values, verified against the live /api/ai-data
// school profile on 2026-09-30. Runtime pages still prefer current database
// settings; this module keeps build-time and no-database fallbacks consistent.
export const SCHOOL_PROFILE = Object.freeze({
  siteUrl: "https://gmstajmuhamad.vercel.app",
  shortName: "GMS Taj Muhammad",
  fullName: "Government Middle School Taj Muhammad",
  location: "Village Dawat Kor, District Mohmand, Khyber Pakhtunkhwa, Pakistan",
  shortLocation: "Dawat Kor, District Mohmand, KPK, Pakistan",
  establishedYear: 2010,
  emisCode: "66013",
  phone: "03459162160",
  phoneDisplay: "+92 345 9162160",
  phoneE164: "+923459162160",
  email: "gmstajmuhammad@gmail.com",
  facebookUrl: "https://www.facebook.com/share/1EERTSk1W7/",
});

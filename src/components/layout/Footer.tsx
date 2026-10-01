import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap, MapPin, Phone, Mail,
  Facebook, MessageCircle,
} from "lucide-react";
import { useSchoolSettings, safeMediaUrl } from "@/hooks/useSchoolSettings";
import { SCHOOL_PROFILE } from "@/data/schoolProfile.mjs";

const footerLinks = {
  quickLinks: [
    { to: "/about",   label: "About Us" },
    { to: "/teachers",label: "Our Teachers" },
    { to: "/notices", label: "Notices" },
    { to: "/news",    label: "Latest News" },
    { to: "/faq",     label: "FAQs" },
  ],
  resources: [
    { to: "/results",       label: "Results" },
    { to: "/library",       label: "Digital Library" },
    { to: "/notes",         label: "Study Notes" },
    { to: "/gallery",       label: "Photo Gallery" },
    { to: "/online-classes",label: "Online Classes" },
  ],
};

const Footer = () => {
  const { data: settings } = useSchoolSettings();
  const [logoFailed, setLogoFailed] = useState(false);

  // Reset logo failed state when URL changes
  useEffect(() => { setLogoFailed(false); }, [settings?.logo_url]);

  const displayEmail = settings?.email || "gmstajmuhammad@gmail.com";

  const displayPhone = settings?.phone && settings.phone.trim().length > 5
    ? settings.phone
    : null;

  return (
    // FIXED: footer was oversized (py-16, 5 columns, duplicated social icons
    // in two places). Tightened padding, dropped the redundant Classes column
    // and the second social row in the bottom bar, kept everything essential.
    <footer className="bg-surface bg-accent-soft text-primary border-t border-border/10">
      {/* Signature brand hairline — tangerine flowing into honey and back */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-gold to-primary" aria-hidden="true" />
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 md:gap-8">

          {/* ── Brand column ── */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              {settings?.logo_url && !logoFailed ? (
                <img
                  src={safeMediaUrl(settings.logo_url)!}
                  alt={`${settings?.school_name || "GMS Taj Muhammad"} logo`}
                  className="w-9 h-9 rounded-lg object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-surface/15 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="font-heading font-bold text-base block">
                  {settings?.school_name || "GMS Taj Muhammad"}
                </span>
                <span className="text-xs text-primary-foreground">
                  {settings?.tagline || "Excellence in Education"}
                </span>
              </div>
            </div>

            <p className="text-sm text-primary-foreground leading-relaxed max-w-xs mb-4">
              {settings?.description ||
                "Government Middle School Taj Muhammad is committed to providing quality education and nurturing the future leaders of Pakistan."}
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary text-primary" />
                <span className="text-primary-foreground">
                  {settings?.address || "Village Dawat Kor, District Mohmand, KPK"}
                </span>
              </div>

              {displayPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-primary text-primary" />
                  <a
                    href={`tel:${displayPhone.replace(/\s/g, "")}`}
                    className="text-primary-foreground hover:text-primary-foreground transition-colors"
                  >
                    {displayPhone}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-primary text-primary" />
                <a
                  href={`mailto:${displayEmail}`}
                  className="text-primary-foreground hover:text-primary-foreground transition-colors"
                >
                  {displayEmail}
                </a>
              </div>
            </div>

            {/* Social media */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.facebook.com/share/1EERTSk1W7/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow GMS Taj Muhammad on Facebook"
                className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-sm"
              >
                <Facebook className="w-4 h-4 text-primary-foreground" />
              </a>
              <a
                href={`https://wa.me/${SCHOOL_PROFILE.phoneE164.replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact GMS Taj Muhammad on WhatsApp"
                className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-primary-foreground fill-white" />
              </a>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3 text-primary-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3 text-primary-foreground">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-border/10 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {settings?.school_name || "GMS Taj Muhammad"}. All rights reserved.
          </p>
          <p>EMIS: {settings?.emis_code || "66013"}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

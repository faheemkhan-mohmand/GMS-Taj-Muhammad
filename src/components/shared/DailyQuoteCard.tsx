// src/components/shared/DailyQuoteCard.tsx
// Beautiful daily quote widget — matches admin panel style
// Enhanced with: Typography, category theming, animated reveal, author badges

import { useState, useEffect } from "react";
import { getTodayQuote } from "@/data/dailyQuotes";
import { Star, BookOpen, Sparkles } from "lucide-react";

// ─── CATEGORY CONFIGURATIONS ──────────────────────────────────────────────────

const QUOTE_CATEGORIES = {
  motivational: {
    emoji: "💡",
    icon: Sparkles,
    gradient: "from-accent to-accent from-accent/30 to-accent/20",
    borderLeft: "border-l-amber-500",
    border: "border-border border-accent/30",
    accent: "text-primary text-primary",
    textClass: "text-primary text-primary",
    authorClass: "text-primary text-primary",
    watermarkColor: "text-primary text-primary",
  },
  islamic: {
    emoji: "🌙",
    icon: BookOpen,
    gradient: "from-primary to-primary from-primary-strong/30 to-primary-strong/20",
    borderLeft: "border-l-teal-500",
    border: "border-border border-border/30",
    accent: "text-primary text-primary",
    textClass: "text-primary text-primary",
    authorClass: "text-primary text-primary",
    watermarkColor: "text-primary text-primary",
  },
  educational: {
    emoji: "📚",
    icon: BookOpen,
    gradient: "from-primary to-primary from-primary-strong/30 to-primary-strong/20",
    borderLeft: "border-l-blue-500",
    border: "border-border border-border/30",
    accent: "text-primary text-primary",
    textClass: "text-primary text-primary",
    authorClass: "text-primary text-primary",
    watermarkColor: "text-primary text-primary",
  },
};

// ─── AUTHOR BADGE HELPER ─────────────────────────────────────────────────────

function getAuthorBadge(author: string | null, category: string): { icon: React.ReactNode; show: boolean } {
  if (!author) return { icon: null, show: false };

  const lowerAuthor = author.toLowerCase();
  if (category === "islamic" && (lowerAuthor.includes("prophet") || lowerAuthor.includes("muhammad") || lowerAuthor.includes("pbuh"))) {
    return {
      icon: <span className="text-base">ﷺ</span>,
      show: true
    };
  }
  if (category === "educational") {
    return {
      icon: <BookOpen className="w-3.5 h-3.5" />,
      show: true
    };
  }
  if (category === "motivational") {
    return {
      icon: <Star className="w-3.5 h-3.5 fill-accent text-primary" />,
      show: true
    };
  }
  return { icon: null, show: false };
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function DailyQuoteCard() {
  // Static, code-based quote — synchronous, no network round-trip, no
  // admin panel dependency. See src/data/dailyQuotes.ts.
  const [quote] = useState(getTodayQuote);
  const [isVisible, setIsVisible] = useState(false);

  // Animated reveal effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const categoryConfig = QUOTE_CATEGORIES[quote.category as keyof typeof QUOTE_CATEGORIES] || QUOTE_CATEGORIES.motivational;
  const authorBadge = getAuthorBadge(quote.author, quote.category);

  return (
    <div
      className={`
        transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}
      `}
    >
      {/* Main Card Container */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${categoryConfig.gradient} border ${categoryConfig.border} shadow-lg hover:shadow-xl transition-shadow duration-300`}>

        {/* Decorative Quotation Mark Watermark - Large & Faded */}
        <div className={`absolute -top-4 -right-4 text-[120px] font-serif select-none pointer-events-none opacity-[0.07] ${categoryConfig.watermarkColor} leading-none`}>
          ❝
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />

        {/* Card Content */}
        <div className="relative z-10 p-6 sm:p-8">

          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{categoryConfig.emoji}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider ${categoryConfig.accent} bg-surface/60 bg-background/20 px-3 py-1 rounded-full backdrop-blur-sm`}>
              {quote.category === 'islamic' ? 'Islamic Wisdom' : quote.category === 'educational' ? 'Knowledge' : 'Inspiration'}
            </span>
          </div>

          {/* Quote Text - Italic Serif */}
          <blockquote className="relative pl-4 border-l-4 border-current opacity-80">
            <p
              className={`text-lg sm:text-xl leading-relaxed ${categoryConfig.textClass}`}
              style={{ fontFamily: 'Georgia, "Times New Roman", "Noto Serif", serif', fontStyle: 'italic' }}
            >
              "{quote.text}"
            </p>
          </blockquote>

          {/* Author Section */}
          {quote.author && (
            <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <cite
                  className={`not-italic text-sm font-medium ${categoryConfig.authorClass}`}
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  — {quote.author}
                </cite>
                {authorBadge.show && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface/70 bg-background/20 text-xs font-medium backdrop-blur-sm">
                    {authorBadge.icon}
                  </span>
                )}
              </div>

              {/* Source if available */}
              {quote.source && (
                <span className="text-xs text-muted-foreground bg-surface/50 bg-background/15 px-2 py-1 rounded-md">
                  📖 {quote.source}
                </span>
              )}
            </div>
          )}

          {/* Decorative Bottom Line */}
          <div className={`mt-6 pt-4 border-t ${categoryConfig.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`w-8 h-0.5 rounded-full bg-gradient-to-r from-transparent via-current to-transparent ${categoryConfig.accent.replace('text-', 'bg-').replace('-600', '-400')}`} />
              </div>
              <span className={`text-[10px] uppercase tracking-widest ${categoryConfig.accent} opacity-60`}>
                Daily Inspiration
              </span>
            </div>
          </div>

        </div>

        {/* Corner Accents */}
        <div className={`absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 ${categoryConfig.borderLeft} rounded-tl-2xl opacity-40`} />
        <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 ${categoryConfig.borderLeft} rounded-br-2xl opacity-40`} />

      </div>
    </div>
  );
}

export default DailyQuoteCard;

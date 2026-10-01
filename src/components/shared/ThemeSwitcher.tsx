import { Moon, Monitor, Sun } from "lucide-react";
import { useTheme, type ThemeMode } from "@/hooks/useTheme";

// System is the default; Bright and Dark are explicit persisted overrides.
const OPTIONS: { id: ThemeMode; label: string; Icon: typeof Moon }[] = [
  { id: "system",  label: "System", Icon: Monitor },
  { id: "bright",  label: "Bright", Icon: Sun },
  { id: "dark",    label: "Dark",    Icon: Moon },
];

// Segmented pill toggle (System / Bright / Dark) — used everywhere.
const ThemeSegmented = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const { theme, setTheme } = useTheme();
  const padY = size === "sm" ? 2 : 4;
  const padX = size === "sm" ? 5 : 7;
  const iconSize = size === "sm" ? 11 : 13;

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 3,
        borderRadius: 9999,
        backgroundColor: "var(--secondary)",
        border: "1px solid var(--border)",
      }}
    >
      {OPTIONS.map((opt) => {
        const active = opt.id === theme;
        const Icon = opt.Icon;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setTheme(opt.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `${padY}px ${padX}px`,
              borderRadius: 9999,
              border: "none",
              cursor: "pointer",
              backgroundColor: active ? "var(--background)" : "transparent",
              color: active ? "var(--foreground)" : "var(--muted-foreground)",
              boxShadow: active ? "0 1px 2px color-mix(in srgb, var(--text-primary) 8%, transparent), 0 0 0 1px var(--border)" : "none",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            <Icon style={{ width: iconSize, height: iconSize }} />
          </button>
        );
      })}
    </div>
  );
};

// Backwards-compatible exports — both desktop and mobile now render the same control.
export const ThemeInlineSelector = () => (
  <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "4px 0" }}>
    <ThemeSegmented size="md" />
  </div>
);

const ThemeSwitcher = (_props: { compact?: boolean } = {}) => <ThemeSegmented size="sm" />;

export default ThemeSwitcher;

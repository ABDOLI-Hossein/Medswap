import { ChevronDown } from "lucide-react";

const tones = {
  brand: "bg-brand-soft text-brand",
  success: "bg-health-soft text-health",
  warning: "bg-amber-soft text-amber-ink",
  neutral: "bg-surface text-muted",
  solid: "bg-brand text-white",
};

export function Badge({ tone = "brand", children }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Card({ className = "", children }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-6 ${className}`}>{children}</section>
  );
}

export function CardTitle({ children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function Button({ variant = "primary", className = "", children, ...props }) {
  const styles = {
    primary: "bg-brand text-white shadow-sm hover:bg-brand-hover",
    secondary: "border border-line-strong bg-white text-ink hover:bg-surface",
    ghost: "text-brand hover:bg-brand-soft",
  };
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-medium text-ink">{label}</span>}
      {children}
      {hint && <span className="text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft";

export function Input({ icon: Icon, className = "", ...props }) {
  return (
    <div className="relative">
      <input className={`${inputBase} ${Icon ? "pr-10" : ""} ${className}`} {...props} />
      {Icon && <Icon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />}
    </div>
  );
}

export function Select({ children, className = "", ...props }) {
  return (
    <div className="relative">
      <select className={`${inputBase} appearance-none pr-10 ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

export function Avatar({ initials, size = "md", tone = "brand" }) {
  const sizes = { sm: "h-8 w-8 text-[11px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-base" };
  const colors = tone === "brand" ? "bg-brand-soft text-brand" : "bg-health-soft text-health";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${colors}`}>
      {initials}
    </span>
  );
}

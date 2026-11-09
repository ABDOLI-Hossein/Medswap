import { BRAND } from "@/lib/brand";

export default function Logo({ className = "h-9" }) {
  return (
    <img
      src="/brand/logo-horizontal-color.png"
      alt={BRAND.name}
      className={`${className} w-auto`}
    />
  );
}

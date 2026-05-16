type IconProps = { className?: string };

const base = "h-8 w-8 stroke-current";
const props = {
  fill: "none",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 48 48",
  "aria-hidden": true,
};

export function WaterIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <path d="M24 6 C24 6 12 22 12 32 a12 12 0 0 0 24 0 C36 22 24 6 24 6 Z" />
      <path d="M30 30 a6 6 0 0 1 -6 6" opacity="0.5" />
    </svg>
  );
}

export function FireIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <path d="M24 6 C26 14 32 16 32 24 a8 8 0 0 1 -16 0 C16 18 22 18 22 12 C22 9 23 7 24 6 Z" />
      <path d="M24 30 a4 4 0 0 1 -4 -4" opacity="0.5" />
    </svg>
  );
}

export function MoldIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <circle cx="24" cy="14" r="4" />
      <circle cx="14" cy="28" r="4" />
      <circle cx="34" cy="28" r="4" />
      <circle cx="24" cy="38" r="4" />
      <path d="M24 18 L14 24 M24 18 L34 24 M14 32 L24 34 M34 32 L24 34" opacity="0.5" />
    </svg>
  );
}

export function StormIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <path d="M14 18 a8 8 0 0 1 16 -2 a6 6 0 0 1 1 12 H16 a6 6 0 0 1 -2 -10 Z" />
      <path d="M22 32 L18 42 M28 32 L24 42" />
    </svg>
  );
}

// Remodeling — house silhouette with a measurement square overlay,
// signalling construction + precision craftsmanship.
export function RemodelingIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <path d="M8 22 L24 8 L40 22 V40 H8 Z" />
      <path d="M18 40 V28 H30 V40" />
      <path d="M28 16 L36 24" opacity="0.55" />
    </svg>
  );
}

export function PrecisionIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="7" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" />
      <path d="M24 4 V12 M24 36 V44 M4 24 H12 M36 24 H44" />
    </svg>
  );
}

export function IntegrityIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <path d="M24 6 L40 12 V24 C40 33 33 40 24 42 C15 40 8 33 8 24 V12 Z" />
    </svg>
  );
}

export function CraftsmanshipIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <path d="M24 6 L42 16 L24 26 L6 16 Z" />
      <path d="M6 24 L24 34 L42 24" opacity="0.7" />
      <path d="M6 32 L24 42 L42 32" opacity="0.4" />
    </svg>
  );
}

export function AccountabilityIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <path d="M12 8 V40 M18 14 V40 M24 8 V40 M30 14 V40 M36 8 V40" />
    </svg>
  );
}

export function RespectIcon({ className = base }: IconProps) {
  return (
    <svg className={className} {...props}>
      <path d="M8 38 L24 10 L40 38" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-4 w-4 stroke-current" }: IconProps) {
  return (
    <svg className={className} {...props} viewBox="0 0 24 24" strokeWidth={1.4}>
      <path d="M5 4 H9 L11 9 L8.5 10.5 a11 11 0 0 0 5 5 L15 13 L20 15 V19 a2 2 0 0 1 -2 2 A16 16 0 0 1 3 6 a2 2 0 0 1 2 -2 Z" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4 stroke-current" }: IconProps) {
  return (
    <svg className={className} {...props} viewBox="0 0 24 24" strokeWidth={1.4}>
      <path d="M5 12 H19 M13 6 L19 12 L13 18" />
    </svg>
  );
}

export function PlusIcon({ className = "h-4 w-4 stroke-current" }: IconProps) {
  return (
    <svg className={className} {...props} viewBox="0 0 24 24" strokeWidth={1.4}>
      <path d="M12 5 V19 M5 12 H19" />
    </svg>
  );
}

type IconComponent = (props: IconProps) => React.JSX.Element;

// Type-only import — no runtime circular dependency.
import type { SiteConfig } from "@/lib/site";

type ValueKey = SiteConfig["values"][number]["key"];

// `satisfies` enforces every brand-value key has a matching icon at
// compile time. Add a value to lib/site.ts without an icon here and
// TypeScript flags it instead of rendering silently empty.
export const valueIcons = {
  precision: PrecisionIcon,
  integrity: IntegrityIcon,
  craftsmanship: CraftsmanshipIcon,
  accountability: AccountabilityIcon,
  respect: RespectIcon,
} satisfies Record<ValueKey, IconComponent>;

// Service slugs are typed as plain `string` in lib/services.ts, so we
// can't get the same exhaustiveness check here without rewriting that
// file as a const tuple. We at least enforce that every value is a real
// icon component.
export const serviceIcons = {
  "water-damage": WaterIcon,
  "fire-damage": FireIcon,
  "mold-removal": MoldIcon,
  "storm-damage": StormIcon,
  remodeling: RemodelingIcon,
} satisfies Record<string, IconComponent>;

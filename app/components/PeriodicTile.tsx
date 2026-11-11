// The periodic-table tile for argon: element 18, noble gas.
// The one place the brand violet is always on.
export default function PeriodicTile({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: "h-8 w-8 rounded-[7px]",
    md: "h-14 w-14 rounded-[11px]",
    lg: "h-24 w-24 rounded-2xl",
  }[size];
  const symbol = {
    sm: "text-[15px] pt-1",
    md: "text-2xl pt-2",
    lg: "text-[2.75rem] pt-3",
  }[size];
  const number = {
    sm: "text-[7px] top-[3px] left-[5px]",
    md: "text-[10px] top-1.5 left-2",
    lg: "text-sm top-2.5 left-3",
  }[size];

  return (
    <span
      className={`relative inline-flex ${dims} shrink-0 select-none items-center justify-center bg-brand-primary font-sans text-brand-on-primary`}
      role="img"
      aria-label="Argon, element 18"
    >
      <span
        aria-hidden="true"
        className={`absolute ${number} font-medium leading-none opacity-80`}
      >
        18
      </span>
      <span
        aria-hidden="true"
        className={`${symbol} font-semibold leading-none tracking-tight`}
      >
        Ar
      </span>
    </span>
  );
}

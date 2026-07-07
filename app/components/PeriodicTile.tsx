// The periodic-table tile for argon: element 18, noble gas.
// Inert by design — the visual anchor of the brand.
export default function PeriodicTile({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = {
    sm: 'h-8 w-8',
    md: 'h-14 w-14',
    lg: 'h-24 w-24',
  }[size];
  const symbol = {
    sm: 'text-sm',
    md: 'text-2xl',
    lg: 'text-4xl',
  }[size];
  const number = {
    sm: 'text-[7px] top-0.5 left-1',
    md: 'text-[10px] top-1 left-1.5',
    lg: 'text-xs top-2 left-2.5',
  }[size];

  return (
    <span
      className={`relative inline-flex ${dims} items-center justify-center border border-brand-primary/60 bg-brand-primary/5 font-mono text-brand-primary select-none`}
      aria-label="Argon, element 18"
    >
      <span className={`absolute ${number} text-brand-muted`}>18</span>
      <span className={`${symbol} leading-none`}>Ar</span>
    </span>
  );
}

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/wecho-mark-exact.png"
      alt=""
      aria-hidden="true"
      width={630}
      height={456}
      className="block object-contain"
      style={{ width: size, height: (size * 456) / 630 }}
    />
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={42} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-extrabold tracking-tight text-white">
          wecho
        </span>
        <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.28em] text-brand-mint/80">
          Creative Studio
        </span>
      </span>
    </span>
  );
}

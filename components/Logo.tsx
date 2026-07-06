export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/wecho-mark-exact.png"
      alt=""
      aria-hidden="true"
      width={373}
      height={237}
      className="block object-contain"
      style={{ width: size, height: (size * 237) / 373 }}
    />
  );
}

export function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/wecho-logo-exact.png"
      alt="wecho"
      width={1028}
      height={264}
      className="block h-auto w-[138px] object-contain sm:w-[152px] md:w-[166px]"
    />
  );
}

import muktivaMark from '../../assets/muktiva-mark.png';
import muktivaWordmark from '../../assets/muktiva-wordmark.png';

/**
 * Renders the MUKTIVA soaring-bird emblem paired with the custom MUKTIVA
 * wordmark and crisp HTML tagline sized cleanly for header and footer lockups.
 */
export default function BrandLogo({ size = 'md' }) {
  const isCompact = size === 'sm';

  return (
    <div className="inline-flex items-center gap-2 sm:gap-2.5">
      <img
        src={muktivaMark}
        alt=""
        aria-hidden="true"
        className={
          isCompact
            ? 'h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9'
            : 'h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10'
        }
      />
      <div className="flex flex-col">
        <img
          src={muktivaWordmark}
          alt="MUKTIVA"
          className={
            isCompact
              ? 'h-4 w-auto self-start object-contain sm:h-5'
              : 'h-5 w-auto self-start object-contain sm:h-5.5'
          }
        />
        <span
          className={`mt-0.5 block font-semibold uppercase tracking-[0.02em] text-[#dfd1a7] leading-none whitespace-nowrap ${
            isCompact ? 'text-[8px] sm:text-[8.5px]' : 'text-[8.5px] sm:text-[9px]'
          }`}
        >
          Freedom Begins With Financial Clarity
        </span>
      </div>
    </div>
  );
}

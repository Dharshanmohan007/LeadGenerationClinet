import muktivaMark from '../../assets/muktiva-mark.png';
import muktivaWordmark from '../../assets/muktiva-wordmark.png';

/**
 * Renders the MUKTIVA soaring-bird emblem paired with the custom MUKTIVA
 * wordmark and a razor-sharp HTML tagline so the tagline stays clearly legible
 * at 100% browser zoom on all screen sizes.
 */
export default function BrandLogo({ size = 'md' }) {
  const isCompact = size === 'sm';

  return (
    <div className="inline-flex items-center gap-2.5 sm:gap-3">
      <img
        src={muktivaMark}
        alt=""
        aria-hidden="true"
        className={
          isCompact
            ? 'h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11'
            : 'h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12'
        }
      />
      <div className="flex flex-col">
        <img
          src={muktivaWordmark}
          alt="MUKTIVA"
          className={
            isCompact
              ? 'h-6 w-auto self-start object-contain sm:h-7'
              : 'h-7 w-auto self-start object-contain sm:h-8'
          }
        />
        <span
          className={`mt-1 block font-semibold uppercase tracking-[0.03em] text-[#dfd1a7] leading-none whitespace-nowrap ${
            isCompact ? 'text-[9px] sm:text-[9.5px]' : 'text-[9.5px] sm:text-[10px]'
          }`}
        >
          Freedom Begins With Financial Clarity
        </span>
      </div>
    </div>
  );
}

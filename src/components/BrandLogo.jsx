import React from 'react';

/**
 * Official Canonical Pixel-art MT monogram SVG mark.
 * Grid: 14 cols x 8 rows, block: 8px, gap: 2px (uniform step 10px: 1, 11, 21, ... 131).
 *
 * Rules:
 *  - "M" and "T" are constantly White (#FFFFFF).
 *  - "." (period) is constantly Core Blue (#3b82f6).
 *  - Uniform 2px spacing across all blocks with zero extra gaps.
 *  - The hover effect does NOT apply on the MT. monogram logo.
 */
export const MtPixelMark = ({ className = "h-8 w-auto" }) => (
  <svg
    viewBox="0 0 140 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {/* MT Stems and Bars (Always White, unaffected by hover) */}
    <g fill="#FFFFFF">
      {/* Row 0: ##....#######. */}
      <rect x="1"   y="1"  width="8" height="8" />
      <rect x="11"  y="1"  width="8" height="8" />
      <rect x="61"  y="1"  width="8" height="8" />
      <rect x="71"  y="1"  width="8" height="8" />
      <rect x="81"  y="1"  width="8" height="8" />
      <rect x="91"  y="1"  width="8" height="8" />
      <rect x="101" y="1"  width="8" height="8" />
      <rect x="111" y="1"  width="8" height="8" />
      <rect x="121" y="1"  width="8" height="8" />

      {/* Row 1: ###..########. */}
      <rect x="1"   y="11" width="8" height="8" />
      <rect x="11"  y="11" width="8" height="8" />
      <rect x="21"  y="11" width="8" height="8" />
      <rect x="51"  y="11" width="8" height="8" />
      <rect x="61"  y="11" width="8" height="8" />
      <rect x="71"  y="11" width="8" height="8" />
      <rect x="81"  y="11" width="8" height="8" />
      <rect x="91"  y="11" width="8" height="8" />
      <rect x="101" y="11" width="8" height="8" />
      <rect x="111" y="11" width="8" height="8" />
      <rect x="121" y="11" width="8" height="8" />

      {/* Row 2: ########.##... */}
      <rect x="1"   y="21" width="8" height="8" />
      <rect x="11"  y="21" width="8" height="8" />
      <rect x="21"  y="21" width="8" height="8" />
      <rect x="31"  y="21" width="8" height="8" />
      <rect x="41"  y="21" width="8" height="8" />
      <rect x="51"  y="21" width="8" height="8" />
      <rect x="61"  y="21" width="8" height="8" />
      <rect x="71"  y="21" width="8" height="8" />
      <rect x="91"  y="21" width="8" height="8" />
      <rect x="101" y="21" width="8" height="8" />

      {/* Row 3: ##.##.##.##... */}
      <rect x="1"   y="31" width="8" height="8" />
      <rect x="11"  y="31" width="8" height="8" />
      <rect x="31"  y="31" width="8" height="8" />
      <rect x="41"  y="31" width="8" height="8" />
      <rect x="61"  y="31" width="8" height="8" />
      <rect x="71"  y="31" width="8" height="8" />
      <rect x="91"  y="31" width="8" height="8" />
      <rect x="101" y="31" width="8" height="8" />

      {/* Row 4: ##....##.##... */}
      <rect x="1"   y="41" width="8" height="8" />
      <rect x="11"  y="41" width="8" height="8" />
      <rect x="61"  y="41" width="8" height="8" />
      <rect x="71"  y="41" width="8" height="8" />
      <rect x="91"  y="41" width="8" height="8" />
      <rect x="101" y="41" width="8" height="8" />

      {/* Row 5: ##....##.##... */}
      <rect x="1"   y="51" width="8" height="8" />
      <rect x="11"  y="51" width="8" height="8" />
      <rect x="61"  y="51" width="8" height="8" />
      <rect x="71"  y="51" width="8" height="8" />
      <rect x="91"  y="51" width="8" height="8" />
      <rect x="101" y="51" width="8" height="8" />

      {/* Row 6: ##....##.##... */}
      <rect x="1"   y="61" width="8" height="8" />
      <rect x="11"  y="61" width="8" height="8" />
      <rect x="61"  y="61" width="8" height="8" />
      <rect x="71"  y="61" width="8" height="8" />
      <rect x="91"  y="61" width="8" height="8" />
      <rect x="101" y="61" width="8" height="8" />

      {/* Row 7: ##....##.##... */}
      <rect x="1"   y="71" width="8" height="8" />
      <rect x="11"  y="71" width="8" height="8" />
      <rect x="61"  y="71" width="8" height="8" />
      <rect x="71"  y="71" width="8" height="8" />
      <rect x="91"  y="71" width="8" height="8" />
      <rect x="101" y="71" width="8" height="8" />
    </g>

    {/* Period 2x2: Always Core Blue (#3b82f6), unaffected by hover */}
    <g fill="#3b82f6">
      <rect x="121" y="61" width="8" height="8" />
      <rect x="131" y="61" width="8" height="8" />
      <rect x="121" y="71" width="8" height="8" />
      <rect x="131" y="71" width="8" height="8" />
    </g>
  </svg>
);

/**
 * Official MegaTrix Core Header Logo.
 *
 * MT. Logo:
 *  - "M" and "T" are constantly White.
 *  - "." is constantly Core Blue (#3b82f6).
 *  - Uniform 2px spacing between all blocks with zero extra gaps.
 *  - Onhover effect does NOT apply on MT. logo.
 *
 * Typography Onhover Effect:
 *  - CORE will turn to white on hover.
 *  - Rest (MEGATRIX, BUSINESS INTELLIGENCE) will turn to blue on hover.
 */
export const BrandLogo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* MT. Pixel Mark Monogram */}
      <MtPixelMark className="h-8 w-auto shrink-0" />

      {/* Typography: MEGATRIX CORE + BUSINESS INTELLIGENCE */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-display font-bold text-sm tracking-wider text-white transition-colors duration-200 group-hover:text-mx-blue uppercase">
            MEGATRIX
          </span>
          <span className="font-display font-bold text-sm tracking-wider text-mx-blue transition-colors duration-200 group-hover:text-white uppercase">
            CORE
          </span>
        </div>
        <span className="font-display text-[11px] font-semibold tracking-[0.14em] text-mx-subtle transition-colors duration-200 group-hover:text-mx-blue uppercase leading-none mt-1">
          BUSINESS INTELLIGENCE
        </span>
      </div>
    </div>
  );
};

export default BrandLogo;

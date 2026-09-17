# Design QA - run 2026-09-16T20-54-43  ·  SCORE 0/100  ·  FAIL

| Severity | Count |  | Route | Score |
|---|---|  |---|---|
| P0 | 5 |  | /platforms/bizmanager | 0 |
| P1 | 50 |  | /login | 100 |
| P2 | 4 |  |  |  |
| P3 | 5 |  |  |  |

## Violations
### DL-01 · P1 · Off-token text color (5)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div:nth-of-type(2) > p.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-01-5.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > label.block:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-01-5.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > label.block:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-01-5.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(1)` — measured: rgb(82, 82, 82)
  → expected: Resolves to tokens.json (dE < 2)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-01-5.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(2)` — measured: rgba(82, 82, 82, 0.5)
  → expected: Resolves to tokens.json (dE < 2)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-01-5.png

### DL-02 · P0 · Rainbow hues detected (exceeds allowed non-neutral hues) (1)
- `viewport` — measured: 13 distinct hues on screen
  → expected: <= 2 non-neutral hues

### DL-04 · P1 · Badge font size off-scale (18)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.relative:nth-of-type(1) > div.relative:nth-of-type(2) > div.text-center:nth-of-type(1) > p.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div.font-tech:nth-of-type(1) > h2.text-2xl:nth-of-type(1) > span.bg-gradient-to-r:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div.font-tech:nth-of-type(1) > h2.text-2xl:nth-of-type(1) > span.bg-gradient-to-r:nth-of-type(1)` — measured: 26px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div.font-tech:nth-of-type(1) > h2.text-2xl:nth-of-type(1) > span.text-mx-blue:nth-of-type(2)` — measured: height 32px
  → expected: height <= 26px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div.font-tech:nth-of-type(1) > h2.text-2xl:nth-of-type(1) > span.text-mx-blue:nth-of-type(2)` — measured: 26px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div:nth-of-type(2) > h1.text-xl:nth-of-type(1)` — measured: width 384px ("Unified Command Center")
  → expected: width <= 240px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div:nth-of-type(2) > h1.text-xl:nth-of-type(1)` — measured: height 28px
  → expected: height <= 26px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div:nth-of-type(2) > h1.text-xl:nth-of-type(1)` — measured: 20px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div:nth-of-type(2) > p.text-xs:nth-of-type(1)` — measured: width 384px ("Centralized multi-SaaS governance & ecos")
  → expected: width <= 240px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div:nth-of-type(2) > p.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > label.block:nth-of-type(1)` — measured: width 384px ("Enter Email")
  → expected: width <= 240px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > label.block:nth-of-type(1)` — measured: width 384px ("Password")
  → expected: width <= 240px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > button.w-full:nth-of-type(1) > span:nth-of-type(1)` — measured: 14px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(1)` — measured: width 384px ("Restricted Access. All operations are mo")
  → expected: width <= 240px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(1)` — measured: 10px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(2)` — measured: width 384px ("© 2026 MegaTrix Technologies (Pvt) Ltd.")
  → expected: width <= 240px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(2)` — measured: 10px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-24.png
- `viewport` — measured: 12 badges
  → expected: <= 2 badges per viewport

### DL-05 · P1 · Off-scale font size (6)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div.font-tech:nth-of-type(1) > h2.text-2xl:nth-of-type(1) > span.bg-gradient-to-r:nth-of-type(1)` — measured: 26px ("MegaTrix")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-05-30.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div.font-tech:nth-of-type(1) > h2.text-2xl:nth-of-type(1) > span.text-mx-blue:nth-of-type(2)` — measured: 26px ("Technologies")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-05-30.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(1)` — measured: 10px ("Restricted Access. All operati")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-05-30.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(2)` — measured: 10px ("© 2026 MegaTrix Technologies (")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-05-30.png
- `viewport` — measured: 6 distinct sizes (12, 11, 26, 20, 14, 10)
  → expected: <= 5 distinct sizes per viewport
- `viewport` — measured: 5 distinct weights (500, 400, 900, 800, 700)
  → expected: <= 3 distinct weights per viewport

### DL-06 · P1 · Inconsistent icon stroke-width (14)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > div.relative:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 7px
  → expected: Size in {14, 16, 18, 20}
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > button.w-full:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > button.w-full:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 9px
  → expected: Size in {14, 16, 18, 20}
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > button.w-full:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(2)` — measured: © 2026 MegaTrix Technologies (Pvt) Ltd.
  → expected: Zero emoji codepoints in rendered text
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-44.png

### DL-07 · P2 · Off-scale border radius (3)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > div.relative:nth-of-type(1) > input.w-full:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-07-47.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > div.relative:nth-of-type(1) > input.w-full:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-07-47.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > button.w-full:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-07-47.png

### DL-08 · P3 · Off-grid spacing value (5)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.relative:nth-of-type(1) > div.relative:nth-of-type(2) > div.text-center:nth-of-type(1) > div.w-16:nth-of-type(1)` — measured: 62.2812px
  → expected: Multiple of 4px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-08-52.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > div.relative:nth-of-type(1)` — measured: 6px
  → expected: Multiple of 4px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-08-52.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > div.relative:nth-of-type(1) > input.w-full:nth-of-type(1)` — measured: 10px
  → expected: Multiple of 4px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-08-52.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > div.relative:nth-of-type(1)` — measured: 6px
  → expected: Multiple of 4px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-08-52.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > div.relative:nth-of-type(1) > input.w-full:nth-of-type(1)` — measured: 10px
  → expected: Multiple of 4px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-08-52.png

### DL-09 · P1 · Colored drop-shadow filter detected (3)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div.font-tech:nth-of-type(1) > h2.text-2xl:nth-of-type(1)` — measured: filter: drop-shadow(rgba(59, 130, 246, 0.35) 0px 0px 24px)
  → expected: Black/transparent shadows only
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-09-55.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > button.w-full:nth-of-type(1)` — measured: box-shadow with rgba(255, 255, 255, 0.05)
  → expected: Black/transparent shadows only
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-09-55.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > button.w-full:nth-of-type(1)` — measured: box-shadow with rgba(255, 255, 255, 0.05)
  → expected: Black/transparent shadows only
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-09-55.png

### DL-10 · P1 · Illegal background gradient (2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.relative:nth-of-type(1) > div.relative:nth-of-type(2) > div.text-center:nth-of-type(1) > div.w-16:nth-of-type(1)` — measured: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.2), rgba(0, 0,
  → expected: No gradients outside /login
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-10-57.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div.font-tech:nth-of-type(1) > h2.text-2xl:nth-of-type(1) > span.bg-gradient-to-r:nth-of-type(1)` — measured: linear-gradient(to right, rgb(255, 255, 255), rgb(245, 245, 245), rgb(229, 229, 
  → expected: No gradients outside /login
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-10-57.png

### DL-11 · P1 · Insufficient text contrast ratio (6)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(1) > div:nth-of-type(2) > p.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Centralized multi-SaaS governa")
  → expected: >= 4.5:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-63.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(1) > label.block:nth-of-type(1)` — measured: 4.18:1 ("Enter Email")
  → expected: >= 4.5:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-63.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > div.space-y-1.5:nth-of-type(2) > label.block:nth-of-type(1)` — measured: 4.18:1 ("Password")
  → expected: >= 4.5:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-63.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > form.space-y-5:nth-of-type(1) > button.w-full:nth-of-type(1) > span:nth-of-type(1)` — measured: 1.06:1 ("Access Command Center")
  → expected: >= 3:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-63.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(1)` — measured: 2.53:1 ("Restricted Access. All operati")
  → expected: >= 4.5:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-63.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.w-full:nth-of-type(2) > div.max-w-sm:nth-of-type(1) > div.space-y-3:nth-of-type(2) > p:nth-of-type(2)` — measured: 2.53:1 ("© 2026 MegaTrix Technologies (")
  → expected: >= 4.5:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-63.png

### DL-12 · P2 · Card-kit monotony: identical style signature run > 6 (1)
- `#root` — measured: 10 elements with signature [0px|0px solid rgb(229, 231, 235)|0,0,0,0|rgba(0, 0, 0, 0)]
  → expected: <= 6 identical cards without hierarchy
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-12-64.png

## Screenshots
| Route | 390 (Mobile) | 768 (Tablet) | 1280 (Desktop) | 1920 (Ultrawide) |
|---|---|---|---|---|
| /platforms/bizmanager | shots/bizmanager-mobile-390.png | shots/bizmanager-tablet-768.png | shots/bizmanager-1280.png | shots/bizmanager-ultrawide-1920.png |


# Design QA - run 2026-09-16T21-02-02  ·  SCORE 0/100  ·  FAIL

| Severity | Count |  | Route | Score |
|---|---|  |---|---|
| P0 | 24 |  | /platforms/bizmanager | 0 |
| P1 | 459 |  | /login | 100 |
| P2 | 37 |  |  |  |
| P3 | 45 |  |  |  |

## Violations
### DL-01 · P1 · Off-token background color (91)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-01-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(2)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-01-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(3)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-01-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1) > span.absolute:nth-of-type(2)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > div.px-3:nth-of-type(1) > span:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > div.px-3:nth-of-type(1) > span:nth-of-type(2)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > div.flex:nth-of-type(1) > span.w-1.5:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(2)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > span.text-neutral-500:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > div.inline-flex:nth-of-type(1) > span.w-2:nth-of-type(1)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > p.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > span:nth-of-type(1)` — measured: rgb(229, 229, 229)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1)` — measured: rgb(37, 99, 235)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.flex:nth-of-type(1) > span.w-1.5:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.flex:nth-of-type(2) > span.w-1.5:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.text-neutral-400:nth-of-type(3) > strong:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > span:nth-of-type(1)` — measured: rgb(147, 197, 253)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.p-4:nth-of-type(2) > div.text-xs:nth-of-type(1) > p.font-bold:nth-of-type(1)` — measured: rgb(252, 211, 77)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.p-4:nth-of-type(2) > div.text-xs:nth-of-type(1) > p:nth-of-type(2)` — measured: rgba(253, 230, 138, 0.8)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.15)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(14, 165, 233, 0.15)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.15)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(2)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(2)` — measured: rgba(16, 185, 129, 0.1)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(5) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(6) > span:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > p.text-xs:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(1)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(2)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(3)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(4)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(5)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(6)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(2)` — measured: rgb(212, 212, 212)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(3)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(4)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > span:nth-of-type(1)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(2)` — measured: rgb(212, 212, 212)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(3)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(4)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > span:nth-of-type(1)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(2)` — measured: rgb(212, 212, 212)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(3)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(4)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > span:nth-of-type(1)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(2)` — measured: rgb(212, 212, 212)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(3)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(4)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > span:nth-of-type(1)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: rgb(115, 115, 115)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(2)` — measured: rgb(212, 212, 212)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(3)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(4)` — measured: rgb(163, 163, 163)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgb(251, 113, 133)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(244, 63, 94, 0.1)
  → expected: Resolves to tokens.json (dE < 2)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > span:nth-of-type(1)` — measured: rgb(96, 165, 250)
  → expected: Resolves to tokens.json (dE < 2)

### DL-02 · P0 · Rainbow hues detected (exceeds allowed non-neutral hues) (1)
- `viewport` — measured: 13 distinct hues on screen
  → expected: <= 2 non-neutral hues

### DL-03 · P0 · Tinted surface detected (16)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > div.inline-flex:nth-of-type(1)` — measured: rgba(59, 130, 246, 0.1) (saturation: 91%, area: 9739px²)
  → expected: background saturation <= 8% for elements > 256px²
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-03-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1)` — measured: rgb(37, 99, 235) (saturation: 83%, area: 6990px²)
  → expected: background saturation <= 8% for elements > 256px²
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-03-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > span:nth-of-type(1)` — measured: rgba(59, 130, 246, 0.1) (saturation: 91%, area: 4521px²)
  → expected: background saturation <= 8% for elements > 256px²
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-03-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.p-4:nth-of-type(2)` — measured: rgba(245, 158, 11, 0.1) (saturation: 92%, area: 89280px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.15) (saturation: 84%, area: 1024px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(14, 165, 233, 0.15) (saturation: 89%, area: 1024px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(59, 130, 246, 0.15) (saturation: 91%, area: 1024px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(245, 158, 11, 0.15) (saturation: 92%, area: 1024px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(59, 130, 246, 0.15) (saturation: 91%, area: 1024px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.15) (saturation: 84%, area: 1024px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(2)` — measured: rgba(16, 185, 129, 0.1) (saturation: 84%, area: 1670px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1) (saturation: 84%, area: 1011px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1) (saturation: 84%, area: 1011px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1) (saturation: 84%, area: 1011px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1) (saturation: 84%, area: 1011px²)
  → expected: background saturation <= 8% for elements > 256px²
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(244, 63, 94, 0.1) (saturation: 89%, area: 1388px²)
  → expected: background saturation <= 8% for elements > 256px²

### DL-04 · P1 · Badge font size off-scale (107)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(1)` — measured: 16px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(1)` — measured: rgb(163, 163, 163)
  → expected: transparent or panel (#141414)
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(2)` — measured: 16px
  → expected: 11px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-04-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(2)` — measured: rgb(163, 163, 163)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(3)` — measured: 16px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1) > div.w-4:nth-of-type(1) > span.absolute:nth-of-type(3)` — measured: rgb(163, 163, 163)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > span.font-tech:nth-of-type(1) > span.text-mx-blue:nth-of-type(1)` — measured: 14px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1)` — measured: height 40px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1)` — measured: 16px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1)` — measured: rgb(38, 38, 38)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1) > span.absolute:nth-of-type(2)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1) > span.absolute:nth-of-type(2)` — measured: rgb(52, 211, 153)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > div.px-3:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > div.flex:nth-of-type(1) > span.w-1.5:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > div.flex:nth-of-type(1) > span.w-1.5:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(2)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > span.text-neutral-500:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > div.inline-flex:nth-of-type(1)` — measured: width 375px ("")
  → expected: width <= 240px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > div.inline-flex:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > div.inline-flex:nth-of-type(1)` — measured: rgba(59, 130, 246, 0.1)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > div.inline-flex:nth-of-type(1) > span.w-2:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > div.inline-flex:nth-of-type(1) > span.w-2:nth-of-type(1)` — measured: rgb(96, 165, 250)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > h1.text-2xl:nth-of-type(1)` — measured: width 567px ("Retail & Point of Sale Command Desk")
  → expected: width <= 240px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > h1.text-2xl:nth-of-type(1)` — measured: height 36px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > h1.text-2xl:nth-of-type(1)` — measured: 30px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.flex:nth-of-type(1) > span.w-1.5:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.flex:nth-of-type(1) > span.w-1.5:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.flex:nth-of-type(1) > strong.text-white:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.flex:nth-of-type(2) > span.w-1.5:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.flex:nth-of-type(2) > span.w-1.5:nth-of-type(1)` — measured: rgb(52, 211, 153)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.flex:nth-of-type(2) > strong.text-white:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > div.flex:nth-of-type(1) > span.text-neutral-400:nth-of-type(3) > strong:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > span:nth-of-type(1)` — measured: rgba(59, 130, 246, 0.1)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: height 36px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: height 36px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: height 36px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > span:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > span:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > span:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(5) > span:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(5) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(6) > span:nth-of-type(1)` — measured: height 32px
  → expected: height <= 26px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(6) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > p.text-xs:nth-of-type(1)` — measured: width 343px ("Manage registered POS operators and acti")
  → expected: width <= 240px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > p.text-xs:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(16, 185, 129, 0.1)
  → expected: transparent or panel (#141414)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(1)` — measured: 12px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px
  → expected: 11px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: rgba(244, 63, 94, 0.1)
  → expected: transparent or panel (#141414)
- `viewport` — measured: 74 badges
  → expected: <= 2 badges per viewport

### DL-05 · P1 · Off-scale font size (25)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > div.px-3:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px ("Enterprise")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-05-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div:nth-of-type(1)` — measured: 10px ("Platform")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-05-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div:nth-of-type(1)` — measured: 10px ("System & Governance")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-05-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(2)` — measured: 10px ("MegaTrix Core Online")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > span.text-neutral-500:nth-of-type(1)` — measured: 10px ("v1.0")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > h1.text-2xl:nth-of-type(1)` — measured: 30px ("Retail & Point of Sale Command")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px ("PKR 342,850")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px ("480")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px ("1,420")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px ("PKR 184,200")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px ("PKR 95,400")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.my-3:nth-of-type(2) > span.text-2xl:nth-of-type(1)` — measured: 30px ("3")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(2)` — measured: 9px ("AES-256")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px ("usr_bm_01")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px ("Active")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px ("usr_bm_02")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px ("Active")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px ("usr_bm_03")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px ("Active")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px ("usr_bm_04")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px ("Active")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 10px ("usr_bm_05")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 10px ("Restricted")
  → expected: One of [11, 12, 13, 14, 16, 20, 28, 40, 56]px
- `viewport` — measured: 6 distinct sizes (14, 12, 11, 10, 30, 9)
  → expected: <= 5 distinct sizes per viewport
- `viewport` — measured: 5 distinct weights (700, 600, 400, 500, 800)
  → expected: <= 3 distinct weights per viewport

### DL-06 · P1 · Inconsistent icon stroke-width (186)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(1)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-06-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(2)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(3)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(3)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(4)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > rect:nth-of-type(4)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 7px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: 7px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: 9px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 9px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > div.flex:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 7px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(2)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: 1px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(2)` — measured: 1px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 15px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(2) > path:nth-of-type(1)` — measured: 9px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(2) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(2) > polyline:nth-of-type(1)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(2) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(2) > line:nth-of-type(1)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(2) > line:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.p-4:nth-of-type(2) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.p-4:nth-of-type(2) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 17px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.p-4:nth-of-type(2) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 9px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 11px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 9px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polygon:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polygon:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(2)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 10px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 11px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 4px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 11px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: 11px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(5) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(5) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(5) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(6) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(6) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: 13px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(6) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 9px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: 3px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(2)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: 5px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > h3.text-sm:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(3)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: 9px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > circle:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: 3px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 8px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 3px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 8px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 3px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 8px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 3px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 8px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 3px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: 12px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: 8px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > path:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: 3px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > polyline:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: 6px
  → expected: Size in {14, 16, 18, 20}
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6) > a.inline-flex:nth-of-type(1) > svg:nth-of-type(1) > line:nth-of-type(1)` — measured: stroke-width="2"
  → expected: stroke-width="1.5"

### DL-07 · P2 · Off-scale border radius (35)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > button.hidden:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-07-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1)` — measured: border-radius: 9999px on 40x40px element
  → expected: Radius 9999px only on elements <= 10px or avatars
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-07-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1)` — measured: border-radius: 9999px on 32x32px element
  → expected: Radius 9999px only on elements <= 10px or avatars
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-07-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > div.px-3:nth-of-type(1) > span:nth-of-type(2)` — measured: 4px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > a.flex:nth-of-type(2)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div.space-y-1:nth-of-type(2) > button.w-full:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1)` — measured: 24px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > div.inline-flex:nth-of-type(1)` — measured: border-radius: 9999px on 375x26px element
  → expected: Radius 9999px only on elements <= 10px or avatars
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > button.inline-flex:nth-of-type(1)` — measured: 12px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1)` — measured: 12px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > span:nth-of-type(1)` — measured: 4px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.p-4:nth-of-type(2)` — measured: 16px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1)` — measured: 16px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: 12px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2)` — measured: 16px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: 12px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3)` — measured: 16px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: 12px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4)` — measured: 16px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: 12px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5)` — measured: 16px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: 12px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6)` — measured: 16px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > div.p-2:nth-of-type(1)` — measured: 12px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(2)` — measured: 4px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5)` — measured: 16px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > input.pl-8:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > select.px-2.5:nth-of-type(1)` — measured: 8px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 4px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 4px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 4px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 4px
  → expected: One of [0, 6, 10, 14, 9999]px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 4px
  → expected: One of [0, 6, 10, 14, 9999]px

### DL-08 · P3 · Off-grid spacing value (45)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(1) > a.flex:nth-of-type(1)` — measured: 6px
  → expected: Multiple of 4px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-08-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > div.px-3:nth-of-type(1) > span:nth-of-type(2)` — measured: 2px
  → expected: Multiple of 4px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-08-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(1)` — measured: 6px
  → expected: Multiple of 4px
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-08-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div.space-y-1:nth-of-type(2) > div.ml-4:nth-of-type(1) > a.flex:nth-of-type(2)` — measured: 6px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > span:nth-of-type(1)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.p-4:nth-of-type(2) > svg:nth-of-type(1)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(2)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > p.text-xs:nth-of-type(1)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > input.pl-8:nth-of-type(1)` — measured: 6px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > select.px-2.5:nth-of-type(1)` — measured: 6px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(1)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(2)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(3)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(4)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(6)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(1)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(2)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(3)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(4)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(6)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(1)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(2)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(3)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(4)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(6)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(1)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(2)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(3)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(4)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(6)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(1)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(2)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(3)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(4)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5)` — measured: 14px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 2px
  → expected: Multiple of 4px
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(6)` — measured: 14px
  → expected: Multiple of 4px

### DL-09 · P1 · Colored box-shadow glow detected (15)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > header.h-14:nth-of-type(1) > div.flex:nth-of-type(2) > div.relative:nth-of-type(1) > button.flex:nth-of-type(1) > div.w-8:nth-of-type(1) > span.absolute:nth-of-type(2)` — measured: box-shadow with rgb(255, 255, 255)
  → expected: Black/transparent shadows only
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-09-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1)` — measured: box-shadow with rgba(37, 99, 235, 0.25)
  → expected: Black/transparent shadows only
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-09-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.flex:nth-of-type(2) > a.inline-flex:nth-of-type(1)` — measured: box-shadow with rgba(37, 99, 235, 0.25)
  → expected: Black/transparent shadows only
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-09-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1)` — measured: box-shadow with rgb(255, 255, 255)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1)` — measured: box-shadow with rgba(255, 255, 255, 0.05)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2)` — measured: box-shadow with rgb(255, 255, 255)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2)` — measured: box-shadow with rgba(255, 255, 255, 0.05)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3)` — measured: box-shadow with rgb(255, 255, 255)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3)` — measured: box-shadow with rgba(255, 255, 255, 0.05)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4)` — measured: box-shadow with rgb(255, 255, 255)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4)` — measured: box-shadow with rgba(255, 255, 255, 0.05)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5)` — measured: box-shadow with rgb(255, 255, 255)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5)` — measured: box-shadow with rgba(255, 255, 255, 0.05)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6)` — measured: box-shadow with rgb(255, 255, 255)
  → expected: Black/transparent shadows only
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6)` — measured: box-shadow with rgba(255, 255, 255, 0.05)
  → expected: Black/transparent shadows only

### DL-10 · P1 · Illegal background gradient (1)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1)` — measured: linear-gradient(to right, rgba(23, 37, 84, 0.4), rgb(10, 10, 10), rgb(10, 10, 10
  → expected: No gradients outside /login
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-10-1.png

### DL-11 · P1 · Insufficient text contrast ratio (41)
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.space-y-1:nth-of-type(1) > div:nth-of-type(1)` — measured: 4.18:1 ("Platform")
  → expected: >= 4.5:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.flex:nth-of-type(1) > nav.space-y-5:nth-of-type(1) > div.pt-3:nth-of-type(2) > div:nth-of-type(1)` — measured: 4.18:1 ("System & Governance")
  → expected: >= 4.5:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-2.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > div.flex:nth-of-type(1) > span.truncate:nth-of-type(2)` — measured: 4.18:1 ("MegaTrix Core Online")
  → expected: >= 4.5:1 WCAG AA
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-11-3.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > div.hidden:nth-of-type(1) > aside.h-full:nth-of-type(1) > div.p-3:nth-of-type(2) > span.text-neutral-500:nth-of-type(1)` — measured: 4.18:1 ("v1.0")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.flex:nth-of-type(1) > div.space-y-2:nth-of-type(1) > p.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Real-time synchronization acro")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.relative:nth-of-type(1) > div.mt-6:nth-of-type(2) > span:nth-of-type(1)` — measured: 2.04:1 ("Tenant Namespace: BIZ-RETAIL-0")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Today's Sales")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(1) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 4.18:1 ("Processed via POS")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Active Customers")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(2) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 4.18:1 ("Walk-in & Regular")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Inventory SKUs")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(3) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 4.18:1 ("Stock Items Tracked")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Khata Receivables")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(4) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 4.18:1 ("Pending Customer Dues")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Cash In Hand")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(5) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 4.18:1 ("Cash Drawer Register")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(1) > span.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Terminals Online")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.grid:nth-of-type(3) > div.rounded-2xl:nth-of-type(6) > div.flex:nth-of-type(3) > span:nth-of-type(1)` — measured: 4.18:1 ("Active Checkout Counters")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(1)` — measured: 4.18:1 ("Credentials")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(2) > span:nth-of-type(2)` — measured: 1.32:1 ("AES-256")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(3) > span:nth-of-type(1)` — measured: 4.18:1 ("POS Sales & Invoices")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(4) > span:nth-of-type(1)` — measured: 4.18:1 ("Customer Khata")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(5) > span:nth-of-type(1)` — measured: 4.18:1 ("Retail Activity")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.flex:nth-of-type(4) > button.pb-3:nth-of-type(6) > span:nth-of-type(1)` — measured: 4.18:1 ("Low Stock Alerts")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.flex:nth-of-type(1) > div:nth-of-type(1) > p.text-xs:nth-of-type(1)` — measured: 4.18:1 ("Manage registered POS operator")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(1)` — measured: 4.18:1 ("Operator Name")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(2)` — measured: 4.18:1 ("Role")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(3)` — measured: 4.18:1 ("Assigned POS Terminal")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(4)` — measured: 4.18:1 ("Contact Phone")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(5)` — measured: 4.18:1 ("Status")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > thead:nth-of-type(1) > tr.border-b:nth-of-type(1) > th.py-3:nth-of-type(6)` — measured: 4.18:1 ("Actions")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 4.18:1 ("usr_bm_01")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 1.32:1 ("Active")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 4.18:1 ("usr_bm_02")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(2) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 1.32:1 ("Active")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 4.18:1 ("usr_bm_03")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(3) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 1.32:1 ("Active")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 4.18:1 ("usr_bm_04")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(4) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 1.32:1 ("Active")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(1) > div.flex:nth-of-type(1) > span:nth-of-type(2)` — measured: 4.18:1 ("usr_bm_05")
  → expected: >= 4.5:1 WCAG AA
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(5) > td.py-3.5:nth-of-type(5) > span.inline-flex:nth-of-type(1)` — measured: 1.36:1 ("Restricted")
  → expected: >= 4.5:1 WCAG AA

### DL-12 · P2 · Card-kit monotony: identical style signature run > 6 (2)
- `#root` — measured: 22 elements with signature [0px|0px solid rgb(229, 231, 235)|0,0,0,0|rgba(0, 0, 0, 0)]
  → expected: <= 6 identical cards without hierarchy
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-12-1.png
- `#root > div.min-h-screen:nth-of-type(1) > div.min-h-screen:nth-of-type(2) > div.flex-1:nth-of-type(1) > main.flex-1:nth-of-type(1) > div.max-w-7xl:nth-of-type(1) > div.space-y-8:nth-of-type(1) > div.bg-mx-surface:nth-of-type(5) > div.overflow-x-auto:nth-of-type(2) > table.w-full:nth-of-type(1) > tbody.divide-y:nth-of-type(1) > tr:nth-of-type(1) > td.py-3.5:nth-of-type(1)` — measured: 30 elements with signature [0px|0px solid rgb(229, 231, 235)|14,16,14,16|rgba(0, 0, 0, 0)]
  → expected: <= 6 identical cards without hierarchy
  → shot: shots/bizmanager-1280.png  ·  crop: crops/DL-12-2.png

## Screenshots
| Route | 390 (Mobile) | 768 (Tablet) | 1280 (Desktop) | 1920 (Ultrawide) |
|---|---|---|---|---|
| /platforms/bizmanager | shots/bizmanager-mobile-390.png | shots/bizmanager-tablet-768.png | shots/bizmanager-1280.png | shots/bizmanager-ultrawide-1920.png |


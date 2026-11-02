# Angelo Gaspe — Portfolio

A minimalist, premium single-page portfolio for a Business Intelligence Developer.
React + TypeScript + Vite + Tailwind CSS + Motion + Lucide. Content comes from the 2026 resume.

## Run it (VS Code)

```bash
npm install
npm run dev            # local dev server at http://localhost:5173
npm run build          # type-check + production build into /dist
npm run preview        # preview the production build
npm run check:launch   # list anything still unresolved before publishing
```

Requires Node 20+.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo. Framework preset **Vite** (build `npm run build`, output `dist`).
3. After the first deploy, add `og:url` and an `og:image` (1200×630) to `index.html`.

## What's on the site

| Section | Content |
| --- | --- |
| Hero | Role, intro, current position, **Download Resume** button in the nav |
| About | Summary, three stats, education and awards, certifications |
| Experience | Interactive timeline of six roles (BI Developer back to freelance) |
| Skills | Eight tool tiles that filter projects, plus the full toolkit in four tabs |
| Projects | Six featured projects, each with its own case-study page |
| Contact | Email (with copy button), LinkedIn, GitHub, location |

## Interactions

| Where | What | File |
| --- | --- | --- |
| Nav | Download Resume turns into a check mark on click; nav hides on scroll down | `DownloadResume.tsx`, `Nav.tsx` |
| Hero | Glass shape tilts with the cursor and drifts on scroll; spotlight; floating chips | `GlassShape.tsx`, `FloatingChips.tsx` |
| Hero | A live countdown to the next hourly report (a nod to the hourly executive updates) | `FloatingChips.tsx` |
| Hero | Headline mask reveal; hand-drawn underline on "Decisions." | `Hero.tsx` |
| About | Summary lights up word by word as you scroll; stats count up; award and certificate hover effects | `About.tsx`, `ScrollHighlight.tsx`, `CountUp.tsx` |
| Experience | Timeline line draws as you scroll; click a role to expand it | `Experience.tsx` |
| Skills | Icons tilt on hover; tabbed toolkit with an animated pill and arrow-key support | `Skills.tsx` |
| Projects | Cards tilt in 3D with a glare; heat-grid preview highlights columns on hover; waveform animates on hover | `Tilt.tsx`, `previews-more.tsx` |
| Contact | Copy-email button; magnetic call-to-action | `Contact.tsx`, `Magnetic.tsx` |
| Page | Scroll-progress bar | `ScrollProgress.tsx` |

Everything switches off for visitors who prefer reduced motion. To tone one down, change its
strength in that file or remove the component where it is used.

## Content

Everything editable is in **`src/data/content.ts`**.

- **Phone number:** it is in the downloadable resume PDF but deliberately not shown on the site.
- **Stats:** `2+ years` (first role Dec 2023), `3 countries` (freelance clients in the UAE, Germany and the US), `5 certifications`. Marked `CONFIRM`.
- **Case studies:** the "context" and "flow" lines are written around the facts on the resume. Marked `CONFIRM`; edit them to sound like you. Set a case study's `ready: false` to hide it.
- **Screenshots:** put safe, non-confidential images in `public/projects/` and set `image` / `imageAlt`
  on a case study. Until then, illustrative previews are shown. The project previews use made-up values, not real company data.
- **Resume:** replace `public/Angelo_Gaspe_Resume.pdf` whenever you update it.
- **Tool icons** are simple stand-ins, not official logos (`src/components/SkillIcon.tsx`).

`npm run check:launch` prints what is still open.

## Tested

Headless Chrome at 390, 768, 1024 and 1440 px: no horizontal overflow, no app console errors,
axe-core (WCAG 2 A/AA + best practices) reports 0 violations on the home and case-study pages,
the resume download delivers the exact PDF, and all interactions above were exercised.
Still worth doing yourself: open it on a real phone and run one pass with a screen reader
(VoiceOver or NVDA).

## Structure

```
public/Angelo_Gaspe_Resume.pdf
scripts/check-launch.mjs
src/
  App.tsx                 routes between Home and case-study pages
  data/content.ts         all editable content
  lib/                    useActiveSection, route helpers
  pages/                  Home, CaseStudyPage
  components/             Nav, Hero, About, Experience, Skills, Projects, Contact, previews, motion helpers
```

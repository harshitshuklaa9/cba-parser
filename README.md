# CBA Parser

### Automated union contract extraction for construction payroll teams

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

**Live → [cba-parser.vercel.app](https://cba-parser.vercel.app)**

---

## Background

Union construction payroll is one of the most complex labor 
environments in the US economy. A single subcontractor might 
employ workers under multiple union agreements — each with 
different pay classifications, fringe benefit structures, 
overtime rules, and multi-year rate escalations.

Before any of that payroll can run, someone has to read the 
collective bargaining agreement — a 40–80 page legal document 
— and manually extract every rate into the payroll system. 
Base wages, pension contributions, health & welfare funds, 
annuity rates, vacation accruals, training funds, shift 
differentials. All of it, by hand, for every new union 
contractor onboarded.

This is hours of work per customer. It is error-prone. A 
wrong fringe rate on week one means a wrong payroll, which 
means a compliance violation, which means liability.

CBA Parser automates that extraction.

---

## What It Does

Paste a wage schedule section or upload a CBA PDF. The app 
runs a three-stage LLM pipeline and returns a structured rate 
card ready for payroll system import — with every fringe 
component broken out, inconsistencies flagged, and a 
plain-English implementation brief generated automatically.

### Stage 1 — Extraction
GPT-4o reads the agreement text and outputs structured JSON:
- All pay classifications (Journeyman, Foreman, Apprentice 
  levels, General Foreman, Superintendent)
- Base hourly rate per classification
- Full fringe breakdown: health & welfare, pension, annuity, 
  vacation, training, industry advancement, legal services, 
  and any other named funds
- Effective dates — multi-year agreements get split into 
  separate entries per rate period
- Overtime multipliers (standard 1.5x, double-time 2x, 
  and any conditional rules)
- Special provisions: shift differentials, hazard pay, 
  tool allowances, travel pay, tunnel premiums

### Stage 2 — Validation
A second LLM pass audits the extracted data for:
- **Inconsistencies** — does base + all fringes match the 
  stated total package? If not, flagged with the exact delta
- **Missing fields** — required payroll fields absent from 
  the source text
- **Ambiguities** — provisions that could be interpreted 
  multiple ways, flagged with the two possible readings
- **Multi-year gaps** — confirms that annual rate step-ups 
  were captured as separate entries, not averaged

### Stage 3 — Implementation Brief
A plain-English summary written for the payroll admin who 
will enter this data. Surfaces what's unusual about this 
agreement, what requires verification before go-live, and 
what the highest-risk fields are.

---

## Interface

**Sidebar library** — all parsed agreements persist locally. 
Pre-loaded with two real NYC union agreements on first load.

**Rate table** — full fringe breakdown per classification. 
Total Package column color-coded: green above $80/hr, yellow 
$50–80, gray below $50. Expandable rows show special 
provisions per classification.

**Flags panel** — collapsible, severity-badged. High severity 
flags (red) require resolution before payroll entry. Medium 
(yellow) require verification. Low (blue) are informational.

**Export** — CSV download formatted for payroll system import, 
plus Copy as JSON for API ingestion.

---

## Pre-Loaded Agreements

Two real agreements seed the library on first load:

| Union | Trade | Agreement | Highest Total Package |
|---|---|---|---|
| IBEW Local 3 | Electrical | NYC 2022–2025 | $117.15/hr (Foreman) |
| NYC District Council of Carpenters | Carpentry | NYC 2021–2026 | $105.06/hr (Foreman) |

Rates sourced from Joint Industry Board of the Electrical 
Industry published wage schedules (jibei.org) and NYC 
District Council of Carpenters employer wage charts.

IBEW Local 3 is one of the highest-package electrical 
agreements in the country. A Journeyman Wireman in NYC has 
a total labor cost exceeding $110/hr when all fringes are 
included. Most contractors don't know that number until 
payroll runs wrong.

---

## Architecture
```
cba-parser/
├── app/
│   ├── page.tsx                 ← main app shell, library state
│   └── api/
│       ├── parse/route.ts       ← 3-stage LLM pipeline (server)
│       └── validate/route.ts    ← consistency check endpoint
├── components/
│   ├── UploadZone.tsx           ← PDF upload + paste text input
│   ├── RateTable.tsx            ← classification table with fringes
│   ├── FlagsPanel.tsx           ← severity-rated audit flags
│   ├── LibraryPanel.tsx         ← saved agreements sidebar
│   └── ExportButton.tsx         ← CSV + JSON export
├── lib/
│   ├── prompts.ts               ← all 3 LLM prompts
│   ├── types.ts                 ← TypeScript interfaces
│   ├── export.ts                ← CSV generation
│   └── seed.ts                  ← 2 pre-loaded real agreements
└── vercel.json                  ← 30s function timeout for parse
```

**Stack:**
- Next.js 14 App Router — frontend and API routes in one codebase
- TypeScript throughout — strict typing on all parsed data structures
- OpenAI GPT-4o — three sequential chat completion calls per parse
- pdf-parse — text extraction from PDF uploads
- Tailwind CSS — styling
- localStorage — agreement library persistence, no database required
- Vercel — deployment with extended function timeout for LLM calls

**Why Next.js over a separate backend:** The parse route is a 
server-side API endpoint running on Node.js — it handles PDF 
parsing, three sequential OpenAI calls, JSON validation, and 
error handling. Keeping it in the same codebase as the 
frontend simplified deployment and removed the need for a 
separate API service for a prototype of this scope.

---

## Running Locally
```bash
git clone https://github.com/harshitshuklaa9/cba-parser.git
cd cba-parser
npm install
```

Add your OpenAI key:
```bash
echo 'OPENAI_API_KEY=sk-proj-your-key' > .env.local
```

Start the dev server:
```bash
npm run dev
```

Open `http://localhost:3000`

The Load Demo button pre-fills a real Mason Tenders District 
Council wage schedule and runs it through the full pipeline 
without needing to source your own CBA.

---

## The Demo Scenario

The pre-loaded Mason Tenders agreement demonstrates two 
things the parser catches automatically:

1. The source text states total packages only for Laborer 
   and Mason Tender. For Foreman and General Foreman, totals 
   are implied but not stated. The validation pass computes 
   base + fringes, compares against the inferred total, finds 
   a delta, and flags both as high severity.

2. The Saturday premium pay provision states authorization 
   is required but doesn't define the authorization process. 
   Flagged as ambiguous — because a payroll admin needs to 
   know whether this is a supervisor approval or a union 
   hall notification before scheduling weekend work.

---

## Roadmap

**OCR support** — vision model pre-processing pass for 
scanned/image-based PDFs before text extraction

**Prevailing wage cross-reference** — flag when a 
negotiated rate falls below the DOL prevailing wage 
floor for that trade and county

**Multi-agreement diff** — paste two versions of the 
same agreement, get a highlighted breakdown of every 
rate change between them

**Import format** — export structured as a 
rate card CSV matching payroll system ingestion schema

**Union registry lookup** — find agreements by local 
number instead of sourcing text manually

---

## What This Is

A tool built to understand a specific 
implementation bottleneck in union construction payroll 
from first principles.

The problem it models is real. The extraction pipeline 
works on real CBA text. The flags it generates reflect 
actual compliance risks.

Built by [Harshit Shukla](https://harshit-shukla.vercel.app)

# CBA Parser

Union collective bargaining agreement parser for construction payroll teams.

Built to understand the implementation bottleneck Trayd solves:
every new union customer requires someone to manually read a
60-page CBA and extract pay rates into the payroll system.
This takes hours per customer, introduces transcription errors,
and is the first place implementation stalls.

This is a weekend prototype. Not a product. A demonstration of the problem from first principles.

## What it does
- Accepts PDF upload or pasted CBA text
- Extracts all pay classifications, base rates, and fringe
  components using Claude
- Flags ambiguities, inconsistencies, and missing fields
- Generates a payroll-ready CSV export
- Persists a local library of parsed agreements

## Stack
Next.js 14 · Anthropic API · pdf-parse · Tailwind · Vercel

## Setup
```bash
npm install
# Add your Anthropic API key to .env.local
npm run dev
```

## Live demo
https://cba-parser.vercel.app/

# Newsletter Signup Section — Design Spec

**Date:** 2026-06-16  
**Project:** Movement Piešťany website (static Astro site, GitHub Pages)

---

## Overview

Add a newsletter signup section to the site so visitors can subscribe to general updates — new class schedules, movement tips, and events. The form is powered by MailerLite (free tier, up to 1,000 subscribers and 12,000 emails/month).

---

## Placement

Inserted between the **Rozvrh** (Schedule) and **Ceny** (Prices) sections in `src/pages/index.astro`. This catches visitors when they are already engaged with the schedule and thinking about participation.

---

## Visual Design

- Full-width `<section>` with `bg-surface-base` (#080808) background and `border-t border-stroke-subtle` top border — matching the pattern used by other sections on the page.
- A centered card: `bg-surface-card` (#121212), `border border-stroke-card` (#1e1e1e), `rounded-2xl`, max-width constrained (~540px), centered horizontally with padding.
- **Eyebrow label:** "NEWSLETTER" in `text-accent-cyan` (#00D8FF), small caps, wide letter-spacing — Outfit font.
- **Heading:** "Zostaň v obraze" — Outfit Black, large, `text-content-primary`.
- **Body copy:** "Nové hodiny, tipy na pohyb a aktuálny rozvrh — priamo do e-mailu." — Inter, `text-content-body`.
- **Form row:** email `<input>` + "Prihlásiť sa" `<button>` side by side.
  - Input: `bg-surface-base border border-stroke-card rounded-lg`, placeholder "tvoj@email.sk".
  - Button: `bg-accent-lime` (#EDFE03) `text-surface-base`, Outfit ExtraBold.
- **Fine print:** "Žiadny spam. Odhlásiš sa kedykoľvek." — `text-content-muted text-xs`, centered below the form row.

---

## Files Changed

| File | Change |
|---|---|
| `src/pages/index.astro` | Import and insert `<Newsletter />` between `<Rozvrh />` and `<Ceny />` |
| `src/layouts/Layout.astro` | Add MailerLite Universal JS `<script>` tag in `<head>` |
| `src/components/Newsletter.astro` | New component — card, form, interaction logic |

---

## MailerLite Integration

### One-time manual setup (in MailerLite dashboard)
1. Create a free MailerLite account at mailerlite.com.
2. Create a **subscriber group** (e.g. "Movement Piešťany").
3. Create an **embedded form** targeting that group — this produces two public IDs: `ACCOUNT_ID` and `FORM_ID`.
4. Optionally enable **double opt-in** (confirmation email) in the form settings — MailerLite handles the confirmation email automatically; no code change needed.

### Submission endpoint
MailerLite's embedded forms submit to a public cross-origin endpoint:
```
POST https://assets.mailerlite.com/jsonp/ACCOUNT_ID/forms/FORM_ID/subscribe
Content-Type: application/x-www-form-urlencoded

fields[email]=user@example.com
```
This endpoint is public (not authenticated) — the `ACCOUNT_ID` and `FORM_ID` are already exposed in MailerLite's own embed snippets. No API key is required and no backend is needed.

> **Implementation note:** Confirm the exact URL format and field names by inspecting the network requests of a real MailerLite embedded form (browser DevTools → Network tab, submit the form). Adjust the component if the format differs.

Both IDs are stored as string constants directly in `Newsletter.astro`.

### Universal JS script tag
```html
<script src="https://assets.mailerlite.com/js/universal.js"></script>
```
Added once to `Layout.astro` `<head>`. The direct form POST works without this script, but including it enables MailerLite's subscriber tracking and ensures their double opt-in confirmation flow fires reliably.

---

## Form States

| State | Behaviour |
|---|---|
| **Idle** | Email input enabled, button reads "Prihlásiť sa" |
| **Submitting** | Button disabled, label changes to "…" |
| **Success** | Entire form replaced with: "Skvelé! Pozri si e-mail a potvrď prihlásenie." in `text-accent-lime` |
| **Error** | Inline message below input: "Niečo sa pokazilo. Skús to znova." in a muted error colour; form remains usable |

State is managed with a small `<script>` block inside `Newsletter.astro` (vanilla JS, no framework needed).

---

## Constraints & Non-Goals

- Site remains fully static (no Astro SSR, no backend, no environment variables).
- No analytics or click tracking beyond what MailerLite provides natively.
- No popup or scroll-triggered variant — only the inline section.
- The MailerLite dashboard setup is manual and outside the scope of the implementation plan.

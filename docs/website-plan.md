---
name: Karni fractional site
overview: Build two distinct, both-professional prototype websites (plain HTML + Tailwind + vanilla JS, one simple PHP contact endpoint) that position Nitzan as a fractional product-and-delivery leader (de-facto CTO when needed), so he can gather feedback and pick a direction.
todos:
  - id: content
    content: "Write the curated shared copy: hero/hook, how-I-help, 3-4 proof points (ReadyTech, Guided Resolution, Webko, iConcept), Flywheel note, background/credentials, contact."
    status: pending
  - id: warm
    content: Build Direction 1 'Warm Professional' index.html + main.js (personality-forward, disciplined, no hippie tropes).
    status: pending
  - id: sharp
    content: Build Direction 2 'Sharp & Understated' index.html + main.js (minimal, restrained, quiet authority).
    status: pending
  - id: php
    content: "Build api/contact.php: validation, honeypot, mail() send, JSON response; wire both front-ends to it with success/error UI."
    status: pending
  - id: readme
    content: Add README with run/host instructions and a note on compiling Tailwind for production.
    status: pending
  - id: review
    content: Local review of both directions for feedback; iterate on the chosen one.
    status: pending
isProject: false
---

# Nitzan Karni Personal Website — Strategy & Build Plan

## Locked strategy (decided in brainstorm)

- **Audience / goal:** Primarily fractional + advisory work (A) and board / non-exec positions (C). Part-time employment (B) is welcome but arrives as a by-product of credibility, never a stated ask.
- **Positioning (one line):** *A seasoned product-and-delivery leader who gets stalled software shipped — technical enough to be your de-facto CTO when it counts, bridging business and dev teams, and skilled at the human dynamics that are usually the real reason things stall.*
  - **Order matters:** lead with **product & delivery** (where Nitzan prefers to work and is strongest); "de-facto CTO when needed" is a **secondary** credibility/seniority signal (valuable for board audiences), not the promise. Leading with "CTO" was deliberately rejected because it invites hands-on technical-ownership and detail expectations — the opposite of Nitzan's preference to steer at the overview level.
- **Human/communication wedge** (mediation, Alexander Technique, NLP, committee leadership): a **strong supporting theme** — it's the "how" beneath the positioning, not the headline.
- **Flywheel:** included as a current-proof point — *"Building Flywheel, an AI-driven proprietary algorithmic futures-trading engine (Python/Vue), solo."* No method/IP exposed.
- **Content:** **curate hard** — sharp narrative + 3-4 flagship proof points, not a comprehensive resume dump. Depth optional/secondary.
- **Drop** the "Solution Architect" title framing (reframe ReadyTech role around product/delivery leadership).
- **Message/hook:** demote the old "non-binary problem solving" line from the headline to a deeper paragraph; lead with a plain, outcome-shaped hook.
- **Tech:** plain HTML + Tailwind + vanilla JS, **no build step**; one **simple PHP** endpoint for the contact form.

## Deliverable: two distinct websites (not skins)

Same underlying strategy and facts, genuinely different layout / visual language / copy voice, so feedback is about *voice*, both unmistakably professional:

- **Direction 1 — "Warm Professional":** personality-forward, first-person, human and approachable, clearly senior. Guardrail: clean modern typography, real substance, **zero Byron/hippie/earthy tropes** — disciplined, not fuzzy.
- **Direction 2 — "Sharp & Understated":** minimal, restrained, confident, businesslike; quiet authority with little overt selling (merges the D instinct with corporate polish).

## Shared information architecture (single-page each, curated)

1. **Hero** — name + one-line positioning + outcome-shaped hook (e.g. "I get stuck software moving again" / "Senior product & technical leadership — without the full-time hire").
2. **How I help** — product-and-delivery leadership + delivery unblocker (de-facto CTO when needed); the human-side wedge as the "how".
3. **Selected work** (3-4 proof points, curated): ReadyTech Justice, Guided Resolution, Webko, iConcept.
4. **Currently building** — Flywheel (AI-driven algorithmic futures-trading engine, Python/Vue, solo).
5. **Background & credentials** — Master of IT Leadership (Deakin), Accredited Mediator, Alexander Technique; the unusual mix as credibility texture; the "non-binary problem solving" idea as an optional deeper paragraph.
6. **Contact** — simple form (name / email / message + honeypot) posting to PHP.

### Key content updates vs old site

- **Add** iConcept.net.au — Product & Development Manager, Jan 2025 – July 2026.
- **Add** Flywheel (as above).
- **Reframe** ReadyTech (drop "Solution Architect" title).
- Contact facts: +61 402 263 223, [nk@karni.net.au](mailto:nk@karni.net.au), Suffolk Park NSW.

## Tech approach

- Tailwind via **Play CDN** (no toolchain) for the prototype phase; can compile to a static CSS file later for production.
- Vanilla JS only for small interactions (mobile nav, form submit/validation).
- **contact.php**: validate input, honeypot spam check, send via `mail()`, return JSON; graceful success/error states in the UI. Requires PHP-capable hosting.

## Proposed file structure

- `direction-warm/index.html`, `direction-warm/main.js`
- `direction-sharp/index.html`, `direction-sharp/main.js`
- `api/contact.php` (shared by both)
- `assets/` (any shared images/fonts)
- `README.md` (how to run/host, and how to swap in compiled Tailwind for production)

## Notes / open items

- **Workspace confirmed:** `/Users/nitzankarni/Dev/karninetau` (git repo, branch `main`). The 2024 resume PDF lives here as `Nitzan Karni - Resume.pdf`.
- No decision yet on which direction wins — that's the point of building two.

## Reasoning & decisions (brainstorm record)

Captured so the "why" behind the strategy isn't lost.

### The central tension we resolved
Nitzan's evidence base (solution architect, technical co-founder, 23 years hands-on, and Flywheel — a solo-built AI-driven futures-trading engine) screams "elite hands-on technical builder." His stated wants (not interested in engineering, "behind" on tech, prefers delegating, overview-not-detail, low-pressure, part-time) point the other way. A site must pick a story. Writing purely to his wants risks reading as semi-retired / low-commitment; writing to his evidence attracts the hands-on high-pressure roles he doesn't want. The chosen "third position": **fractional / advisory**, where part-time *is the model* and steering at the overview level *is the job* — so his preferences become features, not liabilities.

### Key judgments
- **"Behind on tech" narrative was rejected.** Building Flywheel now disproves it; on a site it would read as an apology and undercut his best proof of current relevance. Replaced with: *"can go deep enough to be credible, but chooses to operate at the orchestration level."*
- **B (part-time employment) is not a stated ask.** Chasing "hire me as an advisor" and "I'll also take a part-time job" on the same page dilutes the advisory framing and looks income-hungry. Build for A/C; let B arrive as a by-product of credibility.
- **Flywheel:** protect the IP/edge (the "how"), but the *existence* + AI angle is fine and is the strongest single antidote to "he's fallen behind."
- **Positioning sharpened away from "generalist."** "I do everything" is weak for fractional buyers, who hire a sharp point. Nitzan chose A+B (fractional product/delivery + unblocker of stalled products), with the human/communication skills (mediator, Alexander Technique, NLP, committee leadership) as a **strong supporting theme** — a wedge most competitors can't touch.
- **Lead with product-and-delivery, not CTO** (see Positioning note above).
- **Curate hard.** A comprehensive 25-year dump reads like a job-seeker, not a peer to retain. Sharp narrative + 3-4 flagship proof points; depth optional.
- **Hook demoted:** the old "non-binary problem solving" line is cerebral and makes the reader work before attention is earned; moved to a deeper paragraph, replaced by a plain outcome-shaped hook.
- **Two distinct sites, not skins.** Nitzan's own instinct is understated (quiet authority) but suspects the site needs more selling. Rather than argue it, build two and test with others. Explicit worry: the "warm" version must **not** read as Byron/hippie/fuzzy — hence "Warm Professional" with a disciplined-professional guardrail, contrasted against "Sharp & Understated."
- **Stack:** "plain HTML/JS" and "happy with React" conflicted; chose plain HTML + Tailwind + vanilla JS (no build step) as the honest match for a small, twice-skinned, easy-to-host personal site.


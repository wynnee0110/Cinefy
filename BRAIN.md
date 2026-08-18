# 🧠 ProjectBrain — Persistent Memory

> **Auto-generated context file.** Any AI agent in this project should read this
> for prior context. After completing a task, save new memories using:
> ```
> node brain-cli.js save task "what was done"
> node brain-cli.js save lesson "what was learned"
> node brain-cli.js save decision "what was decided"
> ```

**Last updated:** 2026-08-18T14:16:15.668Z
**Total memories:** 21

---

## Tasks

### 2026-08-18_14-16-06-340Z.md
# Tasks Entry

**Date:** 2026-08-18T14:16:06.340Z
**Related Task:** N/A

---

Added GitHub Action workflow keep-alive.yml to ping backend /health endpoint every 10 minutes


### 2026-06-25_04-15-16-222Z.md
# Tasks Entry

**Date:** 2026-06-25T04:15:16.222Z
**Related Task:** N/A

---

Added About nav link in header (desktop + mobile) and created /about page with route


### 2026-06-25_04-06-44-968Z.md
# Tasks Entry

**Date:** 2026-06-25T04:06:44.968Z
**Related Task:** N/A

---

what was done


### 2026-06-25_04-05-17-562Z.md
# Tasks Entry

**Date:** 2026-06-25T04:05:17.562Z
**Related Task:** N/A

---

what was done


### 2026-06-25_04-02-03-442Z.md
# Tasks Entry

**Date:** 2026-06-25T04:02:03.442Z
**Related Task:** N/A

---

Added Upstash Redis caching layer for TMDB API responses to reduce API calls and improve load times


### 2026-06-25_04-02-03-367Z.md
# Tasks Entry

**Date:** 2026-06-25T04:02:03.367Z
**Related Task:** N/A

---

Implemented Continue Watching feature — tracks user watch history via Supabase and displays on home page


### 2026-06-25_04-01-51-225Z.md
# Tasks Entry

**Date:** 2026-06-25T04:01:51.225Z
**Related Task:** N/A

---

Built infinite scroll genre grid, movie detail pages with playback, search page, and MovieRow carousels on home page


---

## Lessons

### 2026-08-18_14-16-15-653Z.md
# Lessons Entry

**Date:** 2026-08-18T14:16:15.653Z
**Related Task:** N/A

---

GitHub Actions schedule cron runs every 10 minutes to prevent Render free-tier instances from going idle after 15 minutes of inactivity


### 2026-06-25_04-15-33-654Z.md
# Lessons Entry

**Date:** 2026-06-25T04:15:33.654Z
**Related Task:** N/A

---

Header nav links use navigate() directly for simple routes like /about — no extra callback prop needed


### 2026-06-25_04-06-45-027Z.md
# Lessons Entry

**Date:** 2026-06-25T04:06:45.027Z
**Related Task:** N/A

---

what was learned


### 2026-06-25_04-05-17-639Z.md
# Lessons Entry

**Date:** 2026-06-25T04:05:17.639Z
**Related Task:** N/A

---

what was learned


### 2026-06-25_04-02-03-668Z.md
# Lessons Entry

**Date:** 2026-06-25T04:02:03.668Z
**Related Task:** N/A

---

Genre grid infinite scroll broke because of stale closure in scroll event handler — fixed with useRef for page counter


### 2026-06-25_04-02-03-587Z.md
# Lessons Entry

**Date:** 2026-06-25T04:02:03.587Z
**Related Task:** N/A

---

MovieRow images caused layout shift — fixed with next/image explicit dimensions and blur placeholders


### 2026-06-25_04-02-03-511Z.md
# Lessons Entry

**Date:** 2026-06-25T04:02:03.511Z
**Related Task:** N/A

---

Arcjet IP detection fails in dev mode — use x-forwarded-for header fallback for local development


---

## Decisions

### 2026-08-18_14-16-09-571Z.md
# Decisions Entry

**Date:** 2026-08-18T14:16:09.571Z
**Related Task:** N/A

---

Used GitHub Action schedule cron with 10 minute interval and workflow_dispatch fallback to default backend URL https://cinefy-backend-l25h.onrender.com/health or optional BACKEND_URL secret


### 2026-06-25_04-15-33-969Z.md
# Decisions Entry

**Date:** 2026-06-25T04:15:33.969Z
**Related Task:** N/A

---

About page follows SearchPage pattern: fixed solid header, pt-20 main offset, black/red theme


### 2026-06-25_04-06-45-084Z.md
# Decisions Entry

**Date:** 2026-06-25T04:06:45.084Z
**Related Task:** N/A

---

what was decided


### 2026-06-25_04-05-17-704Z.md
# Decisions Entry

**Date:** 2026-06-25T04:05:17.704Z
**Related Task:** N/A

---

what was decided


### 2026-06-25_04-02-03-806Z.md
# Decisions Entry

**Date:** 2026-06-25T04:02:03.806Z
**Related Task:** N/A

---

Movie data fetched server-side in page.tsx, passed to client components as props — keeps API keys secure


### 2026-06-25_04-02-03-751Z.md
# Decisions Entry

**Date:** 2026-06-25T04:02:03.751Z
**Related Task:** N/A

---

Using Upstash Redis over Vercel KV — better free tier and native rate limiting support


---

## Architecture

### 2026-06-25_04-01-43-228Z.md
# Architecture Entry

**Date:** 2026-06-25T04:01:43.228Z
**Related Task:** N/A

---

Cinefy: Next.js 14 App Router streaming app. Supabase for auth + database. TMDB API for movie data. Upstash Redis for caching. Arcjet for rate limiting and security. Deployed on Vercel


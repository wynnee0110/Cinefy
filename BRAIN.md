# 🧠 ProjectBrain — Persistent Memory

> **Auto-generated context file.** Any AI agent in this project should read this
> for prior context. After completing a task, save new memories using:
> ```
> node brain-cli.js save task "what was done"
> node brain-cli.js save lesson "what was learned"
> node brain-cli.js save decision "what was decided"
> ```

**Last updated:** 2026-08-18T15:14:46.529Z
**Total memories:** 36

---

## Tasks

### 2026-08-18_15-14-38-368Z.md
# Tasks Entry

**Date:** 2026-08-18T15:14:38.368Z
**Related Task:** N/A

---

Fixed intro animation timer loop and production loading screen freeze


### 2026-08-18_14-48-59-436Z.md
# Tasks Entry

**Date:** 2026-08-18T14:48:59.436Z
**Related Task:** N/A

---

Added inline pitch black #000000 background to html, body, root in index.html and App.tsx to eliminate initial load white flashing


### 2026-08-18_14-47-19-270Z.md
# Tasks Entry

**Date:** 2026-08-18T14:47:19.270Z
**Related Task:** N/A

---

Updated sequence timing so IntroAnimation runs exclusively first before mounting Home screen and routes


### 2026-08-18_14-45-25-395Z.md
# Tasks Entry

**Date:** 2026-08-18T14:45:25.395Z
**Related Task:** N/A

---

Updated intro animation to a minimalist pure-black logo fade reveal


### 2026-08-18_14-43-36-453Z.md
# Tasks Entry

**Date:** 2026-08-18T14:43:36.453Z
**Related Task:** N/A

---

Added cinematic website intro animation and fixed UI inconsistencies across MoviePage and TvPage carousels, headers, and skeleton loaders


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

### 2026-08-18_15-14-46-515Z.md
# Lessons Entry

**Date:** 2026-08-18T15:14:46.515Z
**Related Task:** N/A

---

Passing inline function callbacks (onComplete) into useEffect dependency arrays causes continuous cleanup and timer cancellation on re-renders, causing infinite loading loops


### 2026-08-18_14-49-15-609Z.md
# Lessons Entry

**Date:** 2026-08-18T14:49:15.609Z
**Related Task:** N/A

---

Browser default body color is white (#ffffff) prior to CSS parsing; setting inline style background-color: #000000 on HTML and BODY in index.html prevents pre-load white flashes in dark-mode apps


### 2026-08-18_14-47-28-711Z.md
# Lessons Entry

**Date:** 2026-08-18T14:47:28.711Z
**Related Task:** N/A

---

Preventing background route mounting during intro animation avoids UI flashing and background data fetch layout shifts before the splash screen completes


### 2026-08-18_14-45-37-403Z.md
# Lessons Entry

**Date:** 2026-08-18T14:45:37.403Z
**Related Task:** N/A

---

Minimalist intro splash screens feel cleaner and more premium when focused purely on a single logo scale-fade effect (~1.1s total) without progress bars or extra subtext


### 2026-08-18_14-43-47-842Z.md
# Lessons Entry

**Date:** 2026-08-18T14:43:47.842Z
**Related Task:** N/A

---

Carousel card width mismatches (e.g. 300px image container vs 200px title text) break flex wrap layout and cause horizontal distortion — standardized to w-40 sm:w-48 md:w-56 responsive units


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

### 2026-08-18_15-14-42-213Z.md
# Decisions Entry

**Date:** 2026-08-18T15:14:42.213Z
**Related Task:** N/A

---

Restructured IntroAnimation as a self-contained fixed overlay with an empty dependency array in useEffect to prevent timer reset loops when props change


### 2026-08-18_14-49-11-936Z.md
# Decisions Entry

**Date:** 2026-08-18T14:49:11.936Z
**Related Task:** N/A

---

Set inline style background-color: #000000 on html, body, #root, App wrapper, and IntroAnimation to guarantee zero initial frame flashing before React mounts


### 2026-08-18_14-47-25-115Z.md
# Decisions Entry

**Date:** 2026-08-18T14:47:25.115Z
**Related Task:** N/A

---

Controlled route mounting in App.tsx using isIntroComplete state so Home screen doesn't mount or fetch data until after the intro animation finishes playing


### 2026-08-18_14-45-32-722Z.md
# Decisions Entry

**Date:** 2026-08-18T14:45:32.722Z
**Related Task:** N/A

---

Designed minimalist intro screen with pure black background, subtle red ambient glow, and centered logo scale-fade transition lasting ~1.1 seconds


### 2026-08-18_14-43-44-605Z.md
# Decisions Entry

**Date:** 2026-08-18T14:43:44.605Z
**Related Task:** N/A

---

Used sessionStorage for IntroAnimation to trigger cinematic splash on site entry while preserving instant navigation on internal page transitions


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


# Project 58 — mobile-first PWA

A lightweight, installable web app for nutrition logging, home workouts, weight check-ins, water tracking and a cook-facing meal guide.

## Run locally
- Unzip the folder.
- Open a terminal in this folder.
- Run `python -m http.server 8000`
- Open `http://localhost:8000` on your computer.
- For phone testing on the same Wi-Fi, use your computer's local IP and port 8000. Install/PWA features generally require HTTPS or localhost.

## Free hosting (GitHub Pages)
1. Create a GitHub account and a new public repository named `project58`.
2. Upload the contents of this folder (not the zip itself).
3. In repository Settings → Pages, select deploy from branch `main`, folder `/ (root)`.
4. Wait for the published Pages URL, then open it in Chrome on Android.
5. Chrome menu → **Install app** or **Add to Home screen**.

Alternative: drag the folder into a static host such as Netlify Drop. Hosting providers change their free-tier terms, so check current limits.

## Data and privacy — important
- Version 1 stores entries in the browser's local storage on that device.
- No account, server database, analytics or cloud sync is configured.
- Clearing browser data or changing phones can remove locally stored entries. Export/backup and cloud sync are planned next.
- The cook view is a view inside the same app, not yet a separate protected account. Do not enter sensitive information.
- Offline caching is included. First visit requires internet to load the app and web font; core screens work after assets have been cached.

## Current limitations
- Water logging is manual. This version does not send scheduled background notifications.
- Food macros/calories and recipe figures are estimates; brands, recipes and cooking oil change values.
- The training plan assumes adjustable dumbbells and bands for some movements. Use bodyweight alternatives until equipment is available, begin with 2 sets, and progress gradually.
- This is a planning and tracking tool, not medical advice.

## Privacy-friendly defaults
- The public code contains no personal body weight, goal weight, medical details, or personal nutrition targets.
- New installs start with generic, editable targets and no recorded weight.
- Your food diary, water, habits, and weight check-ins stay in that device's local browser storage unless you later choose to add an export or sync feature.
- This app is for planning and tracking, not medical advice. Discuss health concerns with a qualified clinician.

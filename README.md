# Nutrition Helper

A browser-based food and weight tracker. Log what you eat against daily budgets for calories, protein, fat, carbs and sodium, record weigh-ins with body fat %, and see how much of each budget is left.

## Try it

**[Open Nutrition Helper → petravanta.github.io/nutrition-helper](https://petravanta.github.io/nutrition-helper/)**

It runs in any modern browser on phone or desktop, with no sign-up. On a phone, use *Add to Home Screen* to open it like an app.

## What it does

- **Today:** eaten vs. target for calories, protein (a minimum), fat, carbs and sodium (a maximum), with what's left of each. Step back and forward through days.
- **Food entries:** add a food with its nutrition, and remove it again.
- **Weigh-ins:** one per day, with optional body fat %, in lb or kg.
- **Targets:** set daily targets in *Settings*. A change applies from that day on, so earlier days keep the targets they had.

Coming next: food search and barcode scanning with weight, volume and serving units; trend weight, goal weight and weekly recalibration; and importing a MacroFactor export.

## Your data

Everything is stored in your browser (`localStorage`). Turn on **Google Drive sync** (below) to keep a copy in your own Drive and pick up on another device. **Export backup** under *Settings* downloads a JSON file with everything, and **Import backup** merges one back in.

## Running it

It's a single static file, `index.html`, with no build step. Open it in a browser, or serve it with GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

## Google Drive sync

Under *Settings → Google Drive*, **Connect Google Drive** signs you in with Google and keeps a file called `Nutrition Helper data.json` in your Drive. It saves a few seconds after each change. When you connect on another device, the app merges both copies: every food entry and weigh-in is kept (the latest edit of each wins, and deletions carry over), and the most recently changed settings win. The app uses the `drive.file` permission, so it can only see the file it creates, not the rest of your Drive.

Google sign-ins last about an hour. The app keeps the sign-in across reloads and renews it the next time you tap something when it's close to running out. If it lapses, tap **Resume Drive sync** in the header. Everything still saves in the browser in the meantime.

The app uses the shared OAuth client for `https://petravanta.github.io` (`GOOGLE_CLIENT_ID` near the top of the script); see the [shared standards](https://github.com/petravanta/general/blob/main/STANDARDS.md). While that client's consent screen is in *Testing*, only Google accounts added as test users can connect.

Part of [Peter's apps](https://petravanta.github.io/general/).

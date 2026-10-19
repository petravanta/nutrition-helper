# Nutrition Helper

A browser-based food and weight tracker. Log what you eat against daily budgets for calories, protein, fat, carbs and sodium, record weigh-ins with body fat %, and see how much of each budget is left.

## Try it

**[Open Nutrition Helper → petravanta.github.io/nutrition-helper](https://petravanta.github.io/nutrition-helper/)**

It runs in any modern browser on phone or desktop, with no sign-up.

**Install it as an app.** On Android, open the link in Chrome, tap the ⋮ menu and choose *Install app* (or *Add to Home screen*). It then opens full screen from its own icon, works without a connection (food search and Drive sync wait until you're back online), and long-pressing the icon offers shortcuts: *Log food*, *Scan* and *Weigh in*. On iPhone, use Safari's Share → *Add to Home Screen*.

## What it does

- **Today:** eaten vs. target for calories, protein (a minimum), fat, carbs and sodium (a maximum), with what's left of each. Step back and forward through days.
- **Food search:** type a food to search your own foods and recipes, [Open Food Facts](https://world.openfoodfacts.org) (branded and packaged foods) and [USDA FoodData Central](https://fdc.nal.usda.gov) (generic foods). Any food you open from a search or a barcode is kept, so it shows under *Recent* and in your own foods next time without another lookup (the latest 60 you never logged are kept).
- **Suggestions:** before you type, *Suggested for now* lists the foods and recipes you're most likely to want, ranked by how often you log them, how recently (a month's half-life) and how close to this time of day you usually have them. Tap one to adjust the amount, or its **+** button to add your usual portion in one go.
- **Recipes:** group foods you eat together. Log a meal, then *Save as recipe* on Today, or build one under *Foods*. A recipe says how many servings it makes; logging it asks how many you had and adds each food scaled to that, so every nutrient is still tracked per food. On Today a recipe shows as one line with its foods under it, each still editable.
- **Barcode scanning:** scan with the phone camera, or type the number. Barcodes come from Open Food Facts; if a product isn't there, enter it once from the label and it's saved with its barcode.
- **Units:** log by serving (like "1 bar" or "1 cup, chopped"), by weight (g, oz, lb, kg) or, for drinks, by volume (ml, tsp, tbsp, fl oz, cup, l). Switching units keeps the same amount of food. Units are sticky: each food opens with the amount you last logged, and whichever weight or volume unit you last picked (grams vs ounces, say) becomes the default for every food.
- **Every nutrient kept:** foods keep every nutrient their source reports (fiber, sugars, fat types, cholesterol, vitamins, minerals, caffeine and so on, plus anything else USDA, Open Food Facts or a MacroFactor export lists). Today shows the five budget numbers; *All nutrients* on a food shows the rest for the amount you're logging. Each logged entry keeps its nutrients too, ready for detail views and reports.
- **My foods:** foods you create or log are kept, with their servings, for quick reuse. Edit or remove them under *Foods*.
- **Quick add:** log calories and macros directly for meals out.
- **Weigh-ins:** one per day, with optional body fat %, in lb or kg.
- **Measurements:** body measurements (neck, chest, arms, waist, hips, thighs, calves and more; pick which under *Choose measurements*) in cm or inches, sticky like the other units. Each check-in starts every box at your last value, so you adjust only what you re-measured and slower-moving measurements carry forward. The table shows each one's current value, its last change and the change since you started; Trends charts each one over time.
- **Trend weight:** a smoothed weight that filters out day-to-day water swings (an exponential moving average, 10% per weigh-in).
- **Expenditure:** how many calories you burn a day, measured from what you log and how your trend weight moves (over the last 3 weeks, at 7,700 kcal per kg, eased in gradually). Until there's enough logging, it starts from your profile (Mifflin-St Jeor times your activity level).
- **Goal weight:** set a target and pick a pace as a share of body weight per week. Each pace shows the daily calories it takes, given your current expenditure, and the date you'd reach the target. Protein is set per unit of body weight, fat as a share of calories, and carbs fill the rest. Calories never drop below your resting needs (or 1,200).
- **Weekly check-in:** once a week, Today offers a new budget from your latest expenditure. Apply it, or skip it for today. Once you reach the target, the check-in switches to holding your weight.
- **Trends:** charts of weight (scale, trend and the planned goal path), expenditure, body fat, and each nutrient against its target, over 1 month, 3 months, 6 months, 1 year or everything. Long ranges show weekly averages. Hover or arrow-key through any chart to read values, or open its data table.
- **Targets:** set daily targets by hand in *Settings*, or let the goal and check-ins set them. A change applies from that day on, so earlier days keep the targets they had.
- **Import from MacroFactor:** under *Settings*, pick MacroFactor's `.xlsx` export (or a Google Sheets copy downloaded as Excel). You see what will come in before anything is saved: daily food totals, weigh-ins with body fat %, custom foods and favorites, and your profile if you haven't filled one in. Days already logged in this app are left alone, and importing the same export again updates rather than duplicates. The file is read in the browser with [SheetJS](https://sheetjs.com) and never uploaded; only the imported records are kept, in your browser and your Drive.

USDA search uses the shared `DEMO_KEY`, which has a low hourly limit per network. A free personal key from [fdc.nal.usda.gov/api-key-signup](https://fdc.nal.usda.gov/api-key-signup) can be added under *Settings → Food search*.

## Your data

Foods store nutrition per 100 g (or 100 ml) in `per100`, keyed by the nutrient catalog near the top of the script (`NUTRIENTS`: name, unit, group, USDA ids, Open Food Facts key). Nutrients outside the catalog are kept under `fdc:<id>`, `off:<name>` or `mf:<name>` with their name and unit in the food's `nmeta`. Each entry has the five budget metrics as fields and the other catalog nutrients in `more`; anything rarer can be worked out from the entry's `foodId` and `amt`. Measurement check-ins (`measurements`) are `{date, v: {site: cm}}` holding only the sites measured that day; a site's current value is its latest check-in. Recipes (`recipes`) list their foods as `{foodId, qty, unit}` with how many `servings` they make; entries logged from a recipe carry `recipe: {id, name, group, servings}`, where `group` ties together the foods of one log.

Everything is stored in your browser (`localStorage`). Turn on **Google Drive sync** (below) to keep a copy in your own Drive and pick up on another device. **Export backup** under *Settings* downloads a JSON file with everything, and **Import backup** merges one back in.

## Running it

It's a single static page, `index.html`, with no build step, plus `manifest.webmanifest`, `sw.js` and `icons/` that make it installable. The service worker fetches the page network-first, so a new version shows up the next time the app opens online; bump `CACHE` in `sw.js` when the list of cached files changes. Open it in a browser, or serve it with GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

## Google Drive sync

Under *Settings → Google Drive*, **Connect Google Drive** signs you in with Google and keeps a file called `Nutrition Helper data.json` in your Drive. It saves a few seconds after each change. When you connect on another device, the app merges both copies: every food entry and weigh-in is kept (the latest edit of each wins, and deletions carry over), and the most recently changed settings win. The app uses the `drive.file` permission, so it can only see the file it creates, not the rest of your Drive.

Google sign-ins last about an hour. The app keeps the sign-in across reloads and renews it the next time you tap something when it's close to running out. If it lapses, tap **Resume Drive sync** in the header. Everything still saves in the browser in the meantime.

The app uses the shared OAuth client for `https://petravanta.github.io` (`GOOGLE_CLIENT_ID` near the top of the script); see the [shared standards](https://github.com/petravanta/general/blob/main/STANDARDS.md). While that client's consent screen is in *Testing*, only Google accounts added as test users can connect.

Part of [Peter's apps](https://petravanta.github.io/general/).

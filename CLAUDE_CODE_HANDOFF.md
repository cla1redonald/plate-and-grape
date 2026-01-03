# PlateAndGrape - Claude Code Handoff

## Project Status: Phase 3 Build (In Progress)

**Last updated:** 3 Jan 2026

---

## What's Built ✅

### Infrastructure
- ✅ GitHub repo: https://github.com/cla1redonald/plate-and-grape
- ✅ Vercel deployment: https://plate-and-grape.vercel.app
- ✅ Supabase project: mxvxvfhveppnwvtrrqcq
- ✅ Database schema applied
- ✅ Storage bucket `captures` created with public policies
- ✅ CI/CD pipeline configured

### Features Working
- ✅ Camera capture (menu + wine list) - iOS safe area fixed
- ✅ Preferences screen (cuisines, price, allergies, dislikes)
- ✅ AI-powered pairing via Claude API
- ✅ Three ranked recommendations with reasoning
- ✅ Refinement flow (quick chips + text input) - NEEDS DEPLOY

### Environment Variables (in Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## Pending Deploy

The following fix needs to be deployed:

```bash
cd ~/plate-and-grape
unzip -o ~/Downloads/refinement-fix.zip
git add .
git commit -m "fix: Refinement chips and input text visibility"
git push
vercel --prod
```

**What the fix includes:**
1. Input text now visible (darker color)
2. Quick refinement chips work (pass image URLs to AI)
3. Chat/send button works
4. AI gets original images when refining

---

## Known Issues to Fix

1. **Refinement not deployed yet** - see above
2. **No loading indicator during refinement** - UI doesn't show loading state when refining
3. **Error messages could be more user-friendly**

---

## Remaining Work (Phase 4: Polish & Test)

### High Priority
- [ ] Test full flow on real restaurant menu
- [ ] Add loading spinner during refinement
- [ ] Better error messages for common failures
- [ ] Handle case where AI can't read menu/wine list

### Medium Priority
- [ ] Add "Start Over" button on results screen
- [ ] Persist preferences to localStorage as backup
- [ ] Add haptic feedback on iOS (optional)

### Low Priority / V2
- [ ] Save pairing history
- [ ] Rate past pairings
- [ ] User accounts/authentication
- [ ] Share recommendations

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Hosting:** Vercel
- **Testing:** Jest, React Testing Library

---

## Key Files

```
src/
├── app/
│   ├── page.tsx                    # Entry point
│   ├── PlateAndGrapeApp.tsx        # Main app component
│   ├── layout.tsx                  # Root layout with viewport
│   └── globals.css                 # Global styles + iOS safe areas
├── components/
│   ├── camera/
│   │   ├── CameraCapture.tsx       # Camera capture overlay
│   │   └── CaptureButton.tsx       # Menu/wine capture buttons
│   ├── preferences/
│   │   └── PreferencesForm.tsx     # Preferences screen
│   ├── recommendations/
│   │   └── RecommendationCard.tsx  # Pairing recommendation card
│   ├── refinement/
│   │   └── RefinementInput.tsx     # Quick chips + text input
│   └── ui/
│       ├── Button.tsx              # Primary/secondary buttons
│       ├── Chip.tsx                # Toggle chips
│       ├── RadioGroup.tsx          # Radio button group
│       ├── TagInput.tsx            # Tag input for allergies
│       └── LoadingScreen.tsx       # Loading overlay
├── lib/
│   ├── actions/
│   │   ├── pairings.ts             # Server actions for AI pairing
│   │   └── preferences.ts          # Server actions for preferences
│   ├── ai/
│   │   └── provider.ts             # Claude AI provider
│   └── db/
│       ├── queries.ts              # Database queries
│       └── supabase.ts             # Supabase client
└── types/
    └── index.ts                    # TypeScript types
```

---

## Color Palette

- Deep Burgundy: `#722F37` (primary)
- Warm Cream: `#FAF7F2` (background)
- Charcoal: `#2D2D2D` (text)
- Soft Gold: `#C9A962` (accent)
- Muted Sage: `#7D8471` (success)

---

## Definition of Done

MVP is complete when:
- [ ] Core flow works: capture → match → recommendations
- [ ] Refinement works: can adjust recommendations in-session
- [ ] Preferences work: can set and apply preferences
- [ ] Looks polished on mobile
- [ ] Tests passing
- [ ] Creator has used it at an actual restaurant

---

## Useful Commands

```bash
# Development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Tests
npm test

# Build
npm run build

# Deploy
vercel --prod
```

---

## Links

- **Live App:** https://plate-and-grape.vercel.app
- **GitHub:** https://github.com/cla1redonald/plate-and-grape
- **Supabase:** https://supabase.com/dashboard/project/mxvxvfhveppnwvtrrqcq
- **Vercel:** https://vercel.com/claire-donalds-projects/plate-and-grape

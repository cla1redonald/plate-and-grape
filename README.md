# PlateAndGrape 🍽️🍷

Your pocket sommelier - snap photos of the menu and wine list, get instant food + wine pairing recommendations optimised for taste and value.

## What it does

PlateAndGrape takes the stress out of choosing wine at restaurants. Take photos of the food menu and wine list, tap one button, and get three smart pairing recommendations based on your preferences - all in under 30 seconds.

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase account (free tier works)
- Anthropic API key

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/[your-username]/plate-and-grape.git
   cd plate-and-grape
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your values (see [Environment Variables](#environment-variables))

4. Set up Supabase database
   - Create a new Supabase project
   - Run the SQL in `supabase/schema.sql` in the SQL editor

5. Run locally
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `NEXT_PUBLIC_APP_URL` | App URL (localhost for dev) | Yes |

## Usage

1. **Open the app** - camera view appears
2. **Capture menu** - take a photo of the food menu
3. **Capture wine list** - take a photo of the wine list
4. **Match** - tap the Match button
5. **Get recommendations** - see 3 pairings with reasoning
6. **Refine** - ask for lighter, cheaper, or different options

### Setting Preferences

Tap the settings icon to set:
- Cuisine styles you enjoy
- Price sensitivity (budget/moderate/premium)
- Allergies (these are strictly avoided)
- Dislikes (foods/wines to avoid)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

## Development

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Deployment

This project is configured for Vercel deployment:

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
src/
├── app/                  # Next.js pages and routes
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── camera/          # Camera capture components
│   ├── recommendations/ # Recommendation display
│   ├── refinement/      # Refinement input
│   └── preferences/     # Preferences form
├── lib/                 # Utilities
│   ├── db/             # Database client and queries
│   ├── ai/             # AI provider integration
│   └── actions/        # Server actions
└── types/              # TypeScript types
```

## License

MIT

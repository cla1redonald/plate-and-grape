#!/bin/bash

# PlateAndGrape Infrastructure Setup Script
# Run this from inside the plate-and-grape directory on your local machine

set -e  # Exit on any error

echo "🍽️🍷 PlateAndGrape Infrastructure Setup"
echo "========================================"
echo ""

# Check we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from inside the plate-and-grape directory"
    exit 1
fi

# Check CLIs are available
echo "Checking CLI tools..."
command -v gh >/dev/null 2>&1 || { echo "❌ gh CLI not found"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo "❌ vercel CLI not found"; exit 1; }
command -v supabase >/dev/null 2>&1 || { echo "❌ supabase CLI not found"; exit 1; }
echo "✅ All CLI tools found"
echo ""

# Step 1: GitHub
echo "📦 Step 1: Creating GitHub Repository..."
echo "----------------------------------------"
git init
git add .
git commit -m "Initial commit: PlateAndGrape project setup"
gh repo create plate-and-grape --public --source=. --push
echo "✅ GitHub repo created and code pushed"
echo ""

# Step 2: Supabase
echo "🗄️ Step 2: Creating Supabase Project..."
echo "----------------------------------------"
echo "Creating new Supabase project (this may take a minute)..."

# Create Supabase project and capture output
SUPABASE_OUTPUT=$(supabase projects create plate-and-grape --org-id $(supabase orgs list --output json | jq -r '.[0].id') --db-password "$(openssl rand -base64 16)" --region eu-west-2 --output json 2>&1) || {
    echo "⚠️  If this failed, you may need to create the project manually at supabase.com"
    echo "   Then run: supabase link --project-ref YOUR_PROJECT_REF"
}

echo "$SUPABASE_OUTPUT"
echo ""

# Link to project
echo "Linking to Supabase project..."
supabase link || echo "⚠️  Link manually if needed"

# Run schema
echo "Applying database schema..."
supabase db push || {
    echo "⚠️  Schema push failed. Apply manually:"
    echo "   Copy contents of supabase/schema.sql to Supabase SQL Editor"
}
echo ""

# Get Supabase credentials
echo "Fetching Supabase credentials..."
SUPABASE_URL=$(supabase status --output json 2>/dev/null | jq -r '.api_url // empty')
SUPABASE_ANON_KEY=$(supabase status --output json 2>/dev/null | jq -r '.anon_key // empty')
SUPABASE_SERVICE_KEY=$(supabase status --output json 2>/dev/null | jq -r '.service_role_key // empty')

if [ -z "$SUPABASE_URL" ]; then
    echo "⚠️  Couldn't auto-fetch credentials. Get them from Supabase Dashboard → Settings → API"
else
    echo "✅ Supabase credentials retrieved"
fi
echo ""

# Step 3: Environment file
echo "📝 Step 3: Creating .env.local..."
echo "----------------------------------------"
cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL:-your_supabase_url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-your_anon_key}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY:-your_service_key}

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
echo "✅ .env.local created (you'll need to add your ANTHROPIC_API_KEY)"
echo ""

# Step 4: Vercel
echo "🚀 Step 4: Deploying to Vercel..."
echo "----------------------------------------"
echo "This will open an interactive setup..."
echo ""
vercel --yes || echo "⚠️  Vercel deployment needs manual setup"
echo ""

# Step 5: Set Vercel environment variables
echo "🔐 Step 5: Setting Vercel Environment Variables..."
echo "----------------------------------------"
if [ -n "$SUPABASE_URL" ]; then
    vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$SUPABASE_URL" 2>/dev/null || true
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY" 2>/dev/null || true
    vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SUPABASE_SERVICE_KEY" 2>/dev/null || true
    echo "✅ Supabase env vars added to Vercel"
else
    echo "⚠️  Add environment variables manually in Vercel Dashboard"
fi

echo ""
echo "⚠️  You still need to add ANTHROPIC_API_KEY to Vercel manually:"
echo "   vercel env add ANTHROPIC_API_KEY production"
echo ""

# Step 6: Production deploy
echo "🚀 Step 6: Production Deployment..."
echo "----------------------------------------"
vercel --prod || echo "⚠️  Production deploy needs manual trigger"
echo ""

# Done!
echo "========================================"
echo "🎉 Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Add your ANTHROPIC_API_KEY to .env.local"
echo "2. Add ANTHROPIC_API_KEY to Vercel: vercel env add ANTHROPIC_API_KEY production"
echo "3. Redeploy: vercel --prod"
echo ""
echo "Your app should be live at the Vercel URL shown above!"
echo ""

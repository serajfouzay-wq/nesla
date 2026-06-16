#!/bin/bash
# ============================================================
# SHE Day 2026 — Round 2 fixes: real video/photo games,
# real admin dashboard, Nestlé-branded header, animated
# background, sound effects.
# Run this from /workspaces/nesla
# ============================================================
set -e

echo "🎮 Deploying fixes..."

cp nesla-gaming-ui/src/app/globals.css ./src/app/globals.css
cp nesla-gaming-ui/src/components/NavBar.js ./src/components/NavBar.js

mkdir -p ./src/lib
cp nesla-gaming-ui/src/lib/sounds.js ./src/lib/sounds.js

mkdir -p ./src/components/games
cp nesla-gaming-ui/src/components/games/HazardVideoScene.js ./src/components/games/HazardVideoScene.js
cp nesla-gaming-ui/src/components/games/OfficeHazardScene.js ./src/components/games/OfficeHazardScene.js
cp nesla-gaming-ui/src/components/games/ExerciseDragSort.js ./src/components/games/ExerciseDragSort.js
cp nesla-gaming-ui/src/components/games/SukuSukuSeparuhPlate.js ./src/components/games/SukuSukuSeparuhPlate.js

# These two are now FULLY REPLACED — real games wired in, no manual edit needed
cp nesla-gaming-ui/src/app/modules/slip-trip-fall/page.js ./src/app/modules/slip-trip-fall/page.js
cp nesla-gaming-ui/src/app/modules/safe-driving/page.js ./src/app/modules/safe-driving/page.js

# Real admin dashboard (the old file was an accidental leaderboard duplicate)
cp nesla-gaming-ui/src/app/admin/page.js ./src/app/admin/page.js

echo "✅ Done!"
echo ""
echo "Still using inline placeholders (need YOUR manual swap, same as before):"
echo "  - src/app/modules/exercise/page.js       → use ExerciseDragSort"
echo "  - src/app/modules/balanced-diet/page.js  → use SukuSukuSeparuhPlate"
echo "  See INTEGRATION.md."
echo ""
echo "▶️  git add . && git commit -m 'Fix games, admin, branding, bg, sound' && git push origin main"

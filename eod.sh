#!/bin/bash

# Exit immediately if any command fails
set -e

BRANCH_NAME="dev"
REMOTE_NAME="origin"
COMMIT_MSG="EOD Dev Save: $(date +'%Y-%m-%d %H:%M:%S')"

echo "➕ Staging all local modifications and untracked files FIRST..."
git add -A

# Save progress right where you stand
if ! git diff-index --quiet HEAD --; then
    echo "💾 Saving current progress..."
    git commit -m "$COMMIT_MSG"
else
    echo "ℹ️ No new changes to commit."
fi

echo "🔄 Ensuring we are on branch: $BRANCH_NAME..."
git checkout $BRANCH_NAME || git checkout -b $BRANCH_NAME

echo "🚀 Overwriting remote changes on $REMOTE_NAME/$BRANCH_NAME..."
git push $REMOTE_NAME $BRANCH_NAME --force

# ==========================================
# 2. BULLETPROOF CLEANUP TO PROD 
# ==========================================
echo "🧹 Overwriting production branch files with dev..."
git checkout prod

# Force prod's working folder to match dev's files exactly (Bypasses merge conflicts!)
git checkout dev -- .

# Stage all files, including any deletions or renames
git add -A

# Commit the single, clean production change
git commit -m "Production Release: $(date +'%Y-%m-%d')"

echo "☁️ Pushing clean updates to production remote..."
git push $REMOTE_NAME prod

# Sync your local dev branch back up with the new prod timeline
git checkout dev
git reset --hard prod

echo "🎉 Success! Remote has been overwritten with your local state, and prod is clean."

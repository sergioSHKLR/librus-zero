#!/bin/bash

# 1. Exit immediately if any command fails
set -e

BRANCH_NAME="dev"
REMOTE_NAME="origin"
COMMIT_MSG="EOD Dev Save: $(date +'%Y-%m-%d %H:%M:%S')"

echo "➕ Staging all local modifications and untracked files FIRST..."
# This saves your work immediately BEFORE switching branches so Git won't block you
git add -A

# Commit changes right here on whatever branch you are currently standing on
if ! git diff-index --quiet HEAD --; then
    echo "💾 Saving current progress..."
    git commit -m "$COMMIT_MSG"
else
    echo "ℹ️ No new changes to commit."
fi

echo "🔄 Switching to branch: $BRANCH_NAME..."
# Now that your work is safely committed, Git will let you switch branches flawlessly
git checkout $BRANCH_NAME || git checkout -b $BRANCH_NAME

echo "🚀 Overwriting remote changes on $REMOTE_NAME/$BRANCH_NAME..."
git push $REMOTE_NAME $BRANCH_NAME --force

# ==========================================
# 2. CLEAN CLEANUP TO PROD (The missing part)
# ==========================================
echo "🧹 Cleaning up and prepping production branch..."
git checkout prod

# Squash all the dev mess into a single staging block
git merge dev --squash

# Commit the single, clean production change
git commit -m "Production Release: $(date +'%Y-%m-%d')"

echo "☁️ Pushing clean updates to production remote..."
git push $REMOTE_NAME prod

# Sync your local dev branch back up with the new prod timeline
git checkout dev
git reset --hard prod

echo "✅ Success! Remote has been overwritten with your local state, and prod is clean."

# Sync current branch from upstream
$ErrorActionPreference = "Stop"

# Get current branch
$branch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($branch)) {
    Write-Host "Error: Could not determine current branch." -ForegroundColor Red
    exit 1
}

Write-Host ">>> Synchronizing '$branch' from upstream..." -ForegroundColor Cyan

# 1. Stash local changes
Write-Host "Step 1: Stashing local changes..." -ForegroundColor Yellow
$stashOutput = git stash push -m "Auto-stash before sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$hasStashed = $stashOutput -like "*Saved working directory*"

# 2. Fetch upstream
Write-Host "Step 2: Fetching from upstream..." -ForegroundColor Yellow
git fetch upstream

# 3. Merge
Write-Host "Step 3: Merging upstream/$branch into $branch..." -ForegroundColor Yellow
git merge upstream/$branch --no-edit

if ($LASTEXITCODE -ne 0) {
    Write-Host "!!! Conflict detected during merge. Please resolve manually." -ForegroundColor Red
    Write-Host "The stash is still available: stash@{0}" -ForegroundColor Gray
    exit 1
}

# 4. Pop stash
if ($hasStashed) {
    Write-Host "Step 4: Restoring local changes..." -ForegroundColor Yellow
    git stash pop
    if ($LASTEXITCODE -ne 0) {
        Write-Host "!!! Conflict detected while restoring stash. Please resolve manually." -ForegroundColor Red
    }
}

Write-Host "`n✅ Successfully updated from upstream!" -ForegroundColor Green

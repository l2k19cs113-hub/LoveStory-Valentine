# LoveStory GitHub Uploader Script

$gitPath = "C:\Program Files\Git\bin\git.exe"

Write-Host "Initializing Git..." -ForegroundColor Cyan
& $gitPath init

Write-Host "Adding files..." -ForegroundColor Cyan
& $gitPath add .

Write-Host "Creating initial commit..." -ForegroundColor Cyan
& $gitPath commit -m "Fix: Restore missing App.jsx and add HeartCatcher game"

Write-Host "Adding remote origin..." -ForegroundColor Cyan
# Clear origin if it exists to avoid error
& $gitPath remote remove origin | Out-Null
& $gitPath remote add origin https://github.com/l2k19cs113-hub/LoveStory-Valentine.git

Write-Host "Setting branch to main..." -ForegroundColor Cyan
& $gitPath branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "A browser window may open for you to log in." -ForegroundColor Yellow
& $gitPath push -u origin main

Write-Host "Success! Your Valentine project is live on GitHub." -ForegroundColor Green
pause

# LoveStory GitHub Uploader Script

Write-Host "Initializing Git..." -ForegroundColor Cyan
git init

Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: LoveStory Digital Valentine Surprise"

Write-Host "Adding remote origin..." -ForegroundColor Cyan
git remote add origin https://github.com/l2k19cs113-hub/LoveStory-Valentine.git

Write-Host "Setting branch to main..." -ForegroundColor Cyan
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "A browser window may open for you to log in." -ForegroundColor Yellow
git push -u origin main

Write-Host "Success! Your Valentine project is live on GitHub." -ForegroundColor Green
pause

$backendDir = "D:\todo-applicaion\backend"
$frontendDir = "D:\todo-applicaion\frontend"

Write-Host "Starting Backend on port 3000..."
$job1 = Start-Job -ScriptBlock { param($d) Set-Location $d; node dist/bin/server.js } -ArgumentList $backendDir
Write-Host "Backend PID: $($job1.Id)"

Start-Sleep -Seconds 5

Write-Host "Starting Frontend on port 5173..."
$job2 = Start-Job -ScriptBlock { param($d) Set-Location $d; npx vite --host } -ArgumentList $frontendDir
Write-Host "Frontend PID: $($job2.Id)"

Write-Host ""
Write-Host "Backend: http://localhost:3000"
Write-Host "Frontend: http://localhost:5173"
Write-Host ""
Write-Host "Press Ctrl+C to stop"
while ($true) { Start-Sleep -Seconds 10 }

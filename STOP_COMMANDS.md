# Stop Commands - Fixed

## Correct PowerShell Commands

### Stop Backend (Port 3000)
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Stop Frontend (Port 5173)
```powershell
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Stop All Node Processes
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Alternative: Stop by Process ID
```powershell
# First, find the process ID
Get-NetTCPConnection -LocalPort 3000

# Then stop it (replace PID with actual number)
Stop-Process -Id <PID> -Force
```

## Why the Previous Command Failed

The issue was with piping `Select-Object -ExpandProperty` directly to `Stop-Process`. The correct approach is to use `ForEach-Object` to iterate and stop each process by ID.

## Current Status

✅ **Backend**: Running on port 3000
✅ **Frontend**: Running on port 5173

Both services are operational and ready to use!



# How to Stop Service on localhost:3000

## Quick Method (PowerShell)

### Option 1: Stop by Port (Recommended)
```powershell
# Find and stop process on port 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique | 
    ForEach-Object { Stop-Process -Id $_ -Force }
```

### Option 2: Stop All Node.js Processes
```powershell
# Stop all Node.js processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Option 3: Find Process First, Then Stop
```powershell
# Step 1: Find the process
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Step 2: Stop it (replace PID with the number from step 1)
Stop-Process -Id <PID> -Force
```

## Alternative Methods

### Using Command Prompt (CMD)
```cmd
# Find process
netstat -ano | findstr :3000

# Stop process (replace PID with the number from above)
taskkill /PID <PID> /F
```

### Using Task Manager
1. Open Task Manager (Ctrl + Shift + Esc)
2. Go to "Details" tab
3. Find "node.exe" process
4. Right-click → End Task

### Using Resource Monitor
1. Open Resource Monitor (Win + R, type `resmon`)
2. Go to "Network" tab
3. Find port 3000 in "Listening Ports"
4. Right-click the process → End Process

## Verify It's Stopped

After stopping, verify:
```powershell
# Check if port 3000 is free
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

# If nothing is returned, the port is free
```

Or test the endpoint:
```powershell
# This should fail if service is stopped
Invoke-WebRequest http://localhost:3000/api/health -ErrorAction Stop
```

## One-Liner Commands

**PowerShell (Quick Stop):**
```powershell
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess -Unique | Stop-Process -Force
```

**PowerShell (Stop All Node):**
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

**CMD:**
```cmd
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %a
```

## Restart the Service

After stopping, you can restart with:
```powershell
cd d:\Eterna_labs_intern
npm start
```

Or in development mode:
```powershell
npm run dev
```


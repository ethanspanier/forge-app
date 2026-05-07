# FORGE — Getting Started

## Step 1: Install Node.js
Download and install Node.js LTS from: **https://nodejs.org**

After installing, open a **new** PowerShell window and verify:
```powershell
node -v   # should show v20.x or v22.x
npm -v    # should show 10.x
```

## Step 2: Install dependencies
```powershell
cd "C:\Users\espanier\Claude Code Projects\Workout.Meal Prep Project\forge-app"
npm install
```

## Step 3: Run the dev server
```powershell
npm run dev
```
Then open: http://localhost:5173

## Step 4: Test on your phone
1. Make sure your phone is on the same WiFi as this PC
2. Run `npm run build && npm run preview`
3. Your terminal will show a Network URL like `http://192.168.x.x:4173`
4. Open that URL on your phone

## Step 5: Install as a phone app (PWA)
**iOS (Safari):**
- Open the Network URL in Safari
- Tap the Share button (box with arrow)
- Tap "Add to Home Screen"
- Tap "Add"

**Android (Chrome):**
- Open the Network URL in Chrome
- Tap the three-dot menu
- Tap "Install App" or "Add to Home Screen"

## Troubleshooting
- If `npm install` fails: make sure you're in the `forge-app` directory
- If fonts don't load: check your internet connection (Google Fonts CDN)
- If phone can't connect: check that Windows Firewall allows port 4173
  - PowerShell (admin): `netsh advfirewall firewall add rule name="Vite Preview" dir=in action=allow protocol=TCP localport=4173`

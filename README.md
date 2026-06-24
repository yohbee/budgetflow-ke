# BudgetFlow KE

A React + Node budget management app for tracking your KSh 3,000 budget, receiving SMS-forwarded M-Pesa messages, categorizing transactions, and giving money-flow feedback.

## Budget
- Groceries: 250
- Fare: 250
- Food: 500
- Airtime: 140
- Long-term savings: 500
- Emergency fund: 360
- Short-term savings: 500

## Run backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

## Run frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## SMS Forwarder setup
Use an Android SMS Forwarder app that can send HTTP POST requests.

Webhook URL:
```txt
http://YOUR_SERVER_IP:5000/api/sms
```

JSON body example:
```json
{
  "message": "MPESA Confirmed. Ksh100 paid to KIBANDA FOOD on 24/6/26.",
  "sender": "MPESA"
}
```

Only forward M-Pesa/payment SMS. Do not forward OTPs, passwords, or private chats.

## AI coach
The app currently uses safe rule-based advice. To add OpenAI, put your API key in `backend/.env` and extend `src/aiCoach.js`.


## Turn frontend into Android APK with Capacitor

These steps create a real Android project from the React app.

### Requirements
- Node.js installed
- Android Studio installed
- Android SDK installed through Android Studio

### First-time setup
```bash
cd frontend
npm install
npm run build
npx cap add android
npx cap copy android
npx cap open android
```

Android Studio will open the `android` folder.

### Build APK in Android Studio
Go to:

`Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`

The APK will be generated inside something like:

```txt
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### After editing React code
Run this every time before rebuilding the APK:

```bash
cd frontend
npm run android:sync
npm run android:open
```

### Important for backend connection
On a real phone, `localhost:5000` will not point to your laptop. Use your laptop's Wi-Fi IP address or host the backend online.

Example backend URL:

```txt
http://192.168.1.20:5000
```

For production, host the backend on Render, Railway, or Firebase Functions, then update the frontend API URL.

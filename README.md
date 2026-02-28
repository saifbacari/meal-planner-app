# 🍽️ Meal Planner App

AI-powered meal suggestions for busy people. Get personalized recipe recommendations in seconds based on your current state and fitness goals—no decision fatigue.

## 🎯 MVP Features

- **Personalized Suggestions**: Get recipes tailored to your state (busy, tired, motivated, etc.) and fitness goals
- **Quick Decisions**: Find inspiration in 2 clicks instead of endless scrolling
- **Favorites**: Save recipes you love
- **Onboarding**: Quick questionnaire to understand your preferences

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the app**
   ```bash
   npx expo start
   ```

3. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
meal-planner-app/
├── app/                    # Expo Router screens
├── components/             # Reusable components
├── hooks/                  # Custom React hooks
├── constants/              # App constants & config
├── assets/                 # Images, fonts, etc.
├── PROJECT_SPEC.md         # Full product spec
└── app.json                # Expo config
```

## 📚 Documentation

- [PROJECT_SPEC.md](./PROJECT_SPEC.md) - Full product specification & roadmap
- [Expo Docs](https://docs.expo.dev/) - Framework documentation

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **State Management**: Context API / Zustand (TBD)
- **Backend**: Vercel Serverless + Supabase
- **AI**: Claude API (Anthropic)
- **Recipes API**: TBD

## 📝 Development

### Available Scripts

- `npm start` - Start Expo dev server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests (when configured)

## 🌱 Next Steps

- [ ] Design system & UI components
- [ ] Onboarding flow
- [ ] Dashboard with state selection
- [ ] Recipe suggestion API integration
- [ ] Favorites management

---

**Status**: MVP in development
**Last updated**: Feb 2026

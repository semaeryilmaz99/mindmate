# MindMate - Smart To-Do List App

A modern, intuitive to-do list application built with React Native and Expo.

## 🚀 Features

- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Priority Levels**: Set low, medium, or high priority for tasks
- **Categories**: Organize tasks by categories (Work, Personal, Shopping, etc.)
- **Due Dates**: Set and track due dates with overdue notifications
- **Local Storage**: All data is stored locally on your device
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Cross-Platform**: Works on iOS, Android, and Web

## 📱 Project Structure

```
mindmate/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── TaskItem.tsx     # Individual task display component
│   │   └── HomeScreen.tsx   # Main task list screen
│   ├── services/            # Business logic and external services
│   │   └── storage.ts       # Local storage management
│   ├── hooks/               # Custom React hooks
│   │   └── useTasks.ts      # Task state management hook
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # App-wide type interfaces
│   └── utils/               # Utility functions and constants
│       ├── constants.ts     # App constants and colors
│       └── helpers.ts       # Helper functions
├── assets/                  # Images, icons, and static assets
├── App.tsx                  # Main app component
├── app.json                 # Expo configuration
└── package.json             # Dependencies and scripts
```

## 🛠️ Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **AsyncStorage**: Local data persistence
- **React Hooks**: State management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   - **iOS**: `npm run ios`
   - **Android**: `npm run android`
   - **Web**: `npm run web`

## 🔧 Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

### Project Architecture

The app follows a clean architecture pattern with:

- **Components**: Reusable UI elements
- **Screens**: Full-page components
- **Services**: Business logic and data management
- **Hooks**: Custom React hooks for state management
- **Types**: TypeScript interfaces and types
- **Utils**: Helper functions and constants

### Key Components

- **TaskItem**: Displays individual tasks with completion toggle
- **HomeScreen**: Main screen showing task list and controls
- **useTasks**: Custom hook for task state management

## 📋 TODO

- [ ] Add task creation/editing screen
- [ ] Implement task filtering and search
- [ ] Add task categories management
- [ ] Implement task statistics and analytics
- [ ] Add dark mode support
- [ ] Implement push notifications
- [ ] Add task sharing functionality
- [ ] Create settings screen

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons and assets from various sources
- Inspired by modern productivity apps 
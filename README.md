# UI Builder App

A React Native Expo app that allows users to create mobile app UIs with drag-and-drop components.

## Features

- **Multi-language Support**: Persian and English with RTL/LTR layout
- **Drag & Drop UI Builder**: Create UIs with Button, Text, Image, Input, and List components
- **GitHub Integration**: OAuth login, project management, and automatic builds
- **Build Automation**: GitHub Actions integration for APK/AAB generation
- **Modern Design**: Blue-themed UI with responsive design

## Components

- Button: Customizable buttons with colors and text
- Text: Text elements with font size and color options
- Image: Image components with size controls
- Input: Text input fields with styling options
- List: List components with customizable items

## Screens

1. **Splash Screen**: App initialization and loading
2. **Language Selection**: Choose between Persian and English
3. **Project List**: View and manage projects
4. **UI Builder**: Drag-and-drop interface for building UIs
5. **Project Settings**: Configure project properties
6. **GitHub Login**: OAuth authentication with GitHub
7. **Build Output**: View build status and download APKs

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure GitHub OAuth:
   - Create a GitHub OAuth app
   - Update client ID in `src/context/AuthContext.js`

3. Add font files:
   - Place Vazir.ttf in `assets/fonts/`
   - Place Roboto-Regular.ttf in `assets/fonts/`

4. Start the development server:
   ```bash
   npm start
   ```

## Technologies Used

- React Native with Expo
- React Navigation for routing
- React Native Paper for UI components
- react-i18next for internationalization
- AsyncStorage for local data persistence
- react-native-draggable-flatlist for drag-and-drop
- GitHub OAuth for authentication

## Build Process

The app integrates with GitHub Actions to automatically build APK/AAB files when projects are pushed to repositories. Build status and download links are displayed within the app.

## Responsive Design

The app features a responsive design that works across different screen sizes with proper RTL support for Persian language and modern blue-themed styling.
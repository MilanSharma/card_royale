Welcome to Car Royale App
Project Info

This is a native, cross-platform mobile application built for iOS, Android, and the web using:

React Native

Expo + Expo Router

TypeScript

React Query

Lucide Icons

The project is fully compatible with web exports and native app deployment.

How to Edit This Code
Option 1: Use Your Preferred Code Editor

You can clone this repository locally and edit it with any editor you like.

Recommended editors:

Cursor – Great for beginners

VS Code – Popular and extensible

Terminal-friendly option – Claude Code

Requirements:

Node.js (install through nvm recommended)

Bun (JavaScript runtime and package manager)

Steps to Get Started
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
bun i

# Step 4: Start the web preview with auto-reload.
bun run start-web

# Step 5: Start iOS preview
# Option A (recommended):
bun run start  # then press "i" to open the iOS simulator

# Option B (if supported on your system):
bun run start -- --ios

Edit Files Directly in GitHub

Navigate to the file

Click the pencil icon

Commit your changes

What Technologies Are Used?

React Native – Cross-platform native development

Expo – Tooling for React Native, powering apps like Discord, Tesla, and Coinbase

Expo Router – File-based navigation

TypeScript – Type-safe JavaScript

React Query – Server-state management

Lucide React Native – Icon set

How to Test the App
On Your Phone (Recommended)

Install Expo Go (iOS & Android)

Run your dev server:

bun run start


Scan the QR code to open the app on your device.

In the Browser

Fastest way to preview:

bun run start-web


(Some native APIs won’t work in the browser.)

iOS Simulator / Android Emulator
# iOS
bun run start -- --ios

# Android
bun run start -- --android

Deployment
Publish to the Apple App Store

Install EAS CLI:

bun i -g @expo/eas-cli


Configure and build:

eas build:configure
eas build --platform ios
eas submit --platform ios

Publish to Google Play Store
eas build --platform android
eas submit --platform android

Publish to the Web
eas build --platform web
eas hosting:configure
eas hosting:deploy


Alternative hosting options: Vercel, Netlify.

App Features

This template includes:

iOS, Android, and Web compatibility

Expo Router with file-based navigation

Tab navigation

Modal screens

TypeScript support

Async storage

Lucide icons

Project Structure
├── app/                    # App screens
│   ├── (tabs)/             
│   │   ├── _layout.tsx    
│   │   └── index.tsx      
│   ├── _layout.tsx        
│   ├── modal.tsx          
│   └── +not-found.tsx     
├── assets/                
│   └── images/            
├── constants/             
├── app.json               
├── package.json           
└── tsconfig.json          

Custom Development Builds

You’ll need a custom development build for features like:

Face ID / Touch ID / Apple Sign-In

Push notifications

In-app purchases

Custom native modules

Background tasks

Creating a Development Build
bun i -g @expo/eas-cli
eas build:configure

# Development builds
eas build --profile development --platform ios
eas build --profile development --platform android

# Use the custom build
bun start --dev-client

Advanced Features
Add a Database

Supabase (Postgres + real-time)

Firebase

Custom API

Authentication

Expo AuthSession (OAuth)

Supabase Auth

Firebase Auth

Apple / Google Sign-In (requires custom dev build)

Push Notifications

Expo Notifications

Firebase Cloud Messaging

Payments

Stripe (web + mobile)

PayPal

RevenueCat (in-app purchases)

Custom Domains

You can use custom domains for web builds through:

EAS Hosting

Netlify

Vercel

Mobile apps use deep-link schemes configured in app.json.

Troubleshooting
App not loading on device?

Ensure your phone & computer are on the same network

Try tunnel mode:

bun start -- --tunnel


Check firewall settings

Build failing?
bunx expo start --clear
rm -rf node_modules && bun install

Issues with native features?

Check the official React Native & Expo documentation.

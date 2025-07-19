# Mentis: The Flash Card Application.
**Mentis** is an offline application to study and test your memory through active recall.
Create collections, populate them with flash cards and quiz yourself.

<img width="1975" height="803" alt="Untitled" src="https://github.com/user-attachments/assets/4326dda4-7954-4ba6-8671-b000a65477ff" />

## Features
- Create custom **collections** of flash cards;
- Define each **flash card** with a question/term prompt and an answer;
- Infinitely cycle through individual card and **quiz** yourself, revealing the answer when necessary;
- Built using **React Native** with data stored locally via **SQLite**;

## Getting Started
- Environment setup guide: https://reactnative.dev/docs/set-up-your-environment;
- Install dependencies: ```npm install```
- iOS setup:
  - ```brew install cocoapods```
  - ```cd ios && pod install && cd ..```
- Android setup:
    - Make sure android sdk is configured in the system PATH **or** create a file ```local.properties``` in android directory and add the line pointing to your sdk path ```sdk.dir=/your/sdk/path```
- Run Metro dev server: ```npm start``` or ```npx react-native start```
- iOS: Open Xcode, select a virtual simulator or a physical device and build.
- Android: Open an android virtual device and run ```npx react-native run-android```

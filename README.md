# Chat App

React native application. 
First expo needs to be installed. Do this by running the following code:

```sh
npm install expo-cli -g
```

___

### Dependencies

  - expo
  - expo-image-picker
  - expo-location
  - expo-permissions
  - firebase
  - react
  - react-dom
  - react-native
  - react-native-gesture-handler
  - react-native-gifted-chat
  - react-native-keyboard-spacer
  - react-native-maps
  - react-native-web
  - react-navigation
  - react-navigation-stack
  - @react-native-community/netinfo
  ___

### Running the application

Begin the application by running the following code: 

```sh
npm start
```

This launches DevTools on port 19002. The application can then run either on a physical device or via a simulator/emulator.

On a physical device the Expo application needs to be installed, and you can then scan the QR code to get the application running. 

For information on using an emulator you can visit the [Android Studio Emulator page] on the Expo website.

___

### Firebase account

Firebase is a database platform where the message data for the application is stored. 
To create a Firebase account follow these steps: 

1. Visit the [Firebase website]
2. Sign into or create a new Google account
3. Click on 'Get Started' or 'Go To Console'
4. Click 'Add Project'
5. Follow the instructions until you see the text 'Creating Your Project'
6. Click on the 'Database' option in Develop tab
7. Select 'Create Database' and then 'Start in Test Mode'
8. Click 'Start Collection', name this collection 'Messages', and choose 'Auto ID'
9. Click on the 'Authentication' option im the Develop tab
10. Choose the option 'Set Up Sign-In Method' and enable anonymous authentication
11. Click on the 'Storage' option in the Develop tab. This will set up Cloud Storage
12. Click on the Settings icon and choose 'Project Settings'. Add your application and name it. 
13. Scroll down to 'Firebase SDK Snippet', select the 'Config' radio button and copy all the code within the firebaseConfig variable into your Chat.js file.

   [android studio emulator page]: <https://docs.expo.io/workflow/android-studio-emulator/>
   
   [firebase website]: <https://firebase.google.com/?hl=en>
   

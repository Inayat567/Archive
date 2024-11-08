
1. create firebase account
2. Go to https://console.firebase.google.com and select your app
3. side panel (> Build) > Authenficiation and read [firebase_auth.md](./firebase_auth.md)
4. side panel (> Build) > Storage and read [firebase_storage.md](./firebase_storage.md)
5. side panel (> Build) > Realtime Databse and read [firebase_realtime.md](./firebase_realtime.md)
6. side panel (> Build) > Firestore Database and read [firebase_database.md](./firebase_database.md)
7. setup 100ms-live account settings - read [100ms-live.md](./100ms-live.md)
8. make your you completed 100ms-live setup and updated [functions/.env](../functions/.env) file.
9. go back to Firebase Console. 
10. side panel (> Build) > Functions and read [firebase_functions.md](./firebase_functions.md)
11. side panel > Project overview and in Hero section, below where it says "Get started...", click on "Web" icon and follow instructions.
12. once app registration is compelte, copy firebaseConfig into [src/firebase/firebase.config.js](../src/firebase/firebase.config.js)

Setup complete! Now run your application in root folder with ```npm run start```
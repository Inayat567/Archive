
1. Click on button [Get started]
2. install firebase tools locally (like described in popup) if needed
3. click continue
4. ignore steps at [2] Deploy and click Finish
5. on the top left corner, near Project Overview, click on Settings icon and open "Project Settings"
6. copy "Project ID" or save it somewhere, will be needed soon
7. open terminal on you computer and locate Photon app project (if not available yet, get it from github)
8. once in app root folder run this command to open functions folder ```cd functions``` and ```npm i```
9. if you previously used firebase, run ```firebase logout```
10. run ```firebase login``
11. need to specify which project will be used via ```firebase use PROJECT_ID``` where PROJECT_ID is the one you copied at step 6
12. push functions to firebase via ```npm run deploy```
13. once completed, copy "Function URL" from terminal and save it in step 15.
14. if you get error, check "functions/package.json" and see if "engines > node" matches your node version in terminal ```node -v```. read more here https://firebase.google.com/docs/functions/manage-functions#set_nodejs_version
15. Open `src/firebase/firebase.config.js` and change variable apiRootUrl with one copied a step 13.

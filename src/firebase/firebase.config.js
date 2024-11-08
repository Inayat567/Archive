export const firebaseConfig = {
  // test
  // apiKey: "AIzaSyBlWYGdhc-ldFqPDPSzci32jqaZJxiD0g4",
  // authDomain: "electron-react-test-52250.firebaseapp.com",
  // databaseURL: "https://electron-react-test-52250-default-rtdb.europe-west1.firebasedatabase.app",
  // projectId: "electron-react-test-52250",
  // storageBucket: "electron-react-test-52250.appspot.com",
  // messagingSenderId: "425907912997",
  // appId: "1:425907912997:web:d74d86739772b1bc1b9acc"

  // official
  apiKey: "AIzaSyAdhyZ1GKQi3EV_sQ9gq1-ZiZC1sP1E6rk",
  authDomain: "lynk-a79b9.firebaseapp.com",
  databaseURL: "https://lynk-a79b9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lynk-a79b9",
  storageBucket: "lynk-a79b9.appspot.com",
  messagingSenderId: "771779066172",
  appId: "1:771779066172:web:436f1af1d98f33dbf2c639",

};


// old
// 'https://us-central1-electron-react-test-52250.cloudfunctions.net/lynk'

// official
//'https://us-central1-lynk-839e0.cloudfunctions.net/lynk';

// testing
// use firebase's connectFunctionsEmulator. Only issue - how to deal with local node app?
// 'http://127.0.0.1:5001/lynk-839e0/us-central1/lynk'; // local testing via emulator
// 'http://localhost:5001'; // local node

// test app
// export const apiRootUrl = 'https://us-central1-electron-react-test-52250.cloudfunctions.net/lynk';

// official app
export const apiRootUrl = 'https://us-central1-lynk-a79b9.cloudfunctions.net/lynk'; /// "lynk" relates to export name in functions/src/index.ts. After change push new functions to firebase

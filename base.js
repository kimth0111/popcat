// Import the functions you need from the SDKs you need
const firebase = require("firebase");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0x7CFaeDg7hHF5B_BFs1sqh8N1Vy4aBM",
  authDomain: "popcat-a23f3.firebaseapp.com",
  databaseURL: "https://popcat-a23f3-default-rtdb.firebaseio.com",
  projectId: "popcat-a23f3",
  storageBucket: "popcat-a23f3.appspot.com",
  messagingSenderId: "674778165213",
  appId: "1:674778165213:web:c1025f2084aa7de3ee1034",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// module.exports = database;

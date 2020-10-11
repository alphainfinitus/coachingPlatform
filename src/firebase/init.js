import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/functions";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBE1AzTxGYfFvOk13GpeIKncvpiplWLCh4",
  authDomain: "coachingplatform-141d0.firebaseapp.com",
  databaseURL: "https://coachingplatform-141d0.firebaseio.com",
  projectId: "coachingplatform-141d0",
  storageBucket: "coachingplatform-141d0.appspot.com",
  messagingSenderId: "238072346048",
  appId: "1:238072346048:web:fc56cbd977f1f7a313c425",
  measurementId: "G-3X9Q5XZELJ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const fire_auth = firebase.auth();
export const fire_auth_provider = firebase.auth;

export const fire_functions = firebase.app().functions("asia-south1");

export const fire_store = firebase.firestore();
export const fire_storage = firebase.storage();
export const firestore_fieldvalue = firebase.firestore.FieldValue;

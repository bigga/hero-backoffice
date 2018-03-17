import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyDF_EjuaW1ggGxJjkMA83wrD3Vy8NtySOg",
  authDomain: "isarasoftware-hero-app.firebaseapp.com",
  databaseURL: "https://isarasoftware-hero-app.firebaseio.com",
  projectId: "isarasoftware-hero-app",
  storageBucket: "isarasoftware-hero-app.appspot.com",
  messagingSenderId: "900354487779"
};
firebase.initializeApp(config);
export default firebase;
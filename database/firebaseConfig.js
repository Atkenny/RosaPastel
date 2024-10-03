import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  //Agregue sus datos de conexión
  apiKey: "AIzaSyDtmPEvZg2eFqShCPU7RMSO668HYozKu6w",
  authDomain: "graficosdinamicos-ca94a.firebaseapp.com",
  projectId: "graficosdinamicos-ca94a",
  storageBucket: "graficosdinamicos-ca94a.appspot.com",
  messagingSenderId: "1009401267046",
  appId: "1:1009401267046:web:0e46b66ab35f9a569e3ea7",
  measurementId: "G-PS59XN98Z1"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
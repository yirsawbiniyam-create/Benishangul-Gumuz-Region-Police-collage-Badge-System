import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  getFirestore,
} from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

const dbName =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== ""
    ? firebaseConfig.firestoreDatabaseId
    : "(default)";

// Initialize Firestore with persistent local cache for robust offline resilience
let dbInstance;
try {
  dbInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager({}),
      }),
    },
    dbName
  );
} catch (e) {
  dbInstance = getFirestore(app, dbName);
}

export const db = dbInstance;

// Validate connection to Firestore
async function testConnection() {
  try {
    const { doc, getDocFromServer } = await import("firebase/firestore");
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Please check your Firebase configuration or network connection.");
    }
  }
}
testConnection();




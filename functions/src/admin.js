const admin = require('firebase-admin');
const serviceAccount = require("../secrets/key.json");
const data = require("../data.json");
const svardata = require("../svar.json");
const collectionKey = "luker";
const collectionKeySvar = "svar";
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://julekalender-4617e.firebaseio.com"
});
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

if (data && (typeof data === "object")) {
   Object.keys(data).forEach(docKey => {
      console.log(docKey);
      var p = JSON.parse(JSON.stringify(data[docKey]));
      delete p.alternativer;
      firestore.collection(collectionKey).doc(docKey).set(p).then((res) => {
         console.log("Document " + docKey + " successfully written!");
      }).catch((error) => {
         console.error("Error writing document: ", error);
      });
      if (data[docKey].alternativer != null) {
         Object.keys(data[docKey].alternativer).forEach(dk => {
            console.log(dk);
            firestore.collection(collectionKey).doc(docKey).collection("alternativer").add(data[docKey].alternativer[dk]).then((r2) => {
            })
         })
      }
   });
}
if (svardata && (typeof svardata === "object")) {
   Object.keys(svardata).forEach(docKey => {
      console.log(docKey);
      firestore.collection(collectionKeySvar).doc(docKey).set(svardata[docKey]).then((res) => {
         console.log("Document " + docKey + " successfully written!");
      }).catch((error) => {
         console.error("Error writing document: ", error);
      });
   });
}

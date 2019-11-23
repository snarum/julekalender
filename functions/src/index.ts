import * as functions from 'firebase-functions';
import * as adm from 'firebase-admin';


adm.initializeApp();
export const answer = functions.https.onRequest(async (req, res) => {

    const a = req.headers.authorization;
    if (a === undefined || !a.startsWith("Bearer ")) {
        res.json('');
    }
    else
    {
        const p = a.replace("Bearer ","");
        const token =  await adm.auth().verifyIdToken(p);
        if(token === null || token.email === null)
        {
            res.json('')
        }
        const svarRef = adm.firestore().collection("svar");
        const query = svarRef.where("luke", "==", parseInt(req.query["luke"])).where("hvem","==",token.email);
        const svar = await query.get();
        if (svar.docs.length === 1) {
            const p2 = await svar.docs[0].data();
            res.json(p2.hvor)
        }
        else {
            res.json('');
        }
    }
});
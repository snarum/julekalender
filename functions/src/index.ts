import * as functions from 'firebase-functions';
import * as adm from 'firebase-admin';

const baseDate = new Date(2019, 10, 25, 6, 0, 0);

adm.initializeApp({
    credential: adm.credential.cert(require('../secrets/key.json'))
});

export const answer = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://julekalender-4617e.firebaseapp.com')
    res.set('Access-Control-Allow-Headers', 'authorization,content-type')
    const a = req.headers.authorization;
    if (a === undefined || !a.startsWith("Bearer ")) {
        res.json('');
    }
    else {
        const p = a.replace("Bearer ", "");
        const token = await adm.auth().verifyIdToken(p);
        if (token === null || token.email === null) {
            res.json('');
            return;
        }
        const lukeParam = parseInt(req.query["luke"]);
        const svarParam = parseInt(req.query["svar"]);
        const svarRef = adm.firestore().collection("svar");
        const query = svarRef.where("luke", "==", lukeParam).where("hvem", "==", token.email);

        const pp = new Date(baseDate);
        pp.setTime(pp.getTime() + ((lukeParam - 1) * 24 * 60 * 60 * 1000));
        if (pp > new Date())
        {
            res.json('');
            return;
        };

        const svar = await query.get();

        if (svar.docs.length === 1) {
            const p2 = await svar.docs[0].data();
            if (p2.svar === svarParam)
                res.json(p2.hvor);
            else
                res.json('');
        }
        else {
            res.json('');
        }
    }
});

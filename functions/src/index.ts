import * as functions from 'firebase-functions';
import * as adm from 'firebase-admin';
//const cors = require('cors')({ origin: true });

adm.initializeApp({
    credential: adm.credential.cert(require('../secrets/key.json'))
});

export const answer = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.set('Access-Control-Allow-Headers', 'authorization,content-type')
    const a = req.headers.authorization;
    if (a === undefined || !a.startsWith("Bearer ")) {
        console.log('her-1');
        res.json('');
    }
    else {
        console.log('her0');
        
        const p = a.replace("Bearer ", "");
        const token = await adm.auth().verifyIdToken(p);
        if (token === null || token.email === null) {
            res.json('')
        }
        const lukeParam = parseInt(req.query["luke"]);
        const svarParam = parseInt(req.query["svar"]);
        const svarRef = adm.firestore().collection("svar");
        const query = svarRef.where("luke", "==", lukeParam).where("hvem", "==", token.email);
        console.log('her1');

        const svar = await query.get();
        console.log('her');

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

//app.use(cors);
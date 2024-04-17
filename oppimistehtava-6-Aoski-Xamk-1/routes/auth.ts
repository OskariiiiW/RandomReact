import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import kayttajat, { Kayttaja } from '../models/kayttajat';

const authRouter : express.Router = express.Router();

authRouter.use(express.json()); // Otetaan vastaan mahdollinen pyynnön body json-datana

authRouter.post("/login", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {

        let kayttaja : Kayttaja = await kayttajat.haeKayttaja(req.body.tunnus)

        if (kayttaja) {

            let hash = crypto.createHash("SHA512").update(req.body.salasana).digest("hex");

            if (kayttaja.salasana === hash) 
            {
                let token = jwt.sign({ id : kayttaja.kayttajaId, kayttajatunnus : kayttaja.kayttajatunnus }, String(process.env.ACCESS_TOKEN_SECRET), { algorithm :  "HS256" }); 

                res.status(200).json({"token" : token})

            } else {

                  res.status(401).json({ "viesti" : "Virheellinen salasana" });
            }          

        } else {

            res.status(401).json({ "viesti" : "Käyttäjää ei ole olemassa" });
        }

    } catch (e : any) {
        res.status(e.status).json({ "viesti" : e.teksti });
    }
});

export default authRouter;
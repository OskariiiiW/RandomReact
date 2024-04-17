import express from 'express';
import kayttajat, { Kayttaja } from '../models/kayttajat';
import uutiset, { Uutinen } from '../models/uutiset';
import kommentit, { Kommentti } from '../models/kommentit';

const apiRouter : express.Router = express.Router();

apiRouter.use(express.json()); // Otetaan vastaan mahdollinen pyynnön body json-datana

apiRouter.get("/uutiset", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {
        let data : Uutinen[] = await uutiset.haeKaikki();

        if (data.length > 0){
            res.json(data);
        } else {
            res.status(500).json({"virhe" : "Palvelinvirhe"});
        }

    } catch (e : any) {

        console.log(e)

        res.status(e.status).json({ "virhe" : e.teksti })
    }
});

apiRouter.get("/kayttajat", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {
        let data : Kayttaja[] = await kayttajat.haeKaikki();

        if (data.length > 0){
            res.json(data);
        } else {
            res.status(500).json({"virhe" : "Palvelinvirhe"});
        }

    } catch (e : any) {

        console.log(e)

        res.status(e.status).json({ "virhe" : e.teksti })
    }
});

apiRouter.get("/kommentit", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {
        let data : Kommentti[] = await kommentit.haeKaikki();

        if (data.length > 0){
            res.json(data);
        } else {
            res.status(500).json({"virhe" : "Palvelinvirhe"});
        }

    } catch (e : any) {

        console.log(e)

        res.status(e.status).json({ "virhe" : e.teksti })
    }
});

apiRouter.post("/kommentit", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {
        if (req.body.kommentti) {

            await kommentit.lisaa(req.body);

            res.json(await kommentit.haeKaikki());

        } else {
            res.status(400).json({ "viesti" : "Virheellinen data" });
        }     

    } catch (e : any) {
        res.status(e.status).json({ "viesti" : e.teksti });
    }
});

export default apiRouter;
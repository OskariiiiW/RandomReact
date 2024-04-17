import express from 'express';
import kayttajat, { Kayttaja } from '../models/kayttajat';
import {PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const apiRouter : express.Router = express.Router();

apiRouter.get("/lisaykset", async (req : express.Request, res :express.Response ) => {

        let tiedot = await prisma.$queryRaw`SELECT * FROM ravinto`;

        res.json(tiedot);
});

apiRouter.post("/lisaykset", async (req : express.Request, res :express.Response ) => {
    console.log("tietolisäys3");
    try {
        if(req.body.kalorit){

            let tiedot = await prisma.$queryRaw`INSERT INTO ravinto(kalorit, juomalitroina, liikuntatunteina, paivays)
                                        VALUES (${req.body.kalorit}, ${req.body.juomalitroina},
                                             ${req.body.liikuntatunteina}, ${req.body.paivays})`;

            res.json(tiedot);

        } else {
            res.status(400).json({ "virhe" : "Virheellinen data" });
        }
        
    } catch {
        console.log("tietolisäys3 VIRHE");
        res.status(404).json({ "virhe" : "Dataa ei löydy" });
    }
});

apiRouter.post("/kayttajat", async (req : express.Request, res : express.Response) : Promise<void> => {
    console.log("lisäys3");
    try {
        if (req.body.kayttajatunnus) {

            await kayttajat.lisaa(req.body);

            res.json(await kayttajat.haeKaikki());

        } else {

            res.status(400).json({ "virhe" : "Virheellinen data" });
        }     

    } catch {
        console.log("lisäys3 puuttuu req.body");
        res.status(404).json({ "virhe" : "Dataa ei löydy" });
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

        console.log(e, "käyttäjiä ei pystytty hakemaan");

        res.status(e.status).json({ "virhe" : e.teksti });
    }
});

export default apiRouter;
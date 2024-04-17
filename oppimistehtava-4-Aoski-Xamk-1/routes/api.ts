import express from 'express';
import  pakettiautot, {Pakettiauto} from '../models/pakettiauto';

const apiRouter : express.Router = express.Router();

apiRouter.use(express.json()); // Otetaan vastaan mahdollinen pyynnön body json-datana

apiRouter.delete("/pakettiautot/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

        try {
    
            let data : Pakettiauto[] = await pakettiautot.haeKaikki();
    
            let virheTunnistus = data.find((pakettiauto : Pakettiauto) => {
                return pakettiauto.id === Number(req.params.id);
            });
    
            if (virheTunnistus) {
    
                pakettiautot.poista(Number(req.params.id));
                res.status(200).json({ "viesti" : "tieto poistettu" });
    
            } else {
    
                res.status(404).json({ "viesti" : "Virheellinen id" });
            }     
        } catch (e : any) {
            res.status(e.status).json({ "viesti" : e.teksti });
        }
    });
    
apiRouter.put("/pakettiautot/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {

        let data : Pakettiauto[] = await pakettiautot.haeKaikki();

        let virheTunnistus = data.find((pakettiauto : Pakettiauto) => {
            return pakettiauto.id === Number(req.params.id);
        });

        if(!req.body.reitti || !req.body.ajetutKM || !req.body.paivays){
            res.status(400).json({ "viesti" : "Virheelliset tiedot" });

        } else if (virheTunnistus){

            pakettiautot.muokkaa(Number(req.params.id), Number(virheTunnistus.tunniste), req.body);
            res.status(200).json({ "viesti" : "tietot tallennettu" });

        } else {
            res.status(404).json({ "viesti" : "Virheellinen id" });
        } 

    } catch (e : any) {
        res.status(e.status).json({ "viesti" : e.teksti });
    }
});

apiRouter.post("/pakettiautot", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {

        if (req.body.reitti && req.body.ajetutKM && req.body.tunniste) {

            pakettiautot.lisaa(req.body);
            res.status(200).json({ "viesti" : "Uusi tieto lisätty" });

            try {
                req.body.paivays = Date.parse(req.body.paivays); // ei tee mitaan

            } catch (e : any) {
                res.status(400).json({ "viesti" : "Virheellinen päiväys" });
            }

        } else {

            res.status(400).json({ "viesti" : "Virheellinen data" });
        }     

    } catch (e : any) {
        res.status(e.status).json({ "viesti" : e.teksti });
    }
}); 

apiRouter.get("/pakettiautot/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    let vanhatautot : Pakettiauto[] = await pakettiautot.haeKaikki();

    if (vanhatautot) {

        let auto = vanhatautot.find((auto : Pakettiauto) => {

            return auto.id === Number(req.params.id);  
    
        });

        res.json(auto);

    } else {

        res.json({ "virhe" : "Palvelinvirhe" })
    }
});

apiRouter.get("/pakettiautot", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {
        let vanhatautot : Pakettiauto[] = await pakettiautot.haeKaikki();

        if (vanhatautot) {
            res.json({vanhatautot});

        } else {
            res.json({"virhe" : "Ongelma tietojen hakemisessa"})
        }

    } catch (e : any) {
        res.status(e.status).json({ "virhe" : e.teksti })
    }
});

export default apiRouter;
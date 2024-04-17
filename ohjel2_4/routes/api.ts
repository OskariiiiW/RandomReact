import express from 'express';
import  ostokset, {Ostos} from '../models/ostokset';

const apiRouter : express.Router = express.Router();

apiRouter.use(express.json()); // Otetaan vastaan mahdollinen pyynnön body json-datana


apiRouter.delete("/ostokset/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    let vanhatostokset : Ostos[] = await ostokset.haeKaikki();

    vanhatostokset = vanhatostokset.filter((ostos : Ostos) => {

        return ostos.id !== Number(req.params.id);

    })

    ostokset.tallennaOstokset(vanhatostokset);

    res.json({ "viesti" : "Ostos poistettu" })

});
/*
apiRouter.put("/ostokset/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    let ostokset : Ostos[] = await haeOstokset();

    ostokset = ostokset.filter((ostos : Ostos) => {

        return ostos.id !== Number(req.params.id);

    })   

    let uusiOstos : Ostos = {
            id : Number(req.params.id),
            ostos : req.body.ostos
        }

    ostokset = [...ostokset, uusiOstos];

    ostokset.sort((a, b) => { // sorttaa arrayn id:n mukaiseen järjestykseen ennen tallennusta

        return a.id - b.id;

    });

    ostokset.tallennaOstokset(ostokset);

    res.json({ "viesti" : "Ostos muutettu" })

});
*/

apiRouter.post("/ostokset", async (req : express.Request, res : express.Response) : Promise<void> => {

    ostokset.lisaa(req.body);

    res.json({ "viesti" : "Uusi ostos lisätty" })

}); 

apiRouter.get("/ostokset/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    let vanhatostokset : Ostos[] = await ostokset.haeKaikki();

    if (vanhatostokset) {

        let ostos = vanhatostokset.find((ostos : Ostos) => {

            return ostos.id === Number(req.params.id);  
    
        });

        res.json(ostos);

    } else {

        res.json({ "virhe" : "Palvelinvirhe" })
    }
});

apiRouter.get("/ostokset", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {

        if(req.body.ostos){
        ostokset.lisaa(req.body);
        res.json({"viesti" : "uusi ostos lisätty"});

        } else {

        res.status(400).json({"viesti" : "virheellinen data"});   

        }

    } catch ( e : any){

    }

try {
        let data : Ostos[] = await ostokset.haeKaikki();

        res.json(ostokset);

    } catch (e : any) {
        res.status(e.status).json({ "virhe" : e.teksti })
    }
});

export default apiRouter;
import express from 'express';
import henkilot, { Henkilo } from '../models/henkilot';

const apiRouter : express.Router = express.Router();

apiRouter.use(express.json()); // Otetaan vastaan mahdollinen pyynnön body json-datana

apiRouter.get("/henkilot", async (req : express.Request, res : express.Response) : Promise<void> => {

    try {

        let data : Henkilo[] = await henkilot.haeKaikki();

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

export default apiRouter;
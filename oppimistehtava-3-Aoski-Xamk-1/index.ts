import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3003;

interface Saapas {
    id : number,
    koko : number,
    vari : string,
    varastotilanne : number
}

const haeSaappaat = async () : Promise<any>  => {
    try {
        let data : string = await readFile(path.resolve(__dirname, "data", "saappaat.json"), "utf-8");
        return JSON.parse(data);

    } catch (error) {
        return null;
    }

}

const tallennaSaappaat = async (saappaat : Saapas[]) : Promise<any> => {
    try {
        await writeFile(path.resolve(__dirname, "data", "saappaat.json"), JSON.stringify(saappaat, null, 2), "utf-8");

    } catch (error) {
        return null;

    }
}
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json()); //otetaan mahdollinen pyynnön body json-datana

app.delete("/api/saappaat/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    let saappaat : Saapas[] = await haeSaappaat();

    let virheTunnistus = saappaat.find((saapas : Saapas) => { //virheen tunnistusta
        return saapas.id === Number(req.params.id);
    });

    if (virheTunnistus){
        saappaat = saappaat.filter((saapas : Saapas) => {
            return saapas.id !== Number(req.params.id);
        })

        tallennaSaappaat(saappaat);

        res.json({"viesti" : "Tuote poistettu onnistuneesti"}); 

    } else {
        res.json({"viesti" : "Tuotteen poistaminen epäonnistui"});
    }
});

app.put("/api/saappaat/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    let saappaat : Saapas[] = await haeSaappaat();

    let virheTunnistus = saappaat.find((saapas : Saapas) => { //estaa uusien luomisen
        return saapas.id === Number(req.params.id);
    });

    if (virheTunnistus){

    saappaat = saappaat.filter((saapas : Saapas) => {
        return saapas.id !== Number(req.params.id);
    });

    let uusiSaapas : Saapas = {
        id : Number(req.params.id),
        koko : req.body.koko,
        vari : req.body.vari,
        varastotilanne : req.body.varastotilanne
    }

        saappaat = [...saappaat, uusiSaapas];

        saappaat.sort((a, b) => {
            return a.id - b.id;

        });

        tallennaSaappaat(saappaat);
        res.json({"viesti" : "Tuote muokattu onnistuneesti"});        
    }
    else {
        res.json({"viesti" : "Tuotteen muokkaaminen epäonnistui"});   
    }
});

app.post("/api/saappaat", async (req : express.Request, res : express.Response) : Promise<void> => {

    let saappaat : Saapas[] = await haeSaappaat();

    let uusiSaapas : Saapas = {
        id : saappaat[saappaat.length -1].id + 1,
        koko : req.body.koko,
        vari : req.body.vari,
        varastotilanne : req.body.varastotilanne
    }

    if (uusiSaapas.id !== null){  //virheen tunnistusta
        saappaat = [...saappaat, uusiSaapas] 

        tallennaSaappaat(saappaat);

        res.json({"viesti" : "Tuote lisätty onnistuneesti"});        

    } else {
        res.json({"viesti" : "Tuotteen lisääminen epäonnistui"}); 
    }


});

app.get("/api/saappaat/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    let saappaat : Saapas[] = await haeSaappaat();

    if (saappaat) {
        let saapas = saappaat.find((saapas : Saapas) => {
            return saapas.id === Number(req.params.id);
        });
        res.json(saapas);

    } else {
        res.json({"virhe" : "Ongelma tuotteen hakemisessa"})
    }
});

app.get("/api/saappaat", async (req : express.Request, res : express.Response) : Promise<void> => {
    let saappaat : Saapas[] = await haeSaappaat();

    if (saappaat) {
        res.json({saappaat});

    } else {
        res.json({"virhe" : "Ongelma tuotteiden hakemisessa"})
    }
});

app.get("/api/varastotilanne/:id", async (req : express.Request, res : express.Response) : Promise<void> => {

    let saappaat : Saapas[] = await haeSaappaat();

    if (saappaat) {
        let saapas = saappaat.find((saapas : Saapas) => {
            return saapas.id === Number(req.params.id);
        });
        
        if (saapas){
            let varastoTila : any = {
                varastotilanne : saapas.varastotilanne
            }
            res.json(varastoTila);

        } else {
            res.json({"varastotilanne" : "ei tietoa"})
        }

    } else {
        res.json({"virhe" : "Ongelma tuotteen hakemisessa"})
    }
});

app.get("/api/varastotilanne", async (req : express.Request, res : express.Response) : Promise<void> => {

    let saappaat : Saapas[] = await haeSaappaat();

    if (saappaat) {
        let saapas = saappaat.find((saapas : Saapas) => {
            return saapas.koko === Number(req.query.koko) && saapas.vari === req.query.vari;
        });
        
        if (saapas){
            let varastoTila : any = {
                varastotilanne : saapas.varastotilanne
            }
            res.json(varastoTila);

        } else {
            res.json({"varastotilanne" : "ei tietoa"})
        }

    } else {
        res.json({"virhe" : "Ongelma tuotteen hakemisessa"})
    }
});

app.listen(portti, () => {
    console.log(`Palvelin käynnistyi`)
})
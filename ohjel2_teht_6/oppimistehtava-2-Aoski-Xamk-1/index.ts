import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3102;

interface Kunnat {
    kuntanro: number,
    nimi_fi: string,
    nimi_sv: string,
    kuntamuoto: string,
    asukkaita: number,
    maakuntanro: number,
    maakuntanimi_fi: string,
    maakuntanimi_sv: string
}

interface Kunta {
    nimi : string,
    kuntamuoto : string,
    asukkaita : number
}

const haeKunnat = async () : Promise<any>  => {
    try {
        let data : string = await readFile(path.resolve(__dirname, "data", "kunnat.json"), "utf-8");
        return JSON.parse(data);

    } catch (error) {
        return null;
    }
}

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json()); //otetaan mahdollinen pyynnön body json-datana

app.get("/kunnat/:kuntanro", async (req : express.Request, res : express.Response) : Promise<void> => {

    let kunnat : Kunnat[] = await haeKunnat();

    let lahetettavaData : any = kunnat.find((kunnat : Kunnat) => { //tyyppi any, koska valittaa, että puuttuu properteja

        return kunnat.kuntanro === Number(req.params.kuntanro);
    });

    if (lahetettavaData){
        res.json(lahetettavaData)

    } else {
        res.json({"virhe" : "Kuntaa ei löydy"})
    }
});

app.get("/maakunnat/:maakunnan_nimi", async (req : express.Request, res : express.Response) => {

    let kunnat : Kunnat[] = await haeKunnat();
    let laskuri : number = 0;

    let Data1 : any = kunnat.find((kunnat : Kunnat) => { //tarkastaa loytyiko
        return kunnat.maakuntanimi_fi.toLowerCase().replace(/[åä]/g, 'a' ).replace("ö", "o")
            === req.params.maakunnan_nimi;
    })

    let Data2 : any = kunnat.filter((kunnat : Kunnat) => { //filtteroi osumat
        return kunnat.maakuntanimi_fi.toLowerCase().replace(/[åä]/g, 'a' ).replace("ö", "o")
            === req.params.maakunnan_nimi; //en muistanut tai loytanut, miten korvata kaikki samassa funktiossa
    });

    let Data3 : any = Data2.map((kunnat : Kunnat) => { //en keksinyt parempaa tapaa :D
        //for (let i = 1; i < 2; i++){
            laskuri = laskuri + kunnat.asukkaita; //viimeisessa oliossa on loppusumma
        //}
        return {
            nimi_fi : kunnat.maakuntanimi_fi,
            nimi_sv : kunnat.maakuntanimi_sv,
            kaupunkien_maara : Data2.length,
            asukkaita : laskuri
        }
    });
    if (Data1){
        res.json(Data3)

    } else {
        res.json({"virhe" : "Kuntaa ei löydy"})
    }
});

app.get("/kunnat", async (req : express.Request, res : express.Response) => {

    let kunnat : Kunnat[] = await haeKunnat();

    let lahetettavaData : Kunta[] = kunnat.map((kunnat : Kunnat) => {

        if (kunnat.nimi_fi === kunnat.nimi_sv){
           return {
                nimi : kunnat.nimi_fi,
                kuntamuoto : kunnat.kuntamuoto,
                asukkaita : kunnat.asukkaita
            } 
        } else {
            return {
                nimi : kunnat.nimi_fi + ` (${kunnat.nimi_sv})`,
                kuntamuoto : kunnat.kuntamuoto,
                asukkaita : kunnat.asukkaita
            } 
        }
    });

    res.json(lahetettavaData);

});

app.listen(portti, () => {
    console.log(`Palvelin käynnistyi`)
})
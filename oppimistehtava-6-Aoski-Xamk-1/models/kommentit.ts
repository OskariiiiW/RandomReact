import { readFile, writeFile } from 'fs/promises'; 
import path from 'path';
//import kayttajat, { Kayttaja } from '../models/kayttajat';

export interface Kommentti {
    kommenttiId : number,
    uutisId : number,
    kayttajatunnus : string,
    kommentti : string,
    aikaleima : string
}

class kommentit {

    private tiedostonimi : string[] = [__dirname, "data", "kommentit.json"]
    private data : Kommentti[] = [];

    constructor() {

        readFile(path.resolve(...this.tiedostonimi), "utf-8")
            .then((dataStr : string) => {
                this.data = JSON.parse(dataStr);
            })
            .catch((e : any) => {
                this.data = [];
            });
    }

    public haeKaikki = async () : Promise<any> => {

        try  {

            return this.data;

        } catch (error) {

            throw {
                    "status" : 500,
                    "teksti" : "Tiedostoa ei voitu avata"
                };
        }
    }

    public lisaa = async (reqBody : any) : Promise<void> => {

        //let kayttaja : Kayttaja = await kayttajat.haeKayttaja(reqBody.tunnus) ei toimi

        let uusiKommentti = {
            kommenttiId : this.data[this.data.length -1].kommenttiId + 1,
            uutisId : reqBody.uutisId,
            kayttajatunnus : reqBody.kayttajatunnus,
            kommentti : reqBody.kommentti,
            aikaleima : reqBody.aikaleima
        }

        this.data = [...this.data, uusiKommentti];

        await this.tallenna();
    }

    private tallenna = async () : Promise<any> => {

        try {
            await writeFile(path.resolve(...this.tiedostonimi), JSON.stringify(this.data, null, 2), "utf-8")

        } catch (error) {
            return {
                    "status" : 500,
                    "teksti" : "Tiedostoa ei voitu tallentaa"
                };
        }
    }
}

export default new kommentit();
import { readFile, writeFile } from 'fs/promises'; 
import path from 'path';

export interface Kayttaja {
    kayttajaId : number,
    kayttajatunnus : string,
    salasana : string
}

class kayttajat {

    private tiedostonimi : string[] = [__dirname, "data", "kayttajat.json"]
    private data : Kayttaja[] = [];

    constructor() {

        readFile(path.resolve(...this.tiedostonimi), "utf-8")
            .then((dataStr : string) => {
                this.data = JSON.parse(dataStr);
            })
            .catch((e : any) => {
                this.data = [];
            });
    }

    public haeKayttaja = async (kayttajatunnus : string) : Promise<any> => {

        return this.data.find((kayttaja : Kayttaja) => {
            return kayttaja.kayttajatunnus === kayttajatunnus
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
}

export default new kayttajat();
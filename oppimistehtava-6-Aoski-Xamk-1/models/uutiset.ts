import { readFile, writeFile } from 'fs/promises'; 
import path from 'path';

export interface Uutinen {
    uutisId : number,
    otsikko : string,
    sisalto : string
}

class uutiset {

    private tiedostonimi : string[] = [__dirname, "data", "uutiset.json"]
    private data : Uutinen[] = [];

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

    public haeUutinen = async (uutisId : number) : Promise<any> => {

        return this.data.find((uutinen : Uutinen) => {
            return uutinen.uutisId === uutisId
        });
    }
}

export default new uutiset();
import { readFile, writeFile } from 'fs/promises'; 
import path from 'path';

export interface Kayttaja {
    kayttajaId : number,
    kayttajatunnus : string,
    salasana : string,
    sukupuoli : string
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

    public haeKayttaja = async (tunnus : string) : Promise<any> => {

        return this.data.find((kayttaja : Kayttaja) => {
            return kayttaja.kayttajatunnus === tunnus
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
        console.log("lisäys4");
        let uusiKayttaja = {
            kayttajaId : this.data[this.data.length -1].kayttajaId + 1,
            kayttajatunnus : reqBody.kayttajatunnus,
            salasana : reqBody.salasana,
            sukupuoli : reqBody.sukupuoli
        }

        this.data = [...this.data, uusiKayttaja];

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

export default new kayttajat();
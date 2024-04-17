import { readFile, writeFile } from 'fs/promises'; 
import path from 'path';

export interface Pakettiauto {
    id : number,
    reitti : string,
    ajetutKM : number,
    tunniste : number,
    paivays : Date
}

class pakettiautot {

    private tiedostonimi : string[] = [__dirname, "data", "pakettiautot.json"]
    private data : Pakettiauto[] = [];

    constructor() {
        readFile(path.resolve(...this.tiedostonimi), "utf-8")
            .then((dataStr : string) => {
                this.data = JSON.parse(dataStr);
            })
            .catch((e : any) => {
                this.data = [];
            })
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

    public padTo2Digits(num : number) {
        return num.toString().padStart(2, '0'); //muotoilee new Date:n DD/MM/YYY/ -muotoon
      }
    public formatDate(date : Date) {
        return [
          this.padTo2Digits(date.getDate()),
          this.padTo2Digits(date.getMonth() + 1),
          date.getFullYear(),
        ].join('.');
      }

    public lisaa = async (reqBody : any) : Promise<void> => {    //------------LISAA---------------------

        if (!reqBody.paivays){
            reqBody.paivays = this.formatDate(new Date())
        }

        if (this.data.length !== null) {
            let uusiAuto : Pakettiauto = {
                id : this.data[this.data.length -1].id + 1,
                reitti : reqBody.reitti,
                ajetutKM : reqBody.ajetutKM,
                tunniste : reqBody.tunniste,
                paivays : reqBody.paivays
            }

        this.data = [...this.data, uusiAuto];
        await this.tallenna();    

        } else {
            let uusiAuto : Pakettiauto = { //jos json on tyhja, estaa null id:t
                id : 1,
                reitti : reqBody.reitti,
                ajetutKM : reqBody.ajetutKM,
                tunniste : reqBody.tunniste,
                paivays : reqBody.paivays
            }

        this.data = [...this.data, uusiAuto];
        await this.tallenna(); 
        }
    }

    public poista = async (id : number) : Promise<any> => {  //-----------------POISTA----------------

        this.data = this.data.filter((pakettiauto) => {
            return pakettiauto.id !== id;
        })

        await this.tallenna();
    }

    public muokkaa = async (id : number, tunniste : number, reqBody : any) : Promise<void> => {
        this.data = this.data.filter((pakettiauto) => {
            return pakettiauto.id !== id;
        })

        let uusiAuto : Pakettiauto = {
            id : id,
            reitti : reqBody.reitti,
            ajetutKM : reqBody.ajetutKM,
            tunniste : tunniste,
            paivays : reqBody.paivays
        }
        
        this.data = [...this.data, uusiAuto];

        await this.tallenna();
    }

    private tallenna = async () : Promise<any> => {  //--------------------TALLENNA--------------------

        try {

            await writeFile(path.resolve(...this.tiedostonimi), JSON.stringify(this.data, null, 2), "utf-8")

        } catch (error) {

            return {
                "status" : 500,
                "teksti" : "tiedostoa ei voitu tallentaa"
            };
        }
    }    
}

export default new pakettiautot();
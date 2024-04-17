import express from "express";
import path from "path";

const app : express.Application = express();

const portti : number = 3101;

app.get("/", (req : express.Request, res : express.Response) => {
    res.sendFile(path.resolve(__dirname, "onnistui.html"));
});

app.get("/tarkistus", (req : express.Request, res : express.Response) => {

    let nimi, email : any;
    let virhe, virhe2 : boolean = false;
    let nimiVirhe, sPostiVirhe, ehtoVirhe : string;

    nimiVirhe = "";
    sPostiVirhe = ""; //tyhjien stringien laittaminen muodostimeen ei toiminut
    ehtoVirhe = "";

    if(!req.query.nimi && !req.query.email && req.query.kayttoehdot!=="hyvaksytty"){ //virheentunnistus //Kaikki
        virhe = true;
    }
    if (!req.query.nimi){ //virheentunnistus //Nimi
        nimiVirhe = "Nimi puuttuu ";
        virhe2 = true;
    }
    else {
        nimi = req.query.nimi;
    }
    if (!req.query.email){ //virheentunnistus //Email
        sPostiVirhe = "Sähköposti puuttuu ";
        virhe2 = true;
    }
    else {
        email = req.query.email;
    }
    if(req.query.kayttoehdot!=="hyvaksytty"){ //virheentunnistus //Kayttoehdot
        ehtoVirhe = "Käyttöehtoja ei ole hyväksytty";
        virhe2 = true;
    }

    if(virhe){                //virhesivu, jos kaikki puuttuu
        res.send(`
        <div style="font-family:sans-serif; padding-top:50px; padding-left:50px; text-align:center; max-width:960px;">

        <form method="GET" action="http://localhost:3101/">
        <div style="width:41.66666667%;">
        <h2 style="color:red;">Anna nimesi sekä sähköpostiosoitteesi ja hyväksy käyttöehdot<h2>
        <h2 style="text-align:left; padding-left:20px;">Nimi: </h2>
        <h2 style="text-align:left; padding-left:20px;">Sähköposti: </h2>
        
        
        <button style="width:150px; padding-top:10px; padding-bottom:10px; font-size: 20px; color:white; background-color: #0d6efd; border-color: #0d6efd; border-radius: .25rem; margin-top:20px;" type="submit">Takaisin</button>
        </form>

        </div>
        </div>
        `);
    }
    else if(virhe2){         //virhesivu, jos 1-2 puuttuu
        res.send(`
        <div style="font-family:sans-serif; padding-top:50px; padding-left:50px; text-align:center; max-width:960px;">

        <form method="GET" action="http://localhost:3101/">
        <div style="width:41.66666667%;">
        <h2 style="color:red;">${nimiVirhe} <h2>
        <h2 style="color:red;">${sPostiVirhe}<h2>
        <h2 style="color:red;">${ehtoVirhe} <h2>
        <h2 style="text-align:left; padding-left:20px;">Nimi: </h2>
        <h2 style="text-align:left; padding-left:20px;">Sähköposti: </h2>
        
        <button style="width:150px; padding-top:10px; padding-bottom:10px; font-size: 20px; color:white; background-color: #0d6efd; border-color: #0d6efd; border-radius: .25rem; margin-top:20px;" type="submit">Takaisin</button>
        </form>

        </div>
        </div>
        `);
    }
    else {                  //sivu, jos kaikki tiedot olemassa
        res.send(`
            <div style="font-family:sans-serif; padding-top:50px; padding-left:50px; text-align:center; max-width:960px;">

                <div style="width:41.66666667%;">
                <h1>Olet tilannut onnistuneesti uutiskirjeemme. Kiitos!</h1>
                <h2 style="text-align:left; padding-left:20px;">Nimi: ${nimi}</h2>
                <h2 style="text-align:left; padding-left:20px;">Sähköposti: ${email}</h2>
                
                <button style="width:150px; padding-top:10px; padding-bottom:10px; font-size: 20px; color:white; background-color: #0d6efd; border-color: #0d6efd; border-radius: .25rem; margin-top:20px;">Takaisin</button>

                </div>
            </div>
        `);                 //pahoittelen, jos ymmarsin tehtavan vaarin
    }
});
app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin ${portti}`)  //en tieda tekeeko mitaan, kaytan koska demossa oli
});
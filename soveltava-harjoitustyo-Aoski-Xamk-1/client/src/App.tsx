import React, { useState } from 'react';
import {Routes , Route, useNavigate, NavigateFunction} from 'react-router-dom'; 
import { Container, Typography } from '@mui/material'; 
import Etusivu from './components/Etusivu';
import Login from './components/Login';
import Register from './components/Register';
import Tiedot from './components/Tiedot';

interface Lisays {
  id : number,
  kalorit : number,
  juomalitroina : number,
  liikuntatunteina : number,
  paivays : string
}

interface Kayttaja {
  kayttajaId : number,
  kayttajatunnus : string,
  salasana : string,
  sukupuoli : string
}

interface Data {
  lisaykset : Lisays[],
  virhe : string,
  dataHaettu : boolean
}

interface Data2 {
  kayttajat : Kayttaja[],
  virhe : string,
  dataHaettu : boolean
}

const App : React.FC = () : React.ReactElement => {

  const navigate : NavigateFunction = useNavigate();

  const [token, setToken] = useState<string>(String(localStorage.getItem("jwt")))

  const [data, setData] = useState<Data>({
    lisaykset : [],
    virhe : "",
    dataHaettu : false
  });

  const [data2, setData2] = useState<Data2>({ //olisi kai voinut yhdistaa
    kayttajat : [],
    virhe : "",
    dataHaettu : false
  });
  
  const apiKutsu = async (asetukset : any) : Promise<void> => {  
    console.log("tietolisäys2");
    try {
      const yhteys = await fetch("http://localhost:3109/api/lisaykset", asetukset);
    
      if (yhteys.status === 200) {

        const vastaanotettuData = await yhteys.json();

        setData({
                  ...data,
                  lisaykset : vastaanotettuData,
                  dataHaettu : true
                });
  
      } else {

        if (yhteys.status === 401) {

          navigate("/login");
        
        } else { 

          setData({
            ...data,
            virhe : `Palvelin ei palauttanut dataa. (status : ${yhteys.status})`
          });
        }
      }

    } catch (e : any) {

      setData({
                ...data,
                virhe : "Palvelimeen ei saada yhteyttä."
              });
    }
  }

  const apiKutsu2 = async (asetukset : any) : Promise<void> => {   //tyhma ratkaisu, mutta parempi kuin api:en sekoittaminen

    console.log("lisäys2");
    console.log(asetukset);
    try {
      const yhteys = await fetch("http://localhost:3109/api/kayttajat", asetukset);

      if (yhteys.status === 200) {
        const vastaanotettuData = await yhteys.json();
        console.log("vastaanotettudata", vastaanotettuData);
        setData2({
                  ...data2,
                  kayttajat : vastaanotettuData,
                  dataHaettu : true
                });
  
      } else {

        if (yhteys.status === 401) {

          navigate("/login");
        
        } else { 

          setData2({
            ...data2,
            virhe : `Palvelin ei palauttanut dataa. (status : ${yhteys.status})`
          });
        }
      }

    } catch (e : any) {

      setData2({
                ...data2,
                virhe : "Palvelimeen ei saada yhteyttä."
              });
    }
  }
  
  return (
    <Container>
      
      <Typography variant="h5">
        Ravintopäiväkirja
      </Typography>
      
      <Routes>
        <Route path="/" element={<Etusivu token={token}/>}/>
        <Route path="/login" element={<Login setToken={setToken}/>}/>
        <Route path="/register" element={<Register data={data2} setData={setData2} token={token} apiKutsu={apiKutsu2}/>}/>
        <Route path="/tiedot" element={<Tiedot data={data} setData={setData} token={token} apiKutsu={apiKutsu}/>}/>
      </Routes>

    </Container>
  );
}

export default App;
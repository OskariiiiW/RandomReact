import React, { useState } from 'react';
import {Routes , Route, useNavigate, NavigateFunction} from 'react-router-dom'; 
import { Container, Typography } from '@mui/material'; 
import Tiedot from './components/Tiedot';
import Login from './components/Login';
import Alkuruutu from './components/Alkuruutu';

interface Kayttajat {
  kayttajaId : number,
  tunnus : string,
  salasana : string
}
interface Uutiset {
  uutisId : number,
  otsikko : string,
  sisalto : string
}
interface Kommentit {
  kommenttiId : number,
  uutisId : number,
  kayttajatunnus : string,
  kommentti : string,
  aikaleima : string
}
interface Data {
  kayttajat : Kayttajat[],
  uutiset : Uutiset[],
  kommentit : Kommentit[],
  virhe : string,
  dataHaettu : boolean
}

const App : React.FC = () : React.ReactElement => {

  const navigate : NavigateFunction = useNavigate();  //-----------------------------

  const [token, setToken] = useState<string>(String(localStorage.getItem("jwt")));

  const [data, setData] = useState<Data>({
    kayttajat : [],
    uutiset : [],
    kommentit : [],
    virhe : "",
    dataHaettu : false
    });
  
  const apiKutsu = async (asetukset : any) : Promise<void> => {  
    console.log(asetukset);
    try {
      const yhteys = await fetch("http://localhost:3106/api/kayttajat", asetukset);
      const yhteys2 = await fetch("http://localhost:3106/api/uutiset", asetukset);
      const yhteys3 = await fetch("http://localhost:3106/api/kommentit", asetukset);
    
      if (yhteys.status === 200) {

        const vastaanotettuData = await yhteys.json();
        const vastaanotettuData2 = await yhteys2.json();
        const vastaanotettuData3 = await yhteys3.json();

        setData({
                  ...data,
                  kayttajat : vastaanotettuData,
                  uutiset : vastaanotettuData2,
                  kommentit : vastaanotettuData3,
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
  
  return (
    <Container>
      
      <Typography variant="h5">
        Tehtävä 6
      </Typography>
      
      <Routes>
        <Route path="/" element={<Alkuruutu data={data} setData={setData} token={token} apiKutsu={apiKutsu}/>}/>
        <Route path="/login" element={<Login setToken={setToken}/>}/>
        <Route path="/loginSuccess" element={<Tiedot data={data} setData={setData} token={token} apiKutsu={apiKutsu}/>}/>
      </Routes>

    </Container>
  );
}

export default App;
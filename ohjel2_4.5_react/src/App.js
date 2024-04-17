import {Container, Typography} from '@material-ui/core';
import {useState, useEffect} from 'react';
import Ostoslista from './components/Ostoslista';
import UusiOstos from './components/UusiOstos';

function App() {

  const [ostokset, setOstokset] = useState([]);

  const haeOstokset = async () => {
    let yhteys = await fetch("http://localhost:3201/api/ostokset");
    let tiedot = await yhteys.json();

    setOstokset(tiedot);
    
  }

  const lisaaUusi = async (Uusiostos) => {
    let yhteys = await fetch("http://localhost:3201/api/ostokset", {
      method : "POST",
      body : JSON.stringify({Uusiostos : Uusiostos})
    });
    let tiedot = await yhteys.json();
  }

  useEffect(() => {
    haeData();
  }, []);

  return (
    <Container>
      <Typography variant="h5">toimii</Typography>
      <Ostoslista ostokset={ostokset} />
      <UusiOstos lisaaUusi={lisaaUusi}/>
    </Container>
  );
}

export default App;

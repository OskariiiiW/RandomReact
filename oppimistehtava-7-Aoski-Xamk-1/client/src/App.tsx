import React from 'react';
import { Container, Typography} from '@mui/material';
import {Routes, Route} from 'react-router-dom';
import Foorumi from './components/Foorumi';
//import Hallinta from './components/Hallinta';

/* 
interface Data {
  foorumikirjoitukset : any[],
  dataHaettu : boolean,
  virhe : string
}*/

const App : React.FC = () : React.ReactElement => {


  return (
    <Container>
      <Typography variant='h5'>Tehtava 7</Typography>

      <Routes>
        <Route path="/" element={<Foorumi />}/>
        {"<Route path=/hallinta element={<Hallinta />}/>"}

      </Routes>

    </Container>
  );
}

export default App;

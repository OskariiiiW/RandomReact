import React, { useState, useEffect } from 'react';
import { Alert, Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material'; 
import { format, parseJSON } from 'date-fns';
import Uusi from './Uusi';

interface Data {
  foorumitekstit : any[],
  virhe : string,
  dataHaettu : boolean
}

const Foorumi : React.FC = () : React.ReactElement => {

  const [data, setData] = useState<Data>({
      foorumitekstit : [],
      virhe : "",
      dataHaettu : false
  });

  const haeFoorumitekstit = async () : Promise<void> => {

      const yhteys = await fetch("/api/foorumitekstit");

      setData({
        ...data,
        foorumitekstit : await yhteys.json(), //-----------VIRHEKOHTA----------
        dataHaettu : true
      });
  };

  const [dialogiAuki, setDialogiAuki] = useState<boolean>(false);

  const lisaaUusi = async(kayttaja : string, otsikko : string, sisalto : string) : Promise<void> => {

    try {

      const yhteys = await fetch("/api/foorumitekstit", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
          body : JSON.stringify({
            kayttaja : kayttaja,
            otsikko : otsikko,
            sisalto : sisalto
          })
        
      });

      const uusiKommentti = await yhteys.json();

      setData({
        ...data,
        dataHaettu : true,
        foorumitekstit : [...data.foorumitekstit, uusiKommentti]
      })

    } catch (e : any) {

      setData({
        ...data,
        virhe : "Palvelimeen ei saada yhteyttä.",
        dataHaettu : true
      });
    }
  }

  useEffect(() => {
 
    haeFoorumitekstit();

  }, []);

    return (Boolean(data.virhe))
      ? <Alert severity="error">
          {data.virhe}
        </Alert>
      : (data.dataHaettu)
        ? <>
            {data.foorumitekstit.map((teksti : any, idx : number) => {
              return <Box key={idx} sx={{paddingTop : 2}}> 
                        <Stack spacing={1}>
                          <Typography variant="h5">{teksti.otsikko + " " + teksti.kayttaja}</Typography>
                          <Typography variant="body2">{format(parseJSON(teksti.createdAt), "dd.MM.yyyy  HH:mm")}</Typography>
                          <Typography variant="body2"><span dangerouslySetInnerHTML={ {__html: teksti.sisalto} } /></Typography>
                        </Stack>
                    </Box>
            })}
        <Uusi dialogiAuki={dialogiAuki} setDialogiAuki={setDialogiAuki} lisaaUusi={lisaaUusi}/>            
          </>
        : <Backdrop open={true}>
            <CircularProgress color="inherit"/>
          </Backdrop>     
}

export default Foorumi;
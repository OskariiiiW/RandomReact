import React, { useEffect, useState, useRef } from 'react';
import {Alert, Backdrop, Dialog, Button, CircularProgress, Container, ListItem, ListItemText, Typography, List, ListItemAvatar, Avatar, DialogContent} from '@mui/material';

interface Henkilo {
  id : number,
  etunimi : string,
  sukunimi : string,
  titteli : string,
  sukupuoli : string,
  puhelin : string,
  aloittanut : {
    ppkkvvvv : string,
    aikaleima : number
  },
  sahkoposti : string,
  kuva : string
}

interface Data {
  henkilot : Henkilo[],
  virhe : string,
  dataHaettu : boolean
}

const App : React.FC = () : React.ReactElement => {

  const [open, setOpen] = React.useState(false);

  const [data, setData] = useState<Data>({
    henkilot : [],
    virhe : "",
    dataHaettu : false
  });

const haeData = async () : Promise<void> => {

  try {
    const yhteys = await fetch("http://localhost:3105/api/henkilot");

    if (yhteys.status === 200) {
      const vastaanotettuData = await yhteys.json();

      setData({
        ...data,
        henkilot : vastaanotettuData,
        dataHaettu : true
      });

    } else {
      setData({
        ...data,
        virhe : `Palvelin ei palauttanut dataa. (Status : ${yhteys.status}`
      });
    }

  } catch (e : any) {
    setData({
      ...data,
      virhe : "Palvelimeen ei saada yhteyttä"
    });
  }
}

const handleClickOpen = () => {
  setOpen(true);
}
const handleClose = () => {
  setOpen(false);
}

useEffect(() => {
  haeData();
}, []);

  return (
    <Container>
      <Typography variant="h5">
        Henkilöhakemisto
      </Typography>
      
      {(Boolean(data.virhe))
      ? <Alert severity="error">
        {data.virhe}
      </Alert>
      :(data.dataHaettu)
      ? <>
        <List>
            {data.henkilot.map((henkilo : Henkilo, idx : number) => {
              return <ListItem key={idx}>
                <ListItemText primary={henkilo.etunimi + " " + henkilo.sukunimi} 
                  secondary={henkilo.titteli}></ListItemText>

                <Button style={{marginRight : "20px" }}variant="outlined" onClick={handleClickOpen}>Lisätiedot</Button>
                  <Dialog key={idx} onClose={handleClose} open={open}>
                    <List>
                      <ListItemText key={idx} primary={henkilo.etunimi + " " + henkilo.sukunimi}/>
                    </List>
                  </Dialog>
                
                <ListItemAvatar>
                    <Avatar src="./1.jpg" /> {/*mikaan ei tunnu toimivan polkuna */}
                </ListItemAvatar>
              </ListItem>
            })}

        </List>
      </>
      : <Backdrop open={true}>
          <CircularProgress color="inherit"/>
        </Backdrop>}
    </Container>
  );
}

export default App;

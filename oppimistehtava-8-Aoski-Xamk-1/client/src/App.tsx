import React, { useRef, useState } from 'react';
import {Alert, Button, Card, Container, List, ListItem, Grid, Typography, Paper, Stack, TextField, ListItemText, CardContent, CardMedia, RadioGroup, FormControlLabel, Radio} from '@mui/material'; 

const App : React.FC = () : React.ReactElement => {

  const hakuRef = useRef<any>();
  const [postimerkit, setPostimerkit] = useState<any[]>([]);
  const [virhe, setVirhe] = useState<string>("");
  const [yliNelja, setYliNelja] = useState<string>("");
  const [haku, setHaku] = useState<string>("hakusana");

  const kaynnistaHaku = async (e : React.FormEvent) : Promise<void> => {

    e.preventDefault();
    
    try {

      let reitti : string = `/api/postimerkit?${haku}=${hakuRef.current.hakusana.value}`;
     
        const yhteys = await fetch(reitti);
        console.log(reitti); 

        const data = await yhteys.json(); //---------VIRHEKOHTA----------------

        setPostimerkit(data);

        if(postimerkit.length >= 40){
          setYliNelja("Haulla löytyi yli 40 postimerkkiä, näytetään vain ensimmäiset 40. Ole hyvä ja tarkenna hakua");
        }
        else {
          setYliNelja("");
        }

    } catch (e: any) {

      setVirhe("Palvelimelle ei saada yhteyttä.")
    } 
  }                                           //quick fix ehdotus, nayttaa toimivan
  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
      setHaku(e.target.value);
  };

  return (
    <Container>
      <Typography variant="h5">Tehtävä 8</Typography>
      
      <Typography variant="h6">Postimerkkihaku</Typography>

      <Paper 
        component="form"
        onSubmit={kaynnistaHaku}
        ref={hakuRef}
        elevation={2}
        sx={{ padding : 2 }}
      >
        <Stack spacing={2}>

          <Grid container spacing={1}>
            <Grid item xs={10}>

              <TextField 
                name="hakusana"
                variant="outlined"
                size="small"
                fullWidth={true}
              />

            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Haun kohde:</Typography>

              <RadioGroup
                row
                defaultValue="asiasanat"
                name="haunKohde"
                value={haku}
                onChange={handleChange}
              >
                <FormControlLabel value="asiasanat" control={<Radio />} label="Asiasanat" />
                <FormControlLabel value="merkinNimi" control={<Radio />} label="Merkin nimi" />
                <FormControlLabel value="taiteilija" control={<Radio />} label="Taiteilija" />
              </RadioGroup>

            </Grid>
            <Grid item xs={2}>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth={true}
              >Hae</Button>

            </Grid>
          </Grid>

        </Stack>

      </Paper>

      {(Boolean(virhe)) 
        ? <Alert severity="error">{virhe}</Alert>
        : <List>{postimerkit.map((postimerkki, idx) => {
          return <ListItem key={idx}>

                  <Typography>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>

                        <Card>
                          <CardContent>
                            <Typography>{postimerkki.merkinNimi}</Typography> 
                            <Typography>{postimerkki.taiteilija}</Typography>
                            <Typography>{postimerkki.nimellisarvo}</Typography>
                            <Typography>{postimerkki.painosmaara}</Typography>
                            <Typography>{postimerkki.painopaikka}</Typography>                          
                          </CardContent>
                          <CardMedia component="img" image={postimerkki.kuvanUrl}/>
                        </Card>

                      </Grid>
                    </Grid>

                  </ListItem>
        })}</List> 
      }

      <Typography>{yliNelja}</Typography>

    </Container>
  );
}

export default App;
import React, { useRef, Dispatch, SetStateAction, useEffect } from 'react';
import {useNavigate, NavigateFunction} from 'react-router-dom';
import { Alert, Backdrop, Button, CircularProgress, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'; 
import { format } from 'date-fns';

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
interface Props {
    data : Data,
    token : string,
    setData : Dispatch<SetStateAction<Data>>
    apiKutsu : (arg0: any) => {}
}

const Tiedot : React.FC<Props> = (props : Props) : React.ReactElement => {

  const formData = useRef<any>({})
  const navigate : NavigateFunction = useNavigate();

  const lisaaUusi = async (e : any) : Promise<void> => {

    e.preventDefault();

    if (formData.current.uusiKommentti.length > 0) {

        props.setData({
            ...props.data,
            dataHaettu : false
        });

        props.apiKutsu({ 
                method : "POST",
                headers : {
                  'Content-Type' : 'application/json',
                  'Authorization' : `Bearer ${props.token}`
                },
                body : JSON.stringify({
                    "uutisId" : 1,   //----------------------------------------------------
                    "kayttajatunnus" : "props.token.kayttajatunnus",
                    "kommentti" : formData.current.uusiKommentti,
                    "aikaleima" : format(new Date(), "dd.MM.yyyy")
                })
              });
        } 
  }

  const logout = async (e : React.FormEvent) : Promise<void> => {
    navigate("/login");
  }

  useEffect(() => {
    props.apiKutsu({
              method : "GET",
              headers : {
                'Authorization' : `Bearer ${props.token}`
              }
            });    
  }, []);

  return (Boolean(props.data.virhe))
      ? <Alert severity="error">
          {props.data.virhe}
        </Alert>
      : (props.data.dataHaettu)
        ? <>
          <List>
            {props.data.uutiset.map((uutiset : Uutiset, idx : number) => {
              return <ListItem key={idx}>
                        <ListItemText primary={uutiset.otsikko} secondary={uutiset.sisalto}></ListItemText>
                    </ListItem>
            })}

            <Typography>Kommentit:</Typography>

            {props.data.kommentit.map((kommentit : Kommentit, idx : number) => {
                return <ListItem key={idx}>
                    <ListItemText primary={kommentit.kayttajatunnus + " kommentoi uutiseen " + kommentit.uutisId} 
                        secondary={'"' + kommentit.kommentti + '"'+ " " + kommentit.aikaleima}/>
                </ListItem>
            })}
          </List>
          <form onSubmit={(e: any) => {
                                    lisaaUusi(e);
                                    }}>
          <Stack spacing={1}>
            <TextField
              name="uusiKommentti"
              variant="outlined"
              placeholder='Kirjoita kommentti' 
              multiline
              maxRows={4}
              fullWidth={true}
              onChange={(e: any) => { formData.current[e.target.name] = e.target.value }}      
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth={true}
              size="large"
            >Lisää uusi kommentti</Button>

            <Button
              type="submit"
              variant="contained"
              color="error"
              fullWidth={true}
              size="large"
              onClick={logout}
            >Kirjaudu ulos</Button>
            
          </Stack>
          </form>
          </>
        : <Backdrop open={true}>
            <CircularProgress color="inherit"/>
          </Backdrop>  
}

export default Tiedot;
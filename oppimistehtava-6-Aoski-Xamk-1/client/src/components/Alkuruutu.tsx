import React, { useRef, Dispatch, SetStateAction, useEffect } from 'react';
import {useNavigate, NavigateFunction} from 'react-router-dom';
import { Alert, Backdrop, Button, CircularProgress, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'; 



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
    token : string
    setData : Dispatch<SetStateAction<Data>>,
    apiKutsu : (arg0: any) => {}
}

const Tiedot : React.FC<Props> = (props : Props) : React.ReactElement => {

  //const formData = useRef<any>({})

  const navigate : NavigateFunction = useNavigate();

  const login = async (e : React.FormEvent) : Promise<void> => {
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
        ?   <>
                <List>
                    {props.data.uutiset.map((uutiset : Uutiset, idx : number) => {
                        return <ListItem key={idx}>
                                  <ListItemText primary={uutiset.otsikko} secondary={uutiset.sisalto}></ListItemText>
                                </ListItem>
                    })}
                </List>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth={true}
                    size="large"
                    onClick={login}
                    >Kirjaudu sisään kommentoidaksesi</Button>
            </>
        :   <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
       
}


export default Tiedot;
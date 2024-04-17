import React, {useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Stack, TextField, Typography} from "@mui/material";
import {useNavigate, NavigateFunction} from 'react-router-dom';

interface Lisays {
  id : number,
  kalorit : number,
  juomalitroina : number,
  liikuntatunteina : number,
  paivays : string
}

interface Data {
    lisaykset : Lisays[],
    virhe : string,
    dataHaettu : boolean
  }

  interface Props {
    data : Data,
    token : string,
    setData : Dispatch<SetStateAction<Data>>
    apiKutsu : (arg0: any) => {}
}

const Tiedot: React.FC<any> = (props : Props) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();
    const [tiedot, setTiedot] = useState<any[]>([]);
    const lomakeRef = useRef<any>();
    const kaloriInput = useRef<HTMLInputElement>();
    const juomaInput = useRef<HTMLInputElement>();
    const liikuntaInput = useRef<HTMLInputElement>();
    const paivaInput = useRef<HTMLInputElement>();
    const [virhe, setVirhe] = useState<string>("");
    const [tiedotHaettu, setTiedotHaettu] = useState<boolean>(false);
    const [open, setOpen] = React.useState(false);

    const kirjauduUlos = async (e : React.FormEvent) : Promise<void> => {
        navigate("/login");
    };

    const lisaaUusi = async (e : React.FormEvent) : Promise<void> => {

        e.preventDefault();

        if (kaloriInput.current?.value && juomaInput.current?.value && liikuntaInput.current?.value && paivaInput.current?.value) {
            console.log("tietolisäys1");
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
                    "kalorit" : kaloriInput.current?.value,
                    "juomalitroina" : juomaInput.current?.value,
                    "liikuntatunteina" : liikuntaInput.current?.value,
                    "paivays" : paivaInput.current?.value
                })
            });
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const haeTiedot = async () : Promise<void> => {

        //e.preventDefault();
    
        try {
    
            let reitti : string = `/api/lisaykset`;
    
            const yhteys = await fetch(reitti)
            const data = await yhteys.json();

            setTiedotHaettu(true);
    
            setTiedot(data);
    
        } catch (e: any) {
    
          setVirhe("Palvelimelle ei saada yhteyttä.")
        } 
      }

      useEffect(() => {

        props.apiKutsu({
            method : "GET",
            headers : {
              'Authorization' : `Bearer ${props.token}`
            }
        });
 
        haeTiedot();
    
      }, []);

    return (Boolean(virhe)) 
        ? <Alert severity="error">{virhe}</Alert>
        
        :  (tiedotHaettu)

            ? <> <List>{props.data.lisaykset.map((ravinto, idx) => {
                return <ListItem key={idx}>
                            <ListItemText primary={`${ravinto.kalorit} kcal, ${ravinto.paivays}`}
                                secondary={`${ravinto.juomalitroina} litraa juotu, ${ravinto.liikuntatunteina} tuntia liikuttu`}
                            />
                    </ListItem>
                })}</List>
          
                <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    size="large"
                    //fullWidth={true}
                    onClick={handleClickOpen}
                    style={{marginBottom:"10"}}
                >Lisää uusi merkintä</Button>

                <Button
                    variant="contained"
                    size="large"
                    color="error"
                    //fullWidth={true}
                    onClick={kirjauduUlos}
                >Kirjaudu ulos</Button>
                </Stack>

                <Dialog ref={lomakeRef} open={open} onClose={handleClose}>
                    <DialogTitle>Lisää uusi merkintä</DialogTitle>
                        <DialogContent>
                        <TextField
                            id="ruoka"
                            label="Kalorit"
                            fullWidth
                            variant="standard"
                            inputRef={kaloriInput}
                        />
                        <TextField
                            id="juoma"
                            label="Juotu nestemäärä litroina"
                            fullWidth
                            variant="standard"
                            inputRef={juomaInput}
                        />
                        <TextField
                            id="liikunta"
                            label="Liikunnan määrä tunteina"
                            fullWidth
                            variant="standard"
                            inputRef={liikuntaInput}
                        />
                        <TextField
                            id="paiva"
                            label="Merkinnän päiväys"
                            fullWidth
                            variant="standard"
                            inputRef={paivaInput}
                        />
                        </DialogContent>
                    <DialogActions>
                    <Button onClick={lisaaUusi}>Lisää</Button>
                    <Button color="error" onClick={handleClose}>Peruuta</Button>
                    </DialogActions>
                </Dialog>
            
                </>

            :   <Alert severity="error">{virhe}</Alert>
};

export default Tiedot;
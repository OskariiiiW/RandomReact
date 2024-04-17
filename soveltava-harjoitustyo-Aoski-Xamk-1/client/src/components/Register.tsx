import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography} from "@mui/material";
import {useNavigate, NavigateFunction} from 'react-router-dom';

interface Kayttaja {
    kayttajaId : number,
    kayttajatunnus : string,
    salasana : string,
    sukupuoli : string
  }
  
  interface Data {
      kayttajat : Kayttaja[],
      virhe : string,
      dataHaettu : boolean
    }
  
    interface Props {
      data : Data,
      token : string,
      setData : Dispatch<SetStateAction<Data>>
      apiKutsu : (arg0: any) => {}
  }

const Register: React.FC<Props> = (props : Props) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();
    const lomakeRef = useRef<any>();
    const tunnusInput = useRef<HTMLInputElement>();
    const salasanaInput = useRef<HTMLInputElement>();

    const lisaaUusi = async (e : any) : Promise<void> => {
        console.log("lisäys1");
        e.preventDefault();
    
        if (tunnusInput.current?.value && salasanaInput.current?.value && lomakeRef.current.sukupuoli.value) {
    
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
                    "kayttajatunnus" : tunnusInput.current?.value,
                    "salasana" : salasanaInput.current?.value,
                    "sukupuoli" : lomakeRef.current.sukupuoli.value
                })
            });
            navigate("/login");
        }
      }

    const peruuta = async (e : React.FormEvent) : Promise<void> => {
        navigate("/login");
    };

    /*
    useEffect(() => {
        props.apiKutsu({
            method : "GET",
            headers : {
                'Authorization' : `Bearer ${props.token}`
            }
        });    
    }, []);*/

    return (
            <Box
                ref={lomakeRef}
                component="form"
                onSubmit={lisaaUusi}
                style={{
                    width: 300,
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6">Rekisteröidy</Typography>
                    <TextField 
                        label="kayttajatunnus" 
                        inputRef={tunnusInput}
                    />
                    <TextField 
                        label="salasana"
                        inputRef={salasanaInput} 
                        type="password" 
                    />
                    <FormControl>
                        <FormLabel>Sukupuoli</FormLabel>
                        <RadioGroup
                        row
                        name="sukupuoli"
                        >
                            <FormControlLabel value="nainen" control={<Radio />} label="Nainen" />
                            <FormControlLabel value="mies" control={<Radio />} label="Mies" />
                            <FormControlLabel value="muu" control={<Radio />} label="Muu" />
                        </RadioGroup>
                    </FormControl>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                    >Tee käyttäjä
                    </Button>

                    <Button
                        color="error"
                        variant="contained" 
                        size="large"
                        onClick={peruuta}
                    >Peruuta
                    </Button>
                </Stack>
            </Box>
    );
};

export default Register;
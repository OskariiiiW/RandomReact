import React, { Dispatch, SetStateAction, useRef } from "react";
import { Box, Button, Stack, TextField, Typography} from "@mui/material";
import {useNavigate, NavigateFunction} from 'react-router-dom';

interface Props {
    setToken : Dispatch<SetStateAction<string>>
}

const Login: React.FC<Props> = (props : Props) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const tunnusInput = useRef<HTMLInputElement>();
    const salasanaInput = useRef<HTMLInputElement>();

    const kirjaudu = async (e : React.FormEvent) : Promise<void> => {
        
        e.preventDefault();

        try {

            const yhteys = await fetch("http://localhost:3106/auth/login", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    tunnus : tunnusInput.current?.value,
                    salasana : salasanaInput.current?.value
                })
            });

            const vastaus = await yhteys.json();

            if (yhteys.status === 200) {

                props.setToken(vastaus.token);
                localStorage.setItem("jwt", vastaus.token);
                navigate("/loginSuccess");
            }

        } catch (e :any) {
        }
    };

    const peruuta = async (e : React.FormEvent) : Promise<void> => {
        navigate("/");
    };

    return (
            <Box
                component="form"
                onSubmit={kirjaudu}
                style={{
                    width: 300,
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6">Kirjaudu sisään</Typography>
                    <TextField 
                        label="Käyttäjätunnus" 
                        inputRef={tunnusInput}
                    />
                    <TextField 
                        label="Salasana"
                        inputRef={salasanaInput} 
                        type="password" 
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large">
                        Kirjaudu
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                        color="error"
                        onClick={peruuta}
                        >Peruuta
                    </Button>
                    <Typography>
                        käyttäjä:besserwisser, salasana:kissakala
                    </Typography>
                </Stack>
            </Box>
    );
};

export default Login;
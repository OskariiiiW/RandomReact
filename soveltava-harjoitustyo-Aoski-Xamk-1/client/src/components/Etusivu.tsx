import React from "react";
import { Box, Button, Stack, Typography} from "@mui/material";
import {useNavigate, NavigateFunction} from 'react-router-dom';

const Etusivu: React.FC<any> = () : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const kirjaudu = async (e : React.FormEvent) : Promise<void> => {
        navigate("/login");
    };

    const register = async (e : React.FormEvent) : Promise<void> => {
        navigate("/register");
    };

    return (
            <Box
            component="form"
            //onSubmit={kirjaudu}
            style={{
                width: 300,
            }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6">Tervetuloa ravintopäiväkirjaan</Typography>

                    <Button 
                        //type="submit" 
                        variant="contained" 
                        size="large"
                        onClick={kirjaudu}
                    >Kirjaudu
                    </Button>

                    <Button 
                        //type="submit" 
                        variant="contained" 
                        size="large"
                        onClick={register}
                    >Rekisteröidy
                    </Button>
                </Stack>
            </Box>
    );
};

export default Etusivu;
import {useState} from 'react';
import {TextField} from '@material-ui/core';

function UusiOstos(props){

    const [ostos, setOstos] = useState();

    const lisaa = () =>{
        props.lisaaUusi(ostos);
    }

    return <>
    <TextField
        variant="outlined"
        fullWidth
        placeholder="Ostos..."
        onChange={(e) =>{setOstos(e.target.value)}}
    />
    <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{marginTop:10}}
        onClick={lisaa}
        >Lisää</Button>
    </>
}
export default UusiOstos;
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

interface Props {
  dialogiAuki : boolean
  setDialogiAuki : Dispatch<SetStateAction<boolean>>
  lisaaUusi : (kayttaja : string, otsikko: string, sisalto: string) => void
}

const Uusi: React.FC<Props> = (props : Props) : React.ReactElement => {

  const formRef : any = useRef<HTMLFormElement>();
  const quillRef : any = useRef<any>();

  const tallenna = (e: React.FormEvent) : void => {

    e.preventDefault();
    let kirjoittaja = "Anonyymi";

    if(formRef.current.kayttaja.value !== ""){
        kirjoittaja = formRef.current.kayttaja.value;
    }

    props.lisaaUusi(kirjoittaja, formRef.current.otsikko.value, quillRef.captureRejections.getEditorContents());

    formRef.current.otsikko.value = "";

    props.setDialogiAuki(false);
  }

  const peruuta = () : void => {

    props.setDialogiAuki(false);
  } 

  return <Dialog
            maxWidth="lg" 
            fullWidth={true}
            open={props.dialogiAuki} 
            onClose={peruuta}
          >
          <DialogTitle>Lisää uusi kommentti foorumiin</DialogTitle>
          <DialogContent style={{paddingTop : 10}}>
            <Stack 
              spacing={1} 
              component="form"
              onSubmit={tallenna}
              ref={formRef}
            >

            <TextField
              name="kayttaja"
              label="Kirjoittajan nimi"
              fullWidth
              variant="outlined"
            />
            <TextField
              name="otsikko"
              label="Kommentin otsikko"
              fullWidth
              variant="outlined"
            />

            <ReactQuill
                ref={quillRef}
                style={{height : 200, marginBottom : 50}}
            />

            <Button 
              variant="contained"
              type="submit"
            >Tallenna</Button>

            <Button
              variant="outlined"
              onClick={peruuta}
            >Peruuta</Button>

            </Stack>
          </DialogContent>

        </Dialog>;
};

export default Uusi;
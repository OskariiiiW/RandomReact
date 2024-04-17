import express, {NextFunction} from 'express';
import apiRouter from './routes/api';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3005;

app.use(cors({
    "origin" : "*",
    "optionsSuccessStatus" : 200 //vanhat selaimet
}));

app.use((req : express.Request, res : express.Response, next : NextFunction) => {
    setTimeout(next, 100);
}); //keinotekoinen viive

app.use((req : Express.Request, res : Express.Response, next : NextFunction) => {

    try {
        let token : string = req.headers.authorization!.split(" ")[1];

        let payload = jwt.verify(token, "SuuriSalaisuus!!!", {algorithms : ["HS256"]})

        next();

    } catch (e : any) {

        res.status(401).json({"virhe : Pääsy kielletty"});

    }
});

app.use("/api/", apiRouter);

app.listen(portti, () => {

    console.log(`Palvelin kännistyi porttiin ${portti}`);

});
import express, {NextFunction} from 'express';
import apiRouter from './server/routes/api';
import cors from 'cors';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3105;

app.use(cors({
    "origin" : "http://localhost:3000",
    "optionsSuccessStatus" : 200 //vanhat selaimet
}));

app.use((req : Express.Request, res : Express.Response, next : NextFunction) => {
    setTimeout(next, 100);
}); //keinotekoinen viive

app.use("/api/", apiRouter);

app.listen(portti, () => {

    console.log(`Palvelin kännistyi porttiin ${portti}`);

});
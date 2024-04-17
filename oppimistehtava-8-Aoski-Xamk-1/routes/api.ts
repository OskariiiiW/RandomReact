import express from 'express';
import { /*Prisma,*/ PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const apiRouter : express.Router = express.Router();

apiRouter.get("/postimerkit", async (req : express.Request, res :express.Response ) => {

    if (typeof req.query.asiasanat === "string" && req.query.merkinNimi === "string" && req.query.taiteilija === "string") {

        let asiasanat : string = `%${String(req.query.asiasanat)}%`;
        let merkinNimi : string = `%${String(req.query.merkinNimi)}%`;
        let taiteilija : string = `%${String(req.query.taiteilija)}%`;

        if (asiasanat.length >= 2) {

            let postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE 
                                                    asiasanat LIKE ${asiasanat.toLowerCase()} LIMIT 40`; //LIMIT 10
            if (postimerkit) {
                res.json(postimerkit);

            } else { 
                res.json(`virhe : Hakusanalla ${asiasanat} ei löytynyt yhtään postimerkkiä`); 
            }


        } else if (merkinNimi.length >= 2){
            let postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE 
                                                    merkinNimi LIKE ${merkinNimi.toLowerCase()} LIMIT 40`; //LIMIT 10
            if (postimerkit) {
                res.json(postimerkit);

            } else { 
                res.json(`virhe : Hakusanalla ${merkinNimi} ei löytynyt yhtään postimerkkiä`); 
            }
        

        } else if(taiteilija.length >= 2){
            let postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE 
                                                    taiteilija LIKE ${taiteilija.toLowerCase()} LIMIT 40`; //LIMIT 10
            if (postimerkit) {
                res.json(postimerkit);

            } else { 
                res.json(`virhe : Hakusanalla ${taiteilija} ei löytynyt yhtään postimerkkiä`);
            }
            
        } else { 
            res.json("virhe : Hakusana on oltava vähintään 2 merkkiä pitkä"); 
        }
    }
});

export default apiRouter;
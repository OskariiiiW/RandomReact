import express from 'express';
import { PrismaClient } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

const prisma = new PrismaClient();

const apiRouter : express.Router = express.Router();

apiRouter.use(express.json());

apiRouter.post("/foorumitekstit", async (req : express.Request, res : express.Response) : Promise<void> => {

    let foorumitekstit = await prisma.keskustelu.create({
        data : {
            kayttaja : req.body.kayttaja,
            otsikko : req.body.otsikko,
            sisalto : sanitizeHtml(req.body.sisalto)
        }
    });

    res.json(foorumitekstit);
});

apiRouter.get("/foorumitekstit", async (req : express.Request, res : express.Response) : Promise<void> => {

    let foorumitekstit = await prisma.keskustelu.findMany();

    res.json(foorumitekstit);
});


export default apiRouter;
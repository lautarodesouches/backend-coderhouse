import { Router } from 'express'

// -----------------------------------------------------------------------------------------

const router = Router();

// -----------------------------------------------------------------------------------------

router.get("/", (req,res) => {

    req.logger.error('Se cayo el servidor')

    res.send('Logger')

})

router.get("/debug", (req,res) => {

    req.logger.debug('Se cayo el servidor')

    res.send('Logger')

})

router.get("/http", (req,res) => {

    req.logger.http('Se cayo el servidor')

    res.send('Logger')

})

router.get("/info", (req,res) => {

    req.logger.info('Se cayo el servidor')

    res.send('Logger')

})

router.get("/warning", (req,res) => {

    req.logger.warning('Se cayo el servidor')

    res.send('Logger')

})

router.get("/error", (req,res) => {

    req.logger.error('Se cayo el servidor')

    res.send('Logger')

})

router.get("/fatal", (req,res) => {

    req.logger.fatal('Se cayo el servidor')

    res.send('Logger')

})

// -----------------------------------------------------------------------------------------

export default router;
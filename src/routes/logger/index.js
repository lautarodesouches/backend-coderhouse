import { Router } from 'express'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.get("/debug", (req, res) => {

    req.logger.debug('Error level: debug')

    res.send('Logger')

})

router.get("/info", (req, res) => {

    req.logger.info('Error level: info')

    res.send('Logger')

})

router.get("/warn", (req, res) => {

    req.logger.warn('Error level: warn')

    res.send('Logger')

})

router.get("/error", (req, res) => {

    req.logger.error('Error level: error')

    res.send('Logger')

})

router.get("/fatal", (req, res) => {

    req.logger.fatal('Error level: fatal')

    res.send('Logger')

})

// -----------------------------------------------------------------------------------------

export default router;
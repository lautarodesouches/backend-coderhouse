import winston from 'winston'
import config from '../config/index.js'

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warn: 'yellow',
        info: 'blue',
        debug: 'white',
    }
}

config.environment === 'production' ? '' : ''

export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: config.environment === 'production' ? 'info' : 'debug',
            format: winston.format.combine(winston.format.simple()),
        }),
        new winston.transports.File({
            level: 'error',
            format: winston.format.simple(),
            filename: './errors.log',
        }),
    ]
})

export const addLogger = (req, res, next) => {

    req.logger = logger

    req.logger.info(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`)

    next()

}
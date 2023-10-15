import winston from 'winston'

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

export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(winston.format.simple()),
        }),
        new winston.transports.File({
            level: 'warn',
            format: winston.format.simple(),
            filename: './error.log',
        }),
    ]
})

export const addLogger = (req, res, next) => {

    req.logger = logger

    req.logger.info(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`)

    next()

}
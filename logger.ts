import winston from 'winston'

const { combine, timestamp, printf } = winston.format

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
    })
    // new winston.transports.File({ filename: 'debug.log', level: 'debug' })
  ],
  format: combine(timestamp(), myFormat)
}

const logger = winston.createLogger(options)

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level')
}

export default logger

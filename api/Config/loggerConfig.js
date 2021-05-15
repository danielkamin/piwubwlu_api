const { createLogger, format, transports } = require('winston')

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'WM PB API' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        //
        new transports.File({ filename: 'logs/info-logs.log', level: 'info' }),
        new transports.File({ filename: 'logs/error-logs.log', level: 'error' }),
    ]
});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
        format.colorize(),
        format.simple()
        )
    }));
}

// logger.log({
//     level: 'info',
//     message: 'Pass an object and this works',
//     additional: 'properties',
//     are: 'passed along'
//   });

//   logger.log({
//     level: 'error',
//     message: 'Pass an object and this works',
//     additional: 'properties',
//     are: 'passed along'
//   });
//   logger.log('info', 'Pass a message and this works', {
//     additional: 'properties',
//     are: 'passed along'
//   });

//   logger.log('error', new Error('Error passed as message'));

// logger.warn('Maybe important error: ', new Error('Error passed as meta'));
// logger.log('error', 'Important error: ', new Error('Error passed as meta'));

// logger.error(new Error('Error as info'));

module.exports = logger
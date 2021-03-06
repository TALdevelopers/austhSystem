const {
    createLogger,
    transports,
    format
} = require('winston');
require('winston-mongodb');
const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'info.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.MongoDB({
            level: 'error',
            db: "mongodb+srv://admin:admin@testcluster.lxlaw.mongodb.net/?retryWrites=true&w=majority",
            options: {
                useUnifiedTopology: true
            },
            collection: 'logData',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;
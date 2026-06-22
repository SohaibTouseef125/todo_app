import app from '../app'
import { bootstrap } from '../bootstrap'
import config from '../config/config'
import logger from '../handlers/logger'
import { EApplicationEnvironment } from '../constant/application'

const server = app.listen(config.PORT)
void (async () => {
    try {
        await bootstrap().then(() => {
            logger.info(`Application started on port ${config.PORT}`, {
                meta: { SERVER_URL: config.SERVER_URL }
            })
        })
    } catch (error) {
        if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
            logger.warn(`Bootstrap failed, starting in limited mode:`, { meta: error })
            logger.info(`Application started on port ${config.PORT} (limited mode)`, {
                meta: { SERVER_URL: config.SERVER_URL }
            })
        } else {
            logger.error(`Error starting server:`, { meta: error })
            server.close((err) => {
                if (err) logger.error(`error`, { meta: error })
                process.exit(1)
            })
        }
    }
})()

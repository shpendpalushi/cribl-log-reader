import { default as express, Router } from 'express';
import { LoggerDataRouter } from './routes/logger-data.routes';
import fs from 'fs';
import dotenv from 'dotenv';
import { ErrorHandler } from './middleware/error-handler.middleware';

export default class ApplicationServer {
    public application = express();
    constructor() {
        this.initialize();
        this.configEnvironment();
    }

    private initialize() {
        this.application.set('port', process.env.PORT || 3000);
        this.application.use('/api/logger', LoggerDataRouter);
        this.application.use(ErrorHandler);
    }

    public startExpressServer(): void {
        this.application.listen(this.application.get('port'), () => {
            console.log(`Application ${process.env.APP_NAME} is running at port ${process.env.PORT},
            in ${this.application.get('env')} mode`)
        });
    }

    private configEnvironment() {
        if (fs.existsSync('.env')) {
            console.log('Using .env file to supply config environment variables');
            dotenv.config({ path: '.env' });
        } else {
            // if an .env file is not configured the application will default to the node variables.
            console.log('No .env file detected using node environment variables');
        }
    }
}
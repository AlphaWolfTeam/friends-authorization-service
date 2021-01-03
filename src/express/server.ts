import * as https from 'https';
import * as express from 'express';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as logger from 'morgan';

import { once } from 'events';
import { errorMiddleware } from './error';
import appRouter from './router';
import config from '../config';

class Server {
    private app: express.Application;

    private https: https.Server;

    private port: number;

    private privateKey: Buffer;

    private certificate: Buffer;

    constructor(port: number) {
        this.app = Server.createExpressApp();
        this.port = port;
        this.privateKey = fs.readFileSync(config.server.sslPrivateKeyPath);
        this.certificate = fs.readFileSync(config.server.sslCertificatePath);
    }

    static createExpressApp() {
        const app = express();

        app.use(helmet());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(logger('dev'));
        app.use(appRouter);

        app.use(errorMiddleware);

        return app;
    }

    async start() {
        this.https = https.createServer({ key: this.privateKey, cert: this.certificate }, this.app).listen(this.port);
        await once(this.https, 'listening');
    }
}

export default Server;

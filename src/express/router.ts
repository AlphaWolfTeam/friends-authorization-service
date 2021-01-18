import { Router } from 'express';
import spikeRouter from './spike/router';
import config from '../config/index';

const appRouter = Router();

appRouter.use('/auth', spikeRouter);

appRouter.use('/isAlive', (_req, res) => {
    res.status(config.spike.isAliveCode).send(config.spike.isAliveMessage);
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});

export default appRouter;

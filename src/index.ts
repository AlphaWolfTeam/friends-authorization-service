/* eslint-disable no-console */
import Server from './express/server';
import config from './config';

const main = async () => {
    const server = new Server(config.server.port);

    await server.start();

    console.log(`Server started on port: ${config.server.port}`);
};

main().catch((err) => console.error(err));

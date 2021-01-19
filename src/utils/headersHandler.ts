import config from '../config';

// eslint-disable-next-line import/prefer-default-export
export const getTokenRequestHeaders = () => {
    const data = `${config.spike.clientId}:${config.spike.clientSecret}`;
    const base64Data = Buffer.from(data).toString('base64');

    const headers = {
        Authorization: `Basic ${base64Data}`,
    };
    return headers;
};

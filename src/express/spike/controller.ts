import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import * as https from 'https';
import config from '../../config';
import { ServiceError } from '../error';

class SpikeController {
    static async redirectUser(_req: Request, res: Response) {
        const redirectUrl = `${config.spike.redirectUrl}?\
client_id=${config.spike.clientId}&\
audience=${config.spike.friendsAPIAudienceId}&\
scope=${encodeURI(config.spike.friendsScope)}&\
redirect_uri=${config.spike.redirectUri}&\
response_type=code`;
        res.redirect(redirectUrl);
    }

    private static getTokenRequestBody = (code) => {
        const body = {
            code,
            grant_type: config.spike.grantType,
            redirect_uri: config.spike.redirectUri,
        };
        return body;
    };

    static async saveToken(req: Request, res: Response) {
        const body = SpikeController.getTokenRequestBody(String(req.query.code));
        const authHeader = {
            username: config.spike.clientId,
            password: config.spike.clientSecret,
        };
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        const dataObject = await axios.post(config.spike.tokenUrl, body, { auth: authHeader, httpsAgent: agent }).catch((error: AxiosError) => {
            if (error.response) {
                throw new ServiceError(error.response.status, JSON.stringify(error.response.data));
            } else if (error.request) {
                throw new ServiceError(408, 'No response received from spike');
            } else {
                throw new ServiceError(500, error.message);
            }
        });
        const { accessToken } = dataObject.data;

        res.cookie('friends-token', accessToken);
        res.redirect(config.friends.url);
    }
}

export default SpikeController;

import { Request, Response } from 'express';
import axios from 'axios';
import * as https from 'https';
import config from '../../config';
import { getTokenRequestHeaders } from '../../utils/headersHandler';

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

    private static getTokenRequestBody = (code: string) => {
        const body = {
            code,
            grant_type: config.spike.grantType,
            redirect_uri: config.spike.redirectUri,
        };
        return body;
    };

    static async saveToken(req: Request, res: Response) {
        const body = SpikeController.getTokenRequestBody(String(req.query.code));
        const headers = getTokenRequestHeaders();
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        const dataObject = await axios.post(config.spike.tokenUrl, body, { headers, httpsAgent: agent }).catch();
        const { accessToken } = dataObject.data;

        res.cookie('jwt', accessToken);
        res.redirect(config.friends.url);
    }
}

export default SpikeController;

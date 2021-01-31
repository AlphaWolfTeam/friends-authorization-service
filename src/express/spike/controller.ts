import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import * as jwt from 'jsonwebtoken';
import config from '../../config';
import { ServiceError } from '../error';

class SpikeController {
    static async redirectUser(_req: Request, res: Response) {
        const redirectUrl = SpikeController.getRedirectUrl();
        res.redirect(redirectUrl);
    }

    private static getRedirectUrl = () => {
        const params = {
            client_id: config.spike.clientId,
            audience: config.spike.friendsAPIAudienceId,
            scope: config.spike.friendsScope,
            redirect_uri: config.spike.redirectUri,
            response_type: config.spike.responseType,
        };
        const paramsToUrl = Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join('&');
        return `${config.spike.redirectUrl}?${paramsToUrl}`;
    };

    private static getTokenRequestBody = (code) => {
        const body = {
            code,
            grant_type: config.spike.grantType,
            redirect_uri: config.spike.redirectUri,
        };
        return body;
    };

    static async redirectWithToken(req: Request, res: Response) {
        const body = SpikeController.getTokenRequestBody(String(req.query.code));
        const authHeader = {
            username: config.spike.clientId,
            password: config.spike.clientSecret,
        };

        const dataObject = await axios.post(config.spike.tokenUrl, body, { auth: authHeader }).catch((error: AxiosError) => {
            if (error.response) {
                throw new ServiceError(error.response.status, JSON.stringify(error.response.data));
            } else if (error.request) {
                throw new ServiceError(408, 'No response received from spike');
            } else {
                throw new ServiceError(500, error.message);
            }
        });
        const accessToken = dataObject.data.access_token;
        const decodedToken = jwt.decode(accessToken);
        const tokenMaxAgeInMilliseconds = (decodedToken.exp - decodedToken.iat) * 1000;
        res.cookie(config.spike.jwtCookieName, accessToken, { maxAge: tokenMaxAgeInMilliseconds });
        res.redirect(config.friends.url);
    }
}

export default SpikeController;

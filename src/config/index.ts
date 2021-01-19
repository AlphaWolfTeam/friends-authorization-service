import * as env from 'env-var';
import './dotenv';

const config = {
    friends: {
        url: env.get('FRIENDS_BASE_URL').required().asUrlString(),
    },
    server: {
        port: env.get('SERVER_PORT').required().asPortNumber(),
    },
    spike: {
        clientId: env.get('SPIKE_CLIENT_ID').required().asString(),
        clientSecret: env.get('SPIKE_CLIENT_SECRET').required().asString(),
        tokenUrl: env.get('SPIKE_TOKEN_URL').required().asString(),
        redirectUrl: env.get('SPIKE_REDIRECT_TOKEN_URL').required().asString(),
        friendsAPIAudienceId: env.get('FRIENDS_API_AUDIENCE_ID').required().asString(),
        friendsScope: env.get('SPIKE_FRIENDS_SCOPE').required().asString(),
        redirectUri: env.get('SPIKE_REDIRECT_URI').required().asString(),
        grantType: env.get('SPIKE_GRANT_TYPE').required().asString(),
        responseType: env.get('RESPONSE_TYPE').default('code').required().asString(),
        jwtCookieName: env.get('JWT_COOKIE_NAME').default('friends-token').required().asString(),
        isAliveCode: env.get('IS_ALIVE_CODE').default(200).required().asInt(),
        isAliveMessage: env.get('IS_ALIVE_MESSAGE').default('alive').required().asString(),
    },
};

export default config;

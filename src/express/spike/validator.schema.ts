import * as Joi from 'joi';

// GET /api/login
export const login = Joi.object({
    query: {},
    body: {},
    params: {},
});

// GET /api/callback/
export const callback = Joi.object({
    body: {},
    query: {
        code: Joi.string(),
    },
    params: {},
});

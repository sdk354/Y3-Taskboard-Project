import * as service from "../services/authService.js";

export async function register(req, res, next) {
    try {
        const user = await service.register(req.body);
        res.status(201).json({ data: user });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const token = await service.login(req.body);
        res.json({ data: { token } });
    } catch (err) {
        next(err);
    }
}

export async function me(req, res, next) {
    try {
        const user = await service.getCurrentUser(req.user);
        res.json({ data: user });
    } catch (err) {
        next(err);
    }
}

import jwt from 'jsonwebtoken';
import { isValidAuthHeader, tokenFromHeader } from '../utils/auth.mjs';
import { secretKey } from '../constants.mjs';
import { User } from '../db/schemas/user.mjs';
import { Session } from '../db/schemas/session.mjs';

export async function userFromToken(token) {
    let user;

    try {
        const session = await Session.findOne({ token: token });
        if (!session) {
            throw new Error('Session not found.');
        }

        user = await User.findById(session.userId);
        if (!user) {
            throw new Error('User not found.');
        }

        return user;
    } catch (err) {
        console.log(`Failed to get token from user: ${err.message}`);
        return user;
    }
}

export function verifyJwtToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!isValidAuthHeader(authHeader)) {
        return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    const token = tokenFromHeader(authHeader);

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded.user;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid token.' });
    }
}

export const authorizeFor = (requiredRoles) => async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!isValidAuthHeader(authHeader)) {
        return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    const token = tokenFromHeader(authHeader);
    const user = await userFromToken(token);

    if (!user) {
        res.status(500).json({ error: 'No user found with current token!' });
        return;
    }

    const userRoles = user.roles;

    if (!userRoles) {
        res.status(500).json({ error: 'User has no roles!' });
        return;
    }

    const hasAccess = requiredRoles.some((requiredRole) => userRoles.includes(requiredRole));

    if (hasAccess) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied.' });
    }
};

export const authorizeForAdminOnly = authorizeFor(['admin']);
export const authorizeForUser = authorizeFor(['user', 'admin']);

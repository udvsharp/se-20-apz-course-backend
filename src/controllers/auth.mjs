import jwt from 'jsonwebtoken';

import { User } from '../db/schemas/user.mjs';
import { Session } from '../db/schemas/session.mjs';

import { secretKey } from '../constants.mjs';

async function getSessionForUser(user) {
    let token;

    const existingSession = await Session.findOne({ userId: user._id });
    if (!existingSession) {
        token = jwt.sign({ userId: user.id }, secretKey);
    
        const newSession = new Session({ userId: user._id, token });
        await newSession.save();
    } else {
        token = existingSession.token;
    }

    return token;
}

export async function register(req, res) {
    try {
        const { name, username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = new User({ name, username, email, password });
        await user.save();

        const token = await getSessionForUser(user);

        res.status(201).json({ user, token });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = await getSessionForUser(user);

        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ error: `An error occurred: ${err}` });
    }
}

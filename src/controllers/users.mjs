import { secretKey } from '../constants.mjs';
import { User } from '../db/schemas/user.mjs';

import bcrypt from 'bcryptjs';

export async function createAdminUser() {
    try {
        const existingAdminUser = await User.findOne({ roles: 'admin' });
        if (existingAdminUser) {
            console.log('Admin user already exists.');
            return;
        }

        const adminUser = new User({
            name: 'Admin',
            username: 'admin',
            email: 'admin@example.com',
            password: 'testpass',
            roles: ['admin'],
        });

        await adminUser.save();

        console.log('Admin user created successfully.');
    } catch (err) {
        console.error('Failed to create admin user:', err);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve users.' });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, username, email, password, roles } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists.' });
        }
        const user = new User({
            name,
            username,
            email,
            password,
            roles,
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully.', user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user.' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, username, email, password, roles } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.name = name;
        user.username = username;
        user.email = email;
        user.password = password;
        user.roles = roles;

        await user.save();

        res.status(200).json({ message: 'User updated successfully.', user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user.' });
    }
};

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve user.' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndRemove(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};

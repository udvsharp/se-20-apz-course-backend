import { Settings } from '../db/schemas/settings.mjs';

export async function createUserSettings(req, res) {
    try {
        const { user, defaultTemplate } = req.body;

        const settings = new Settings({
            user,
            defaultTemplate,
        });

        await settings.save();

        res.status(201).json({ settings });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user settings' });
    }
}

export async function getUserSettings(req, res) {
    try {
        const userId = req.params.userId;

        const settings = await Settings.findOne({ user: userId });

        if (!settings) {
            return res.status(404).json({ error: 'User settings not found' });
        }

        res.status(200).json({ settings });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve user settings' });
    }
}

export async function updateUserSettings(req, res) {
    try {
        const userId = req.params.userId;
        const { defaultTemplate } = req.body;

        const settings = await Settings.findOneAndUpdate(
            { user: userId },
            { defaultTemplate },
            { new: true }
        );

        if (!settings) {
            return res.status(404).json({ error: 'User settings not found' });
        }

        res.status(200).json({ settings });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user settings' });
    }
}

export async function deleteUserSettings(req, res) {
    try {
        const userId = req.params.userId;
  
        const settings = await Settings.findOneAndDelete({ user: userId });
  
        if (!settings) {
            return res.status(404).json({ error: 'User settings not found' });
        }
  
        res.status(200).json({ message: 'User settings deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user settings' });
    }
}

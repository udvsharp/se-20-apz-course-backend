import { PomodoroTemplate } from '../db/schemas/template.mjs';
import { User } from '../db/schemas/user.mjs';

export async function getAllPomodoroTemplates(req, res) {
    try {
        const userId = req.params.userId;
        const templates = await PomodoroTemplate.find({ user: userId });

        if (!templates || templates.length === 0) {
            return res.status(404).json({ error: 'No pomodoro templates found for the user' });
        }

        res.status(200).json({ templates });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve pomodoro templates' });
    }
}

export async function createPomodoroTemplate(req, res) {
    try {
        const userId = req.params.userId;
        const { name, durationMins } = req.body;

        if (!name || !durationMins) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const template = new PomodoroTemplate({
            user: userId,
            name,
            durationMins,
        });
        await template.save();

        res.status(201).json({ template });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create a new pomodoro template' });
    }
}

export async function updatePomodoroTemplate(req, res) {
    try {
        const { name, durationMins } = req.body;
        const templateId = req.params.templateId;

        if (!name || !durationMins) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const template = await PomodoroTemplate.findById(templateId);
        if (!template) {
            return res.status(404).json({ error: 'Pomodoro template not found' });
        }

        template.name = name;
        template.durationMins = durationMins;
        await template.save();

        res.status(200).json({ template });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update the pomodoro template' });
    }
}

export async function deletePomodoroTemplate(req, res) {
    try {
        const templateId = req.params.templateId;

        const template = await PomodoroTemplate.findByIdAndRemove(templateId);
        if (!template) {
            return res.status(404).json({ error: 'Pomodoro template not found' });
        }

        res.status(200).json({ message: 'Pomodoro template deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete the pomodoro template' });
    }
}

import { Pomodoro } from '../db/schemas/pomodoro.mjs';
import { User } from '../db/schemas/user.mjs';

export async function getAllPomodoros(req, res) {
    try {
        const userId = req.params.userId;
        const pomodoros = await Pomodoro.find({ user: userId });

        if (!pomodoros || pomodoros.length === 0) {
            return res.status(404).json({ error: 'No pomodoros found for the user' });
        }

        res.status(200).json({ pomodoros });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve pomodoros' });
    }
}

export async function getAllPomodorosFiterByValid(req, res, isValid) {
    try {
        const userId = req.params.userId;
        const pomodoros = await Pomodoro.find({ user: userId });

        const filteredPomodoros = pomodoros.filter((pomodoro) => pomodoro.isValid == isValid);
        if (!filteredPomodoros || filteredPomodoros.length === 0) {
            return res.status(404).json({ error: 'No pomodoros found for the user' });
        }

        res.status(200).json({ filteredPomodoros });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve pomodoros' });
    }
}

export async function getAllValidPomodoros(req, res) {
    return await getAllPomodorosFiterByValid(req, res, true);
}

export async function getAllUsedPomodoros(req, res) {
    return await getAllPomodorosFiterByValid(req, res, false);
}

export async function createPomodoro(req, res) {
    try {
        const userId = req.params.userId;
        const { durationMins, task } = req.body;

        if (!durationMins) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const pomodoro = new Pomodoro({
            user: userId,
            task: task,
            durationMins: durationMins,
        });
        await pomodoro.save();

        res.status(201).json({ pomodoro });
    } catch (err) {
        res.status(500).json({ error: `Failed to create a new pomodoro: ${err}` });
    }
}

export async function createPomodoroFromTemplate(req, res) {
    try {
        const { userId, templateId } = req.params;
        const { task } = req.body;

        if (!task) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const pomodoro = await Pomodoro.createFromTemplate(templateId, task);

        res.status(201).json({ pomodoro });
    } catch (err) {
        res.status(500).json({ error: `Failed to create a pomodoro from template: ${err.message}` });
    }
}

export async function updatePomodoro(req, res) {
    try {
        const { durationMins, stopTime } = req.body;
        const pomodoroId = req.params.pomodoroId;

        if (!durationMins) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const pomodoro = await Pomodoro.findById(pomodoroId);
        if (!pomodoro) {
            return res.status(404).json({ error: 'Pomodoro not found' });
        }

        pomodoro.durationMins = durationMins;
        pomodoro.stopTime = stopTime;

        await pomodoro.save();

        res.status(200).json({ pomodoro });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update the pomodoro' });
    }
}

export async function deletePomodoro(req, res) {
    try {
        const pomodoroId = req.params.pomodoroId;

        const pomodoro = await Pomodoro.findByIdAndRemove(pomodoroId);
        if (!pomodoro) {
            return res.status(404).json({ error: 'Pomodoro not found' });
        }

        res.status(200).json({ message: 'Pomodoro deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete the pomodoro' });
    }
}

export async function startPomodoro(req, res) {
    try {
        const pomodoroId = req.params.pomodoroId;

        const pomodoro = await Pomodoro.findById(pomodoroId);
        if (!pomodoro) {
            return res.status(404).json({ error: 'Pomodoro not found' });
        }

        if (pomodoro.startTime) {
            return res.status(400).json({ error: 'Pomodoro has already started' });
        }

        if (pomodoro.startTime) {
            return res.status(423).json({ error: 'Pomodoro already used' });
        }

        pomodoro.startTime = Date.now();
        await pomodoro.save();

        res.status(200).json({ pomodoro });
    } catch (err) {
        res.status(500).json({ error: 'Failed to start the pomodoro' });
    }
}

export async function stopPomodoro(req, res) {
    try {
        const pomodoroId = req.params.pomodoroId;

        const pomodoro = await Pomodoro.findById(pomodoroId);
        if (!pomodoro) {
            return res.status(404).json({ error: 'Pomodoro not found' });
        }

        if (!pomodoro.startTime) {
            return res.status(400).json({ error: 'Pomodoro has not started yet' });
        }

        if (pomodoro.stopTime) {
            return res.status(423).json({ error: 'Pomodoro already used' });
        }

        pomodoro.stopTime = Date.now();
        await pomodoro.save();

        res.status(200).json({ pomodoro });
    } catch (err) {
        res.status(500).json({ error: 'Failed to stop the pomodoro' });
    }
}

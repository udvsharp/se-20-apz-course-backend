import { Pomodoro } from '../db/schemas/pomodoro.mjs';

export async function getWeeklyStatistics(req, res) {
    try {
        const userId = req.params.userId;

        const pomodoros = await Pomodoro.find({
            user: userId,
        });

        if (pomodoros.length === 0) {
            return res.status(404).json({ error: 'No pomodoros found for the user in the last week' });
        }

        let maxSessionDuration = 0;
        let minSessionDuration = Number.MAX_SAFE_INTEGER;
        let totalSessionDuration = 0;
        let stoppedEarlierSessionsCount = 0;

        for (const pomodoro of pomodoros) {
            if (!pomodoro.isValid) {
                continue;
            }

            const sessionDuration = pomodoro.stopTime - pomodoro.startTime;

            if (sessionDuration > maxSessionDuration) {
                maxSessionDuration = sessionDuration;
            }

            if (sessionDuration < minSessionDuration) {
                minSessionDuration = sessionDuration;
            }

            totalSessionDuration += sessionDuration;

            if (pomodoro.finishedEarlier) {
                stoppedEarlierSessionsCount++;
            }
        }

        if (minSessionDuration === Number.MAX_SAFE_INTEGER) {
            minSessionDuration = 0;
        }

        const averageSessionDuration = totalSessionDuration / pomodoros.length;

        res.status(200).json({
            maxSessionDuration,
            minSessionDuration,
            averageSessionDuration,
            totalSessionDuration,
            stoppedEarlierSessionsCount,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate weekly statistics' });
    }
}

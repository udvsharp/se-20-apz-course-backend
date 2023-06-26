import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';

import { dbUri, dbOptions, appPort } from './constants.mjs';
import { verifyJwtToken, authorizeForAdminOnly, authorizeForUser } from './middleware/auth.mjs';
import * as auth from './controllers/auth.mjs';

import * as pomodoro from './controllers/pomodoro.mjs';
import * as templates from './controllers/templates.mjs';
import * as devices from './controllers/device.mjs';
import * as statistics from './controllers/statistics.mjs';
import * as settings from './controllers/settings.mjs';
import * as users from './controllers/users.mjs';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(dbUri, dbOptions)
    .then(() => {
        console.log(`Connected to MongoDB(${dbUri})!`);

        app.listen(appPort, () => {
            users.createAdminUser();
            console.log(`Server is running on port ${appPort}`);
        });
    })
    .catch((err) => {
        console.error(`Failed to connect to MongoDB(${dbUri}):`, err);
    });

// Routers
const authRouter = express.Router();
const pomodoroRouter = express.Router();
const templatesRouter = express.Router();
const statisticsRouter = express.Router();
const devicesRouter = express.Router();
const settingsRouter = express.Router();
const usersRouter = express.Router();

// Endpoints
authRouter.post('/register', auth.register);
authRouter.post('/login', auth.login);

pomodoroRouter.use(verifyJwtToken);
pomodoroRouter.use(authorizeForUser);
pomodoroRouter.get('/:userId', pomodoro.getAllPomodoros);
pomodoroRouter.get('/:userId/valid', pomodoro.getAllValidPomodoros);
pomodoroRouter.get('/:userId/used', pomodoro.getAllUsedPomodoros);
pomodoroRouter.post('/:userId', pomodoro.createPomodoro);
pomodoroRouter.post('/:userId/template/:templateId', pomodoro.createPomodoroFromTemplate);
pomodoroRouter.put('/:pomodoroId', pomodoro.updatePomodoro);
pomodoroRouter.delete('/:pomodoroId', pomodoro.deletePomodoro);
pomodoroRouter.post('/:pomodoroId/start', pomodoro.startPomodoro);
pomodoroRouter.post('/:pomodoroId/stop', pomodoro.stopPomodoro);

templatesRouter.use(verifyJwtToken);
templatesRouter.use(authorizeForUser);
templatesRouter.get('/:userId', templates.getAllPomodoroTemplates);
templatesRouter.post('/:userId', templates.createPomodoroTemplate);
templatesRouter.put('/:templateId', templates.updatePomodoroTemplate);
templatesRouter.delete('/:templateId', templates.deletePomodoroTemplate);

statisticsRouter.use(verifyJwtToken);
statisticsRouter.use(authorizeForUser);
statisticsRouter.get('/report/weekly/:userId', statistics.getWeeklyStatistics);

devicesRouter.use(verifyJwtToken);
devicesRouter.use(authorizeForUser);
devicesRouter.post('/:userId', devices.createDevice);
devicesRouter.get('/:userId', devices.getDevices);
devicesRouter.put('/:userId/devices/:deviceId', devices.updateDevice);
devicesRouter.delete('/:userId/devices/:deviceId', devices.deleteDevice);

settingsRouter.use(verifyJwtToken);
settingsRouter.use(authorizeForUser);
settingsRouter.get('/:userId', settings.getUserSettings);
settingsRouter.get('/:userId', settings.createUserSettings);
settingsRouter.put('/:settingsId', settings.updateUserSettings);
settingsRouter.delete('/:settingsId', settings.deleteUserSettings);

usersRouter.use(verifyJwtToken);
usersRouter.get('/', authorizeForAdminOnly, users.getAllUsers);
usersRouter.get('/:userId', authorizeForUser, users.getUser);
usersRouter.post('/', authorizeForUser, users.createUser);
usersRouter.put('/:userId', authorizeForUser, users.updateUser);
usersRouter.delete('/:userId', authorizeForUser, users.deleteUser);

app.use('/api/auth', authRouter);
app.use('/api/pomodoro', pomodoroRouter);
app.use('/api/pomodoro/templates', templatesRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', usersRouter);

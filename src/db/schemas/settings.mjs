import mongoose from 'mongoose';
import { defaultJSONConvert } from './default-options.mjs';

const settingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    defaultTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PomodoroTemplate',
        required: true,
    },
});

settingsSchema.options.toJSON = defaultJSONConvert;

export const Settings = mongoose.model('Settings', settingsSchema);

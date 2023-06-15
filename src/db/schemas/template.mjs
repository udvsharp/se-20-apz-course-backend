import mongoose from 'mongoose';
import { defaultJSONConvert } from './default-options.mjs';

const pomodoroTemplateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    durationMins: {
        type: Number,
        required: true,
        min: 5,
        max: 60 * 8,
    },
});

pomodoroTemplateSchema.options.toJSON = defaultJSONConvert;

export const PomodoroTemplate = mongoose.model('PomodoroTemplate', pomodoroTemplateSchema);

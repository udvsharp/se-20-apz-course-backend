import mongoose from 'mongoose';
import { PomodoroTemplate } from './template.mjs';
import { defaultJSONConvert } from './default-options.mjs';

const pomodoroSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    durationMins: {
        type: Number,
        required: true,
        min: 5,
        max: 60 * 8,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    startTime: {
        type: Date,
    },
    stopTime: {
        type: Date,
    },
}, {
    statics: {
        createFromTemplate(templateId, task) {
            return PomodoroTemplate.findById(templateId)
                .then((template) => {
                    if (!template) {
                        throw new Error('Invalid template ID');
                    }

                    const pomodoro = new this({
                        task: task,
                        duration: template.durationMins,
                        user: template.user,
                    });

                    return pomodoro.save();
                });
        }
    }
});

pomodoroSchema.virtual('timeLeftMins').get(function () {
    const diffMs = this.stopTime - this.startTime;
    const diffMins = diffMs * 60_000;

    return diffMins;
});

pomodoroSchema.virtual('finishedEarlier').get(function () {
    return this.timeLeftMins === 0;
});

pomodoroSchema.virtual('isValid').get(function () {
    if (this.stopTime === undefined) {
        return true;
    }
    return false;
});

pomodoroSchema.options.toJSON = defaultJSONConvert;

export const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);

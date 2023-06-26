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
        createFromTemplate(templateId) {
            return PomodoroTemplate.findById(templateId).then((template) => {
                if (!template) {
                    throw new Error('Invalid template ID');
                }

                const pomodoro = new this({
                    task: template.name,
                    durationMins: template.durationMins,
                    user: template.user,
                });

                return pomodoro.save();
            });
        }
    }
});

pomodoroSchema.virtual('timeLeftMins').get(function () {
    const diffMs = this.durationMins - (this.stopTime - this.startTime) / 60000;
    const diffMins = diffMs;

    return diffMins;
});

pomodoroSchema.virtual('finishedEarlier').get(function () {
    return this.timeLeftMins > 1;
});

pomodoroSchema.virtual('isValid').get(function () {
    if (this.stopTime === undefined) {
        return true;
    }
    return false;
});

pomodoroSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        
        ret.timeLeftMins = doc.timeLeftMins;
        ret.finishedEarlier = doc.finishedEarlier;
        ret.isValid = doc.isValid;
        return ret;
    },
};

export const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);

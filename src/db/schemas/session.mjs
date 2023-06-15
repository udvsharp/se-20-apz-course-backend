import mongoose from 'mongoose';
import { defaultJSONConvert } from './default-options.mjs';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1 * 24 * 60 * 60,
    },
});

sessionSchema.options.toJSON = defaultJSONConvert;

export const Session = mongoose.model('Session', sessionSchema);

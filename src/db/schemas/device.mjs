import mongoose from 'mongoose';
import { defaultJSONConvert } from './default-options.mjs';

const deviceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    physicalId: {
        type: String,
        required: true,
    }
});

deviceSchema.options.toJSON = defaultJSONConvert;

export const Device = mongoose.model('Device', deviceSchema);

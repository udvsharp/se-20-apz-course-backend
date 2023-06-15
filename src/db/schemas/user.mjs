import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { defaultJSONConvert } from './default-options.mjs';

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    roles: {
        type: [String],
        required: true,
        default: ['user'],
    },
}, {
    methods: {
        async comparePassword(password) {
            try {
                return await bcrypt.compare(password, this.password);
            } catch (err) {
                throw new Error(err);
            }
        }
    }
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            this.password = hash;
            next();
        });
    });
});

userSchema.options.toJSON = defaultJSONConvert;

export const User = mongoose.model('User', userSchema);
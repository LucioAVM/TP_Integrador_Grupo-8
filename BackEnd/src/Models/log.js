import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    message: { type: String, required: true },
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Log', logSchema);
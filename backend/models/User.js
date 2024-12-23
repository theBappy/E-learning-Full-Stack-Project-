const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
    },
    role: {
        type: String,
        enum: ['student', 'instructor'],
        default: 'student',
    },
});

UserSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = mongoose.model('User', UserSchema);
module.exports = User;

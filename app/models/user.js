const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
              validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
              },
              message: 'Invalid email address format',
            },
        },
        password: { // this is the hashed password
            type: String,
            required: [true, 'password is required'],
        },
    },
    {timestamps: true}
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
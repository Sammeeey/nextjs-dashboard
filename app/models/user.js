const mongoose = require('mongoose');
// import Comment from "@/models/comment";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        // comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    },
    {timestamps: true}
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
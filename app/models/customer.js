const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        image_url: {
            type: String,
            required: true,
        },
        // comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    },
    {timestamps: true}
);

module.exports = mongoose.models.Customer || mongoose.model('Customer', customerSchema)
const mongoose = require('mongoose');
// import Comment from "@/models/comment";

const { Schema } = mongoose;

const invoicesSchema = new Schema(
    {
        customer: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        // comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    },
    {timestamps: true}
);

module.exports = mongoose.models.Invoices || mongoose.model('Invoices', invoicesSchema)
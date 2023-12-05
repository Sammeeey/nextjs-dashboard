const mongoose = require('mongoose');
// import Comment from "@/models/comment";

const { Schema } = mongoose;

const invoicesSchema = new Schema(
    {
        customer_id: {
            type: String,
            required: [true, 'customer ID is required'],
        },
        amount: {
            type: Number,
            required: [true, 'amount is required'],
        },
        status: {
            type: String,
            required: [true, 'invoice status is required'],
        },
        date: {
            type: String,
            required: [true, 'invoice date is required'],
        },
        // comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    },
    {timestamps: true}
);

invoicesSchema.index({'$**': 'text'})

module.exports = mongoose.models.Invoices || mongoose.model('Invoices', invoicesSchema)
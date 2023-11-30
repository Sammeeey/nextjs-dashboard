import mongoose from "mongoose";
// import Comment from "@/models/comment";

const { Schema } = mongoose;

const revenueSchema = new Schema(
    {
        month: {
            type: String,
            required: true,
        },
        revenue: {
            type: Number,
            required: true,
        },
        // comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    },
    {timestamps: true}
);

export default mongoose.models.Revenue || mongoose.model('Revenue', revenueSchema)
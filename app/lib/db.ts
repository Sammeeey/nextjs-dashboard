import mongoose from "mongoose";

const connect = async () => {
    if(mongoose.connections[0].readyState) {
        console.log('Mongoose already connected')
        return
    };

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Mongoose connected')
    } catch (error) {
        console.error('error:', error)
    }
}

export default connect;
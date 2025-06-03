import mongoose from "mongoose"

export const connectDB = async() =>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected ${connection.host}`)    
        // console.log("MONGO_URI from env:", process.env.MONGO_URI);
    } catch (error) {
        console.log("Error connecting Database ",error)
        process.exit(1) //exit with failure
    }
}
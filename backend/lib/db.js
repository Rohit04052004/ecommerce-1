import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		// Don't process.exit() here: in a serverless function that would kill
		// the whole runtime instead of just failing the current request.
		console.log("Error connecting to MONGODB", error.message);
	}
};

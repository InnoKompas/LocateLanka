import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import { connectDb } from './lib/db';
import { connectDB } from './config/mongodb';

dotenv.config();
const PORT = process.env["PORT"] || 3000;

async function startServer() {
	// Connect custom db utility for API key middleware and routes
	await connectDb(process.env["MONGO_URI"] || 'mongodb://localhost:27017/locatelanka', process.env["DB_NAME"] || 'locatelanka');

	// Connect mongoose for user/auth models
	await connectDB();

	const server = http.createServer(app);
	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

startServer();

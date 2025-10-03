import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import chatRoutes from './routes/chatRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './lib/db.js';



dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
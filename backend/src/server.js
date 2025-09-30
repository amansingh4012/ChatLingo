import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';

import connectDB from './lib/db.js';



dotenv.config();

const PORT = process.env.PORT;

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
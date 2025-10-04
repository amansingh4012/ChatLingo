import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import chatRoutes from './routes/chatRoute.js';
import globalChatRoutes from './routes/globalChatRoute.js';
import languageChatRoutes from './routes/languageChatRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import connectDB from './lib/db.js';
import { app, server } from './lib/socket.js';



dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/global-chat', globalChatRoutes);
app.use('/api/language-chat', languageChatRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}





server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
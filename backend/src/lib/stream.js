import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("stream api key or secret not found");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.error("Error upserting stream user:", error);
        throw error;
    }

}


export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        const token = streamClient.createToken(userIdStr);
        return token;
        
    } catch (error) {
        console.error("Error generating stream token:", error);
        throw error;
    }

};

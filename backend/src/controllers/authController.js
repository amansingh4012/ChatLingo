import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
         if(!fullName || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    if(password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({ message: "Email already in use" });
    }

    const idx = Math.floor(Math.random()*100 + 1);
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
        fullName,
        email,
        password,
        profilePic: randomAvatar
    });

    try {
        await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || ""
        })
        console.log("Stream user upserted successfully");
    } catch (error) {
        console.error("Error upserting stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite : "strict",
        secure : process.env.NODE_ENV === 'production'
    })
    res.status(201).json({
        message: "User created successfully",
        user: newUser,
        success: true
    });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

const login = async (req, res) => {

    const {email,password} = req.body;

   try {
    if(!email || !password){
        return res.status(400).json({ message: "Please provide all required fields" });
    }

   const user  = await User.findOne({email});
    if(!user){
        return res.status(401).json({ message: "user not found" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if(!isPasswordCorrect){
        return res.status(401).json({ message: "wrong password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite : "strict",
        secure : process.env.NODE_ENV === 'production'
    })

    res.status(200).json({
        message: "Login successful",
        user,
        success: true
    });

    
   } catch (error) {
       console.error("Error logging in user:", error);
       res.status(500).json({ message: "Internal server error" });
   }
}

const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({
         message: "Logout successful",
          success: true 
        });
}

const onboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                 message: "Please provide all required fields",
                 missingFields: [
                     !fullName && "fullName",
                     !bio && "bio",
                     !nativeLanguage && "nativeLanguage",
                     !learningLanguage && "learningLanguage",
                     !location && "location"
                 ].filter(Boolean)
                 });
        }

        const updateUser  =await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded : true
        }, {new : true});

        if(!updateUser){
            return res.status(500).json({ message: "Error updating user" });
        }

        try {
            await upsertStreamUser({
                id: updateUser._id.toString(),
                name: updateUser.fullName,
                image: updateUser.profilePic || ""
            });
            console.log(`stream user ${updateUser.fullName} upserted successfully after onboarding`);

        } catch (streamError) {
            console.error("Error upserting stream user:", streamError.message);
        }

        res.status(200).json({
            message: "Onboarding successful",
            user: updateUser,
            success: true
        });
    } catch (error) {
        console.error("Error during onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

export { signup, login, logout , onboard };
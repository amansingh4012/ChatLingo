import User from '../models/userModel.js';

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: {$ne: currentUser}},
                { _id: { $nin: currentUser.friends }},
                { isOnboarded: true },
            ],
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("error in getRecommendedUsers controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        .select('friends')
        .populate('friends', "fullName profilePic bio location learningLanguage nativeLanguage");

        res.status(200).json(user.friends);
        
    } catch (error) {
        console.error("error in getMyFriends controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
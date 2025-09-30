import User from '../models/userModel.js';
import FriendRequest from '../models/friendRequestModel.js';

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

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const {id : recipientId} = req.params;

        if(myId === recipientId){
            return res.status(400).json({ message: "You cannot send friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message: "Recipient user not found" });
        }

        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or : [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });
        if(existingRequest){
            return res.status(400)
            .json({ message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId  
        }); 
        res.status(200).json({ message: "Friend request sent successfully", friendRequest });



        
    } catch (error) {
        console.error("error in sendFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
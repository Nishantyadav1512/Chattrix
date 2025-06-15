import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in getUserForSidebar:", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
};

export const getMessages = async (req, res) => {
    try {
        const{id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload the image to your storage service and get the URL
            // For example, if using Cloudinary:
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; // Assuming the response contains the URL
            
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        // todo: realtime functionallity goes here => socket.io
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
};
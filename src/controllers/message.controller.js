import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params.id;
    const sendId = req.user._id;
    if (!message)
      res.status(401).json({ message: "Please provider the message" });

    let conversation = await Conversation.findOne({
      participants: { $all: [sendId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sendId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId: sendId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error sending message", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
    try {
        const receiverId = req.params.id
        const senderId = req.user._id
        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        }).populate("messages")

        res.status(200).json(conversation.messages)
        
    } catch (error) {
        console.log("Error Get message", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

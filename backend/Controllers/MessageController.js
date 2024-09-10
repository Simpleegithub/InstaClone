// For Chating

import Conversation from "../Models/ConversationModel.js";
import Message from "../Models/MessageModel.js";
import {getReceiverSocketId, io} from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    let converstation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!converstation) {
      converstation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({ senderId, receiverId, message });

    if (newMessage) {
      converstation.messages.push(newMessage._id);
    }
    await Promise.all([converstation.save(), newMessage.save()]);

    // Implement socket io for real Time Data
    const receiverSocketId=getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",{message:newMessage})
    }

    return res.status(200).json({
      message: "Message sent",
      newMessage: newMessage,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


// Get Message


export const getMessage = async (req, res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages")

   

        return res.status(200).json({
            messages:conversation?.messages,
            success:true
        })

    } catch(error){
      console.log(error);

    }


}
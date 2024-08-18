import { Conversation } from "../../model/Conversion/Conversation.model.js";
import { Message } from "../../model/message/message.model.js";
import sendResponse from "../../utils/sendResponse.js";

export const sentMessage = async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId=req.body.receiverId;
        const {message}=req.body;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });
        if(!conversation){
            const newConversation = new Conversation({
                participants:[senderId,receiverId],
                messages:[
                    {
                        sender:senderId,
                        receiver:receiverId,
                        message:message
                        }
                        ]
                        });
        }
        const newMessage = new Message.create({
            sender:senderId,
                        receiver:receiverId,
                        message:message
        });
        if(newMessage){
            conversation.messages.push(newMessage._id);
            await Promise.all([newMessage.save(),conversation.save()])
        }
        return sendResponse(res,201,newMessage,true)
    } catch (error) {
        
    }
}

const getMessage = async(req,res)=>{
    const senderId = req.id;
    const receiverId = req.body.receiverId;
    const conversation = await Conversation.find({
        participants:{$all:[senderId,receiverId]}
    })
    if(!conversation){
        return res.status(200).json({sucess:true,messages:[]})
    }
    return res.status(200).json({success:true,messages:conversation?.messages})
}
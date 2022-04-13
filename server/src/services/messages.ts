import messageModel from "../models/messages.models";

interface MessageRequest {
  from: string;
  to: string;
  message: string
}

interface MessageResponse {
  success: boolean;
  code: number,
  message: string
}

interface ListMessages {
  from: string;
  to: string;
}


interface ListMessagesResponse {
  success: boolean;
  code: number;
  message?: string;
  data?: Array<any>;
}


async function create(messageRequest:MessageRequest): Promise<MessageResponse> {
  try {
    const message = new messageModel({
      sender: messageRequest.from,
      users: [messageRequest.from, messageRequest.to],
      message: { text: messageRequest.message}
    });
    await message.save();
    return { success: true, code: 200, message: 'message sent successfully' }
  } catch (error) {
    return { success: false, code: 500, message:'internal server error'}
  }
}


async function list(message: ListMessages): Promise<ListMessagesResponse> {
  try {
    const messages = await messageModel.find({
      users: { $all: [message.from, message.to] }
    }).sort({ updatedAt: 1 });
    const projectedMsg = messages.map(msg => {
      return {
        fromSelf: msg.sender.toString() === message.from,
        message: msg.message.text,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt
      };
    });
    return { success: true, code: 200, data: projectedMsg }
  } catch (error) {
    return { success: false, code: 500, message:'internal server error'}
  }
}


export const messages = {
  create,
  list
}
import userModel from "../models/users.models"


interface AvatarRequest {
  base64EncodedImage: string;
  userId: string;
}

interface AvatarResponse {
  success: boolean;
  code: number;
  message: string;
}

interface UserObject {
  _id: string;
  email: string;
  username: string;
  avatarImage: string
}

interface UsersResponse {
  success: boolean;
  code: number;
  message?: string;
  data?: Array<UserObject>
}

async function setAvatar(avatarRequest: AvatarRequest): Promise<AvatarResponse> {
  try {
    const user = await userModel.findOneAndUpdate({_id: avatarRequest.userId}, { isAvatarImageSet: true, avatarImage: avatarRequest.base64EncodedImage });

    return { success: true, code: 200, message: "avatar image set successfully" }
  } catch (error) {
    console.log(error);
    return { success: false, code: 500, message:'internal server error'}
  }
}


async function getUsers(userId: string): Promise<UsersResponse> {
  try {
    const users = await userModel.find({ _id: { $ne: userId } }).select([
      "_id",
      "username",
      "avatarImage",
      "email"
    ]);
    return { success: true, code: 200, data: users }
  } catch (error) {
    console.log(error);
    return { success: false, code: 500, message:'internal server error'}
  }
}


export const user = {
  setAvatar,
  getUsers
}
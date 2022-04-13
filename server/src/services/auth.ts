import User from "../models/users.models";

interface UserRequest {
  username: string,
  email: string,
  password: string
}

interface RegisterResponse {
  success: boolean,
  code: number,
  message: string
}

interface LoginRequest {
  emailOrUsername: string;
  password: string
}

interface LoginResponse {
  success: boolean;
  code: number;
  message?: string,
  data?: any
}


async function register(userRequest: UserRequest): Promise<RegisterResponse> {
  try {
    const usernameExist = await User.findOne({ username: userRequest.username });
    if (usernameExist) {
      return { success: false, code: 400, message: "username already taken" }
    }
    const emailExist = await User.findOne({email: userRequest.email});
    if (emailExist) {
      return { success: false, code: 400, message: "email already exist" }
    }
    const user = new User({
      username: userRequest.username,
      email: userRequest.email,
      password: userRequest.password
    })
    await user.save();
    return { success: true, code: 200, message: "user registered successfully" }
  } catch (error) {
    console.log(error)
    return { success: false, code: 500, message:'internal server error'}
  }
}


async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
  try {
    const userWithUsername = await User.findOne({ username: loginRequest.emailOrUsername });
    console.log(userWithUsername)
    const userWithEmail = await User.findOne({ email: loginRequest.emailOrUsername });
    if (userWithUsername) {
      const isMatch = await userWithUsername.comparePass(loginRequest.password);
      if (isMatch) {
        const jwt = await userWithUsername.getJWT();
        delete userWithUsername._doc.password;
        return {success: true, code: 200, data: {...userWithUsername._doc, accessToken: jwt}}
      } else {
        return { success: false, code: 403, message:'invalid credentials'}
      }
    } else if (userWithEmail) {
      const isMatch = await userWithEmail.comparePass(loginRequest.password);
      if (isMatch) {
        const jwt = await userWithEmail.getJWT();
        delete userWithEmail.password;
        return {success: true, code: 200, data: {...userWithEmail._doc, accessToken: jwt}}
      } else {
        return { success: false, code: 403, message:'invalid credentials'}
      }
    } else {
      return { success: false, code: 404, message:'invalid credentials'}
    }

  } catch (error) {
    console.log(error);
    return { success: false, code: 500, message:'internal server error'}
  }
}


export const auth = {
  register,
  login
}
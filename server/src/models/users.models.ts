import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ]
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false
  },
  avatarImage: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});



// encrypt password
UserSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const signOptions: SignOptions = {
  expiresIn: process.env.JWT_EXPIRES
}

// sign JWT and return
UserSchema.methods.getJWT = function() {
  const jwtsecret: string = process.env.JWT_SECRET || "";
  const payload = {
    id: this._id,
    email: this.email,
    iat: Date.now(),
  }
  console.log(signOptions, jwtsecret)
  return jwt.sign(payload, jwtsecret, signOptions);
}

//  verify password during login
UserSchema.methods.comparePass = async function(password: string){
  return await bcrypt.compare(password, this.password);
}


const userModel = mongoose.model("users", UserSchema);
export default userModel;
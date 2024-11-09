import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
 _id: string;
  username: string;
  password: string;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema); 
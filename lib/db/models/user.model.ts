import { IUserInput } from '@/types';
import { Document, Model, model, models, Schema } from 'mongoose';

export interface IUser extends Document, IUserInput {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, required: true, default: 'user' },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const User = (models.User as Model<IUser>) || model('User', userSchema);
export default User;

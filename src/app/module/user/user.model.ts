import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpstatus from 'http-status';
import { userRole } from './user.const';
export const userSchema = new Schema<TUser>({
  name: { type: String, required: [true, 'User name is required'] },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
  },
  password: { type: String, required: [true, 'User password is required'] },
  phone: { type: String, required: [true, 'User mobile is required'] },
  role: {
    type: String,
    enum: userRole,
    required: [true, 'User role is required'],
  },
  address: { type: String, required: [true, 'User address is required'] },
});

userSchema.pre('save', async function (next) {
  const isUserExist = await User.findOne({ email: this.email });
  if (isUserExist) {
    throw new AppError(httpstatus.CONFLICT, 'User already exist');
  }
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

userSchema.post('save', async function (data) {
  data.password = '';
});
export const User = model<TUser>('User', userSchema);

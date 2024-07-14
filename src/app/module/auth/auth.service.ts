import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import config from '../../config';
import { TUserLogin } from './auth.interface';

const createUserIntoDB = async (userData: TUser) => {
  const result = await User.create(userData);
  return result;
};

const userLogin = async (info: TUserLogin) => {
  //check if user exist
  const user = await User.findOne({ email: info.email }).select(['-__v']);
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User not found! Please Check your email.',
    );
  }
  //check password is matched with database password 
  const isPasswordMatch = await bcrypt.compare(
    info.password,
    user.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Password did not matched! Please check again.',
    );
  }

  //creating user data to include in token
  const userjwt = {
    id: user._id,
    email: user.email,
    role: user.role
    
  };

  // create token
  const accessToken = createToken(
    userjwt,
    config.jwt_secret_key as string,
    config.jwt_expires_key as string,
  );

  return {
    accessToken: accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  };
};

export const AuthService = {
  createUserIntoDB,
  userLogin,
};

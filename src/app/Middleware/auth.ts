import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../module/user/user.interface';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../module/user/user.model';

export const auth = (...userRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tokenData = req.headers.authorization;
    const token = tokenData?.split(' ')[1];
    

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
      );
    }



    const decoded = jwt.verify(
      token,
      config.jwt_secret_key as string,
    ) as JwtPayload;

    const { role, email } = decoded;

    const user = await User.findOne({ email: email });
    //check user exist or not
    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'You have no access to this route',
        '',
      );
    }

    if (userRole && !userRole.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
        '',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

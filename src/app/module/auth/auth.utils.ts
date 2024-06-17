import jwt from 'jsonwebtoken';
export const createToken = (
  jwtPayload: { email: string; role: string },
  secretKey: string,
  expDate: string,
) => {
  return jwt.sign(jwtPayload, secretKey, {
    expiresIn: expDate,
  });
};

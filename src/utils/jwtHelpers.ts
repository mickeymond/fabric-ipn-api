import {
  sign,
  verify
} from 'jsonwebtoken';

export const generateToken = (enrollmentId: string, secret: string) => {
  return sign({ enrollmentId }, secret, { expiresIn: 86400 });
}

export const verifyToken = (token: string, secret: string) => {
  return verify(token, secret);
}
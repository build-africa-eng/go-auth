import jwt from 'jsonwebtoken';

export class TokenService {
  constructor(secret) {
    this.secret = secret;
  }

  generateAccessToken(userID) {
    return jwt.sign({ sub: userID }, this.secret, { expiresIn: '1h' });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  generateRefreshToken() {
    return crypto.randomUUID();
  }
}
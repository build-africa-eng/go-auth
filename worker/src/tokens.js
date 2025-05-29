import jwt from 'jsonwebtoken';

export class TokenService {
  constructor(secret) {
    if (!secret) throw new Error('JWT secret is undefined');
    this.secret = secret;
  }

  generateAccessToken(userID) {
    if (!userID) throw new Error('User ID is required');
    return jwt.sign({ sub: userID }, this.secret, { expiresIn: '1h' });
  }

  async verifyToken(token) {
    try {
      return await Promise.resolve(jwt.verify(token, this.secret));
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  async generateRefreshToken() {
    return await Promise.resolve(crypto.randomUUID());
  }
}
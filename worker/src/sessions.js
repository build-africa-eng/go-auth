export class SessionService {
  constructor(kv) {
    if (!kv) throw new Error('KV namespace binding is undefined');
    this.kv = kv;
  }

  async saveRefreshToken(userID, refreshToken) {
    try {
      await this.kv.put(`refresh:${userID}`, refreshToken, { expirationTtl: 604800 });
    } catch (error) {
      throw new Error(`Save refresh token failed: ${error.message}`);
    }
  }

  async getRefreshToken(userID) {
    try {
      return await this.kv.get(`refresh:${userID}`);
    } catch (error) {
      throw new Error(`Get refresh token failed: ${error.message}`);
    }
  }

  async revokeRefreshToken(userID) {
    try {
      await this.kv.delete(`refresh:${userID}`);
    } catch (error) {
      throw new Error(`Revoke refresh token failed: ${error.message}`);
    }
  }
}
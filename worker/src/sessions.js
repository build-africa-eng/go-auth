export class SessionService {
  constructor(kv) {
    this.kv = kv;
  }

  async saveRefreshToken(userID, refreshToken) {
    await this.kv.put(`refresh:${userID}`, refreshToken, { expirationTtl: 604800 }); // 7 days
  }

  async getRefreshToken(userID) {
    return await this.kv.get(`refresh:${userID}`);
  }

  async revokeRefreshToken(userID) {
    await this.kv.delete(`refresh:${userID}`);
  }
}
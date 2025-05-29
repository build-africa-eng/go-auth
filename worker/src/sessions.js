export class SessionService {
  constructor(kv) {
    if (!kv) throw new Error('KV namespace binding is undefined');
    this.kv = kv;
  }

  async saveRefreshToken(userID, refreshToken) {
    console.log(`SessionService.saveRefreshToken start: ${userID}, ${new Date().toISOString()}`);
    try {
      await Promise.race([
        this.kv.put(`refresh:${userID}`, refreshToken, { expirationTtl: 604800 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('KV put timeout')), 1000)),
      ]);
    } catch (error) {
      throw new Error(`Save refresh token failed: ${error.message}`);
    }
  }

  async getRefreshToken(userID) {
    console.log(`SessionService.getRefreshToken start: ${userID}, ${new Date().toISOString()}`);
    try {
      return await Promise.race([
        this.kv.get(`refresh:${userID}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('KV get timeout')), 1000)),
      ]);
    } catch (error) {
      throw new Error(`Get refresh token failed: ${error.message}`);
    }
  }

  async revokeRefreshToken(userID) {
    console.log(`SessionService.revokeRefreshToken start: ${userID}, ${new Date().toISOString()}`);
    try {
      await Promise.race([
        this.kv.delete(`refresh:${userID}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('KV delete timeout')), 1000)),
      ]);
    } catch (error) {
      throw new Error(`Revoke refresh token failed: ${error.message}`);
    }
  }
}
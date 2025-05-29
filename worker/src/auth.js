import bcrypt from 'bcryptjs';

export class AuthService {
  constructor(users, tokens, sessions) {
    if (!users || !tokens || !sessions) throw new Error('Service dependencies are undefined');
    this.users = users;
    this.tokens = tokens;
    this.sessions = sessions;
  }

  async login(email, password) {
    const user = await this.users.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const accessToken = this.tokens.generateAccessToken(user.id);
    const refreshToken = await this.tokens.generateRefreshToken();
    await this.sessions.saveRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async refresh(userID, refreshToken) {
    const storedToken = await this.sessions.getRefreshToken(userID);
    if (storedToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }
    return this.tokens.generateAccessToken(userID);
  }
}
import bcrypt from 'bcryptjs';

export class UserService {
  constructor(db) {
    this.db = db;
  }

  async register(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await this.db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
        .bind(email, hashedPassword)
        .run();
      return { success: true };
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  }

  async findByEmail(email) {
    return await this.db.prepare('SELECT id, email, password FROM users WHERE email = ?')
      .bind(email)
      .first();
  }
}
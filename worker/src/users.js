import bcrypt from 'bcryptjs';

export class UserService {
  constructor(db) {
    if (!db) throw new Error('D1 database binding is undefined');
    this.db = db;
  }

  async register(email, password) {
    if (!email || !password) throw new Error('Missing email or password');
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await this.db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
        .bind(email, hashedPassword)
        .run();
      return { success: true, message: 'User registered' };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await this.db.prepare('SELECT id, email, password FROM users WHERE email = ?')
        .bind(email)
        .first();
    } catch (error) {
      throw new Error(`Find user failed: ${error.message}`);
    }
  }
}
import bcrypt from 'bcryptjs';

export class UserService {
  constructor(db) {
    if (!db) throw new Error('D1 database binding is undefined');
    this.db = db;
  }

  async register(email, password) {
    console.log(`UserService.register start: ${email}, ${new Date().toISOString()}`);
    if (!email || !password) throw new Error('Missing email or password');
    const start = Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Password hashing took ${Date.now() - start}ms`);
    try {
      const query = this.db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
        .bind(email, hashedPassword);
      await Promise.race([
        query.run(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('D1 query timeout')), 1000)),
      ]);
      return { success: true, message: 'User registered' };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async findByEmail(email) {
    console.log(`UserService.findByEmail start: ${email}, ${new Date().toISOString()}`);
    try {
      const query = this.db.prepare('SELECT id, email, password FROM users WHERE email = ?')
        .bind(email);
      return await Promise.race([
        query.first(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('D1 query timeout')), 1000)),
      ]);
    } catch (error) {
      throw new Error(`Find user failed: ${error.message}`);
    }
  }
}
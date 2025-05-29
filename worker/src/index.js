import { AutoRouter } from 'itty-router';
import { config } from './config.js';
import { UserService } from './users.js';
import { TokenService } from './tokens.js';
import { SessionService } from './sessions.js';
import { AuthService } from './auth.js';
import { register } from './handlers/register.js';
import { login } from './handlers/login.js';
import { refresh } from './handlers/refresh.js';

const router = AutoRouter();

// Preflight OPTIONS
router.options('*', () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '[invalid url, do not cite],
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
});

// Routes
router.post('/register', async (request, env) => {
  const userService = new UserService(env.DB);
  return await register(request, userService);
});

router.post('/login', async (request, env) => {
  const userService = new UserService(env.DB);
  const tokenService = new TokenService(config.jwtSecret);
  const sessionService = new SessionService(env.KV);
  const authService = new AuthService(userService, tokenService, sessionService);
  return await login(request, authService);
});

router.post('/refresh-token', async (request, env) => {
  const tokenService = new TokenService(config.jwtSecret);
  const sessionService = new SessionService(env.KV);
  const authService = new AuthService(null, tokenService, sessionService);
  return await refresh(request, authService, tokenService);
});

// Catch-all route
router.all('*', () => new Response(JSON.stringify({ error: 'Not found' }), { status: 404 }));

export default {
  fetch: router.handle,
};
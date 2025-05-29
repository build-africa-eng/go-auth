import { Router } from '@cloudflare/itty-router';
import { config } from './config.js';
import { UserService } from './users.js';
import { TokenService } from './tokens.js';
import { SessionService } from './sessions.js';
import { AuthService } from './auth.js';
import { register } from './handlers/register.js';
import { login } from './handlers/login.js';
import { refresh } from './handlers/refresh.js';

const router = Router();

// Add CORS headers to all responses
router.all('*', (request, response) => {
  response.headers.set('Access-Control-Allow-Origin', '[invalid url, do not cite]);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
});

// Handle preflight OPTIONS requests
router.options('*', () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '[invalid url, do not cite],
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
});

router.post('/register', async (request, env) => {
  const userService = new UserService(env.DB);
  return register(request, userService);
});

router.post('/login', async (request, env) => {
  const userService = new UserService(env.DB);
  const tokenService = new TokenService(config.jwtSecret);
  const sessionService = new SessionService(env.KV);
  const authService = new AuthService(userService, tokenService, sessionService);
  return login(request, authService);
});

router.post('/refresh-token', async (request, env) => {
  const tokenService = new TokenService(config.jwtSecret);
  const sessionService = new SessionService(env.KV);
  const authService = new AuthService(null, tokenService, sessionService);
  return refresh(request, authService, tokenService);
});

router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
});

export default {
  fetch: router.handle,
};
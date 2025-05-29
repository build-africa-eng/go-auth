import { Router } from 'itty-router';
import { config } from './config.js';
import { UserService } from './users.js';
import { TokenService } from './tokens.js';
import { SessionService } from './sessions.js';
import { AuthService } from './auth.js';
import { register } from './handlers/register.js';
import { login } from './handlers/login.js';
import { refresh } from './handlers/refresh.js';

const router = Router();

// Timeout wrapper
const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), ms)
  );
  return Promise.race([promise, timeout]);
};

// Global error handler
async function handleError(request, env, ctx, error) {
  console.error('Uncaught error:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  });
  return new Response(JSON.stringify({ error: 'Internal server error', message: error.message }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
    },
  });
}

// Preflight OPTIONS (bypass middleware)
router.options('*', () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
});

// CORS middleware (skip for OPTIONS)
router.all('*', async (request, env, ctx) => {
  if (request.method === 'OPTIONS') {
    return ctx.next(); // Skip for OPTIONS to avoid middleware overhead
  }
  try {
    const response = await withTimeout(ctx.next(), 3000); // Reduced to 3s
    response.headers.set('Access-Control-Allow-Origin', 'https://go-auth.pages.dev');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error) {
    return await handleError(request, env, ctx, error);
  }
});

router.post('/register', async (request, env) => {
  try {
    console.log('Register request:', { url: request.url, timestamp: new Date().toISOString() });
    const userService = new UserService(env.DB);
    return await withTimeout(register(request, userService), 3000);
  } catch (error) {
    return await handleError(request, env, {}, error);
  }
});

router.post('/login', async (request, env) => {
  try {
    console.log('Login request:', { url: request.url, timestamp: new Date().toISOString() });
    const userService = new UserService(env.DB);
    const tokenService = new TokenService(config.jwtSecret);
    const sessionService = new SessionService(env.KV);
    const authService = new AuthService(userService, tokenService, sessionService);
    return await withTimeout(login(request, authService), 3000);
  } catch (error) {
    return await handleError(request, env, {}, error);
  }
});

router.post('/refresh-token', async (request, env) => {
  try {
    console.log('Refresh token request:', { url: request.url, timestamp: new Date().toISOString() });
    const tokenService = new TokenService(config.jwtSecret);
    const sessionService = new SessionService(env.KV);
    const authService = new AuthService(null, tokenService, sessionService);
    return await withTimeout(refresh(request, authService, tokenService), 3000);
  } catch (error) {
    return await handleError(request, env, {}, error);
  }
});

// Catch-all route
router.all('*', async (request) => {
  console.log('Catch-all route hit:', { url: request.url, method: request.method, timestamp: new Date().toISOString() });
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
    },
  });
});

export default {
  fetch: async (request, env, ctx) => {
    try {
      console.log('Fetch request:', { url: request.url, method: request.method, timestamp: new Date().toISOString() });
      return await withTimeout(router.handle(request, env, ctx), 3000);
    } catch (error) {
      return await handleError(request, env, ctx, error);
    }
  },
};
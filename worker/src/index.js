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

// Global error handler
async function handleError(request, env, ctx, error) {
  console.error('Uncaught error:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });
  return new Response(JSON.stringify({ error: 'Internal server error', message: error.message }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
    },
  });
}

// CORS middleware
router.all('*', async (request, env, ctx) => {
  try {
    const response = await ctx.next();
    response.headers.set('Access-Control-Allow-Origin', 'https://go-auth.pages.dev');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error) {
    return await handleError(request, env, ctx, error);
  }
});

// Preflight OPTIONS (ensure Promise return)
router.options('*', async () => {
  return Promise.resolve(new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  }));
});

router.post('/register', async (request, env) => {
  try {
    const userService = new UserService(env.DB);
    return await register(request, userService);
  } catch (error) {
    return await handleError(request, env, {}, error);
  }
});

router.post('/login', async (request, env) => {
  try {
    const userService = new UserService(env.DB);
    const tokenService = new TokenService(config.jwtSecret);
    const sessionService = new SessionService(env.KV);
    const authService = new AuthService(userService, tokenService, sessionService);
    return await login(request, authService);
  } catch (error) {
    return await handleError(request, env, {}, error);
  }
});

router.post('/refresh-token', async (request, env) => {
  try {
    const tokenService = new TokenService(config.jwtSecret);
    const sessionService = new SessionService(env.KV);
    const authService = new AuthService(null, tokenService, sessionService);
    return await refresh(request, authService, tokenService);
  } catch (error) {
    return await handleError(request, env, {}, error);
  }
});

router.all('*', async () => {
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
      return await router.handle(request, env, ctx);
    } catch (error) {
      return await handleError(request, env, ctx, error);
    }
  },
};
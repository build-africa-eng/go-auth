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

// Timeout wrapper
const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), ms)
  );
  return Promise.race([promise, timeout]);
};

// Global error handler
async function handleError(request, env, error) {
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

// Preflight OPTIONS
router.options('*', () => {
  console.log(`OPTIONS request handled: ${new Date().toISOString()}`);
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
});

// Favicon route
router.get('/favicon.ico', () => {
  console.log(`Favicon request handled: ${new Date().toISOString()}`);
  return new Response(null, { status: 204 }); // No favicon, return empty response
});

// CORS middleware (bypass for GET/OPTIONS)
router.all('*', async ({ req, next }) => {
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    console.log(`Bypassing CORS for ${req.method} ${req.url}: ${new Date().toISOString()}`);
    return await next();
  }
  console.log(`CORS middleware start for ${req.method} ${req.url}: ${new Date().toISOString()}`);
  try {
    const start = Date.now();
    const response = await withTimeout(next(), 2000); // Reduced to 2s
    console.log(`CORS middleware took ${Date.now() - start}ms for ${req.url}`);
    response.headers.set('Access-Control-Allow-Origin', 'https://go-auth.pages.dev');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error) {
    console.error(`CORS middleware error for ${req.url}: ${error.message}`);
    return await handleError(req, {}, error);
  }
});

// Routes
router.post('/register', async ({ req, env }) => {
  try {
    console.log(`Register request start: ${new Date().toISOString()}`);
    const userService = new UserService(env.DB);
    return await withTimeout(register(req, userService), 2000);
  } catch (error) {
    return await handleError(req, env, error);
  }
});

router.post('/login', async ({ req, env }) => {
  try {
    console.log(`Login request start: ${new Date().toISOString()}`);
    const userService = new UserService(env.DB);
    const tokenService = new TokenService(config.jwtSecret);
    const sessionService = new SessionService(env.KV);
    const authService = new AuthService(userService, tokenService, sessionService);
    return await withTimeout(login(req, authService), 2000);
  } catch (error) {
    return await handleError(req, env, error);
  }
});

router.post('/refresh-token', async ({ req, env }) => {
  try {
    console.log(`Refresh token request start: ${new Date().toISOString()}`);
    const tokenService = new TokenService(config.jwtSecret);
    const sessionService = new SessionService(env.KV);
    const authService = new AuthService(null, tokenService, sessionService);
    return await withTimeout(refresh(req, authService, tokenService), 2000);
  } catch (error) {
    return await handleError(req, env, error);
  }
});

// Catch-all route
router.all('*', async ({ req }) => {
  console.log(`Catch-all route for ${req.url}: ${new Date().toISOString()}`);
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
    console.log(`Fetch request for ${request.url}: ${new Date().toISOString()}`);
    try {
      return await withTimeout(router.handle(request, env, ctx), 2000);
    } catch (error) {
      return await handleError(request, env, error);
    }
  },
};
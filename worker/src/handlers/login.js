export async function login(request, authService) {
  try {
    const { email, password } = await request.json();
    const { accessToken, refreshToken } = await authService.login(email, password);
    return new Response(JSON.stringify({ accessToken, refreshToken }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
export async function login(request, authService) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) throw new Error('Missing email or password');
    console.log(`Login handler: ${email}, ${new Date().toISOString()}`);
    const { accessToken, refreshToken } = await authService.login(email, password);
    return new Response(JSON.stringify({ accessToken, refreshToken }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
      },
    });
  }
}
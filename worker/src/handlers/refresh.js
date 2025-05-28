export async function refresh(request, authService, tokenService) {
  try {
    const { refreshToken } = await request.json();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }
    const token = authHeader.split(' ')[1];
    const { sub: userID } = tokenService.verifyToken(token);
    const accessToken = await authService.refresh(userID, refreshToken);
    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
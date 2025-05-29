export async function register(request, userService) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) throw new Error('Missing email or password');
    const result = await userService.register(email, password);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://go-auth.pages.dev',
      },
    });
  }
}
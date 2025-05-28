export async function register(request, userService) {
  try {
    const { email, password } = await request.json();
    await userService.register(email, password);
    return new Response(JSON.stringify({ message: 'User registered' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
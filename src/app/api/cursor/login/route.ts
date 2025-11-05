export async function POST(request: Request) {
  const body = await request.json();
  const { uuid, verifier, traceparent } = body as any;
  return fetch(`https://api2.cursor.sh/auth/poll?uuid=${uuid}&verifier=${verifier}`, {
    headers: {
      'x-ghost-mode': 'true',
      'x-new-onboarding-completed': 'false',
      'traceparent': traceparent
    }
  })
}  

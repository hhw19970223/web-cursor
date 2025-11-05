

export async function POST(request: Request) {
  const { WorkosCursorSessionToken } = await request.json();
  return fetch(`https://cursor.com/api/auth/me`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      'Origin': 'https://cursor.com/cn/dashboard',
      'Cookie': `WorkosCursorSessionToken=${WorkosCursorSessionToken}`
    }, 
  }).catch(error => {
    console.log('错误:', error)
  });
}  

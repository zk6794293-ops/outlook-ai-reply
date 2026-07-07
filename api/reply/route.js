export async function POST(req) {
  const { email } = await req.json()

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [{role: 'user', content: `Write a professional email reply to this: ${email}`}],
      temperature: 0.7
    })
  })

  const data = await res.json()
  return Response.json({reply: data.choices[0].message.content})
}
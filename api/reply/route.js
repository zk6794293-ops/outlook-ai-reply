export async function POST(req) {
  const { email } = await req.json()
  const reply = `Test Reply: ${email.slice(0,40)}...`
  return Response.json({ reply })
}

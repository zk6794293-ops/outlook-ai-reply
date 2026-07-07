import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  const { email } = await req.json()

  const chat = await groq.chat.completions.create({
    messages: [{ role: "user", content: `Reply professionally to: ${email}` }],
    model: "llama3-8b-8192"
  })

  return Response.json({ reply: chat.choices[0].message.content })
}

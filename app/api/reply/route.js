import Groq from "groq-sdk"

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: "GROQ_API_KEY missing in Vercel" }, { status: 500 })
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const chat = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional email assistant. Write short, polite replies." },
        { role: "user", content: `Write a professional reply to this email:\n\n${email}` }
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 300
    })

    return Response.json({ reply: chat.choices[0].message.content })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

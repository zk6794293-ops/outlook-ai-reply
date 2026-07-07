import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { email } = await req.json();
    const completion = await groq.chat.completions.create({
      messages: [{
        role: "user",
        content: `Write a professional email reply for this email: ${email}. Keep it short and polite.`
      }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 200
    });
    return Response.json({ reply: completion.choices[0].message.content });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

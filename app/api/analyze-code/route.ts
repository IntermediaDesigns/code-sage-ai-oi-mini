import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    const prompt = `Analyze the following ${language} code and provide suggestions for improvement, potential bugs, and best practices:

${code}

Please format your response in the following way:
1. Code Quality: [Brief overview of code quality]
2. Potential Bugs: [List any potential bugs]
3. Suggestions for Improvement: [List suggestions]
4. Best Practices: [List any best practices that could be applied]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing code:', error);
    return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
  }
}
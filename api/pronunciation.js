import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file found" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text"],
      messages: [
        {
          role: "system",
          content: "You are a British pronunciation coach. Listen to the audio and provide brief feedback on the user's British accent and vowel sounds."
        },
        {
          role: "user",
          content: [
            { type: "input_audio", input_audio: { data: audioFile, format: "wav" } }
          ]
        }
      ]
    });

    return NextResponse.json({ feedback: response.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

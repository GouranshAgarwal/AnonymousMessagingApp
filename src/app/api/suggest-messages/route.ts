// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// export const maxDuration = 30;

// export async function POST() {  
//   try {
//     const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

//     const model = openai('gpt-4o-mini');

//     const result = await streamText({
//       model,
//       messages: [{ role: "system", content: prompt }], // ✅ Use 'messages' instead of 'system'
//       maxTokens: 300
//     });

//     console.log("AI Response:", result);

//     return result.toDataStreamResponse();

//   } catch (error) {
//     console.error("LLM Error:", error);

//     return Response.json({
//         success: false,
//         message: "Error getting messages from LLM",
//         error: error?.message || JSON.stringify(error),
//     }, { status: 500 });
//   }
// }


import {openai} from '@ai-sdk/openai'
import { OpenAIStream, StreamingTextResponse, streamText } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = streamText({
      model: openai("gpt-4o-mini"),
      max_tokens: 400,
      stream: true,
      prompt,
    });

    const stream = OpenAIStream(response);
        
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // OpenAI API error handling
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // General error handling
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
}
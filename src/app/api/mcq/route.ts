import { NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

// Initialize the model with your API key
const model = new ChatGroq({
  modelName: "mixtral-8x7b-32768",
  temperature: 0.2,
  apiKey: process.env.GROQ_API_KEY,
});

// Define the prompt template with proper escaping
const template = `Generate 5 multiple choice questions about {topic}. 
Each question should:
- Be challenging but clear
- Have 4 options (A, B, C, D)
- Include one correct answer
- Provide a brief explanation

Format the response as valid JSON with this structure:
{{
  "questions": [
    {{
      "question_id": 1,
      "question": "Question text here?",
      "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      }},
      "correct_answer": "A",
      "explanation": "Explanation here"
    }}
  ]
}}

Ensure the response is ONLY the JSON object with no additional text.`;

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["topic"],
});

const chain = new LLMChain({
  llm: model,
  prompt: prompt,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic || topic.trim() === '') {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    console.log("Generating MCQs for topic:", topic); // Debug log

    const response = await chain.call({ topic });
    console.log("Raw LLM response:", response); // Debug log

    let mcqData;
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mcqData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse MCQ data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      topic: topic,
      timestamp: new Date().toISOString(),
      ...mcqData
    });

  } catch (error) {
    console.error("Error generating MCQs:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate MCQs",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    message: "MCQ API is running",
    timestamp: new Date().toISOString()
  });
}


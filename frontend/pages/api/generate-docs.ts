import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Google Gemini API key is not configured' });
    }

    // Create a prompt that will generate good documentation
    const prompt = `
    You are an expert developer with deep knowledge of documenting code.
    Please analyze the following ${language} code and generate comprehensive documentation for it.
    
    Include:
    1. A high-level overview of what the code does
    2. Detailed function/method descriptions with parameters and return values
    3. Explanations of complex logic or algorithms
    4. Any potential issues, edge cases, or optimization opportunities
    5. Usage examples where appropriate
    
    Format the documentation in a clear, professional style appropriate for ${language}.
    
    Here's the code to document:
    
    \`\`\`${language}
    ${code}
    \`\`\`
    `;

    // Call the Gemini API
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const documentation = response.text();

    return res.status(200).json({ documentation });
  } catch (error: any) {
    console.error('Error generating documentation:', error);
    return res.status(500).json({ 
      error: 'Failed to generate documentation', 
      details: error.message 
    });
  }
}
